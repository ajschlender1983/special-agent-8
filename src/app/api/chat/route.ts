import { NextRequest } from 'next/server';
import { buildSystemPrompt } from '@/lib/prompts';
import { getContextPack } from '@/lib/context-packs';
import { getExperience, updateExperience } from '@/lib/experience-store';
import { getAnthropicClient, trackUsage, calculateCost, checkBudget } from '@/lib/ai-client';
import type { JourneyType } from '@/lib/brands';

export async function POST(request: NextRequest) {
  const { slug, messages } = await request.json();

  if (!slug || !messages) {
    return new Response(JSON.stringify({ error: 'Missing slug or messages' }), { status: 400 });
  }

  if (!checkBudget()) {
    return new Response(JSON.stringify({ error: 'Daily budget exceeded. Try again tomorrow.' }), { status: 429 });
  }

  const experience = await getExperience(slug);
  if (!experience) {
    return new Response(JSON.stringify({ error: 'Experience not found' }), { status: 404 });
  }

  if (experience.status === 'completed') {
    return new Response(JSON.stringify({ error: 'Experience already completed' }), { status: 400 });
  }

  const contextPack = getContextPack(experience.journeyType as JourneyType);
  const systemPrompt = buildSystemPrompt(
    experience.journeyType as JourneyType,
    experience.name,
    experience.operatorContext,
    contextPack,
    experience.format
  );

  // Build image blocks for first message
  const imageBlocks = messages.length === 0 && experience.contextImages?.length
    ? experience.contextImages.map((img: string) => {
        const match = img.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
        if (!match) return null;
        return {
          type: 'image' as const,
          source: { type: 'base64' as const, media_type: match[1] as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp', data: match[2] },
        };
      }).filter(Boolean)
    : [];

  const apiMessages = messages.length === 0
    ? imageBlocks.length > 0
      ? [{ role: 'user' as const, content: [...imageBlocks, { type: 'text' as const, text: 'The operator has shared these screenshots as additional context. Use this visual context to inform your conversation but do not mention the screenshots. Begin now.' }] }]
      : [{ role: 'user' as const, content: 'Begin the conversation now.' }]
    : messages.map((m: { role: string; content: string }) => ({ role: m.role as 'user' | 'assistant', content: m.content }));

  const model = 'claude-sonnet-4-6';
  const anthropic = getAnthropicClient();
  const stream = anthropic.messages.stream({ model, max_tokens: 1024, system: systemPrompt, messages: apiMessages });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      let fullResponse = '';
      let closed = false;
      const safeEnqueue = (data: string) => { if (!closed) { try { controller.enqueue(encoder.encode(data)); } catch { closed = true; } } };
      const safeClose = () => { if (!closed) { try { controller.close(); closed = true; } catch { closed = true; } } };

      stream.on('text', (text) => {
        fullResponse += text;
        safeEnqueue(`data: ${JSON.stringify({ type: 'text', text })}\n\n`);
      });

      stream.on('end', async () => {
        try {
          const finalMessage = await stream.finalMessage();
          const inputTokens = finalMessage.usage?.input_tokens ?? 0;
          const outputTokens = finalMessage.usage?.output_tokens ?? 0;
          trackUsage({ slug, model, inputTokens, outputTokens, cost: calculateCost(model, inputTokens, outputTokens), timestamp: Date.now(), purpose: 'conversation' });
        } catch { /* non-critical */ }

        const updatedMessages = [...messages, { role: 'assistant', content: fullResponse, timestamp: Date.now() }];
        await updateExperience(slug, { conversation: updatedMessages });

        const isComplete = /\[COMPLETE\]/i.test(fullResponse);
        safeEnqueue(`data: ${JSON.stringify({ type: 'done', isComplete })}\n\n`);
        safeClose();
      });

      stream.on('error', (error) => {
        safeEnqueue(`data: ${JSON.stringify({ type: 'error', error: String(error) })}\n\n`);
        safeClose();
      });
    },
  });

  return new Response(readable, {
    headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' },
  });
}
