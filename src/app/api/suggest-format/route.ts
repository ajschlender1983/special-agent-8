import { NextRequest, NextResponse } from 'next/server';
import { getAnthropicClient, trackUsage, calculateCost } from '@/lib/ai-client';

export async function POST(request: NextRequest) {
  const { name, journeyType, who, values, intention, additional, imageCount } = await request.json();

  if (!name || !journeyType) return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });

  const anthropic = getAnthropicClient();
  const model = 'claude-haiku-4-5-20251001';

  const prompt = `You are Special Agent #8's format advisor. Based on the operator's inputs, suggest the ideal experience format.

PERSON: ${name}
JOURNEY TYPE: ${journeyType}
WHO: ${who || 'Not provided'}
VALUES: ${values || 'Not provided'}
INTENTION: ${intention || 'Not provided'}
ADDITIONAL: ${additional || 'Not provided'}
SCREENSHOTS: ${imageCount || 0}

Return ONLY valid JSON (no markdown):
{
  "depth": "quick" | "standard" | "deep",
  "questionCount": number,
  "reportStyle": "snapshot" | "report" | "deep-dive",
  "suggestedReason": "1-2 sentences why this format fits",
  "personaRead": "1 sentence capturing who this person is"
}

GUIDELINES:
- "quick" (2-3 questions, ~5 min): thin context, busy person, simple intro
- "standard" (4-5 questions, ~15 min): default, good context, clear intention
- "deep" (6-8 questions, ~30 min): rich context, turning point, high stakes
- Multiple screenshots + detailed context → lean "deep"
- Investor journeys → at least "standard"`;

  try {
    const response = await anthropic.messages.create({ model, max_tokens: 300, messages: [{ role: 'user', content: prompt }] });
    const inputTokens = response.usage?.input_tokens ?? 0;
    const outputTokens = response.usage?.output_tokens ?? 0;
    trackUsage({ slug: 'format-suggestion', model, inputTokens, outputTokens, cost: calculateCost(model, inputTokens, outputTokens), timestamp: Date.now(), purpose: 'summary' });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    return NextResponse.json(JSON.parse(text));
  } catch {
    return NextResponse.json({ depth: 'standard', questionCount: 5, reportStyle: 'report', suggestedReason: 'Standard format — solid default.', personaRead: name });
  }
}
