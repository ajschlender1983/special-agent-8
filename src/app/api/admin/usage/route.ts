import { NextResponse } from 'next/server';
import { getUsageStats, getDailyCost } from '@/lib/ai-client';

export async function GET() {
  const stats = getUsageStats();
  const dailyBudget = 5.0;
  return NextResponse.json({
    ...stats,
    budget: { dailyCap: dailyBudget, spent: getDailyCost(), remaining: Math.round(Math.max(0, dailyBudget - getDailyCost()) * 10000) / 10000, percentUsed: Math.round((getDailyCost() / dailyBudget) * 100) },
  });
}
