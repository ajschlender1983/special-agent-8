import Anthropic from '@anthropic-ai/sdk';

let _anthropic: Anthropic | null = null;
export function getAnthropicClient(): Anthropic {
  if (!_anthropic) {
    _anthropic = new Anthropic({
      apiKey: process.env.SA8_ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY,
    });
  }
  return _anthropic;
}

export interface TokenUsage {
  slug: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  cost: number;
  timestamp: number;
  purpose: 'conversation' | 'report' | 'meeting-prep' | 'summary';
}

const MODEL_COSTS: Record<string, { input: number; output: number }> = {
  'claude-sonnet-4-6': { input: 3.0, output: 15.0 },
  'claude-haiku-4-5-20251001': { input: 1.0, output: 5.0 },
};

const usageLog: TokenUsage[] = [];
const dailyCostCache: Record<string, number> = {};

export function selectModel(purpose: TokenUsage['purpose']): string {
  switch (purpose) {
    case 'conversation':
    case 'report':
      return 'claude-sonnet-4-6';
    case 'meeting-prep':
    case 'summary':
      return 'claude-haiku-4-5-20251001';
    default:
      return 'claude-sonnet-4-6';
  }
}

export function calculateCost(model: string, inputTokens: number, outputTokens: number): number {
  const costs = MODEL_COSTS[model] ?? MODEL_COSTS['claude-sonnet-4-6'];
  return (inputTokens * costs.input + outputTokens * costs.output) / 1_000_000;
}

export function trackUsage(usage: TokenUsage): void {
  usageLog.push(usage);
  const dayKey = new Date(usage.timestamp).toISOString().slice(0, 10);
  dailyCostCache[dayKey] = (dailyCostCache[dayKey] ?? 0) + usage.cost;
}

export function getDailyCost(date?: string): number {
  const dayKey = date ?? new Date().toISOString().slice(0, 10);
  return dailyCostCache[dayKey] ?? 0;
}

export function checkBudget(dailyCapUSD: number = 5.0): boolean {
  return getDailyCost() < dailyCapUSD;
}

export function getUsageStats() {
  const today = new Date().toISOString().slice(0, 10);
  const todayLogs = usageLog.filter(u => new Date(u.timestamp).toISOString().slice(0, 10) === today);
  const totalCostToday = todayLogs.reduce((sum, u) => sum + u.cost, 0);
  const totalTokensToday = todayLogs.reduce((sum, u) => sum + u.inputTokens + u.outputTokens, 0);
  const byModel: Record<string, number> = {};
  const byPurpose: Record<string, number> = {};
  for (const u of todayLogs) {
    byModel[u.model] = (byModel[u.model] ?? 0) + u.cost;
    byPurpose[u.purpose] = (byPurpose[u.purpose] ?? 0) + u.cost;
  }
  return {
    today: { cost: Math.round(totalCostToday * 10000) / 10000, tokens: totalTokensToday, calls: todayLogs.length, byModel, byPurpose },
    allTime: { cost: Math.round(usageLog.reduce((s, u) => s + u.cost, 0) * 10000) / 10000, calls: usageLog.length },
  };
}

export function getSlugUsage(slug: string): { input: number; output: number; cost: number } {
  const logs = usageLog.filter(u => u.slug === slug);
  return {
    input: logs.reduce((s, u) => s + u.inputTokens, 0),
    output: logs.reduce((s, u) => s + u.outputTokens, 0),
    cost: Math.round(logs.reduce((s, u) => s + u.cost, 0) * 10000) / 10000,
  };
}
