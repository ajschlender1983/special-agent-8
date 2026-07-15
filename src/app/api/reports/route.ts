import { NextRequest, NextResponse } from 'next/server';
import { getExperience, updateExperience } from '@/lib/experience-store';
import { buildReportPrompt } from '@/lib/prompts';
import { getAnthropicClient, trackUsage, calculateCost } from '@/lib/ai-client';
import type { JourneyType } from '@/lib/brands';

export async function POST(request: NextRequest) {
  try {
    const { slug } = await request.json();
    if (!slug) return NextResponse.json({ error: 'Missing slug' }, { status: 400 });

    const experience = await getExperience(slug);
    if (!experience) return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
    if (!experience.conversation.length) return NextResponse.json({ error: 'No conversation to generate reports from' }, { status: 400 });

    const model = 'claude-sonnet-4-6';
    const anthropic = getAnthropicClient();
    const reportPrompt = buildReportPrompt(experience.journeyType as JourneyType, experience.name);

    const transcript = experience.conversation
      .map((m) => `${m.role === 'user' ? experience.name : 'Agent'}: ${m.content}`)
      .join('\n\n');

    const response = await anthropic.messages.create({
      model, max_tokens: 4096, system: reportPrompt,
      messages: [{ role: 'user', content: `Here is the complete conversation transcript. Generate the reports.\n\n${transcript}` }],
    });

    const inputTokens = response.usage?.input_tokens ?? 0;
    const outputTokens = response.usage?.output_tokens ?? 0;
    trackUsage({ slug, model, inputTokens, outputTokens, cost: calculateCost(model, inputTokens, outputTokens), timestamp: Date.now(), purpose: 'report' });

    const reportText = response.content[0].type === 'text' ? response.content[0].text : '';

    let reportData;
    try {
      reportData = JSON.parse(reportText);
    } catch {
      return NextResponse.json({ error: 'Failed to parse report data. Claude returned invalid JSON.' }, { status: 500 });
    }

    await updateExperience(slug, {
      status: 'completed',
      personReport: JSON.stringify(reportData.personReport),
      operatorReport: JSON.stringify(reportData.operatorReport),
    });

    return NextResponse.json({ success: true, slug });
  } catch (error) {
    return NextResponse.json({ error: 'Report generation failed: ' + String(error) }, { status: 500 });
  }
}
