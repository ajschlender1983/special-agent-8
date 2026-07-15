import type { JourneyType, BrandId } from './brands';

export interface StructuredContext {
  who: string;
  values: string;
  intention: string;
  additional: string;
}

export interface ExperienceFormat {
  depth: 'quick' | 'standard' | 'deep';
  questionCount: number;
  reportStyle: 'snapshot' | 'report' | 'deep-dive';
  suggestedReason: string;
}

export interface Experience {
  slug: string;
  name: string;
  journeyType: JourneyType;
  brand: BrandId;
  operatorContext: string;
  structuredContext: StructuredContext;
  contextImages: string[];
  format: ExperienceFormat;
  createdAt: string;
  status: 'active' | 'completed';
  conversation: Array<{ role: 'user' | 'assistant'; content: string; timestamp: number }>;
  personReport: string | null;
  operatorReport: string | null;
  tokenUsage: { input: number; output: number; cost: number };
}

const store = new Map<string, Experience>();

export async function getExperience(slug: string): Promise<Experience | null> {
  return store.get(`experience:${slug}`) ?? null;
}

export async function createExperience(data: Omit<Experience, 'createdAt' | 'status' | 'conversation' | 'personReport' | 'operatorReport' | 'tokenUsage'>): Promise<Experience> {
  const experience: Experience = {
    ...data,
    contextImages: data.contextImages ?? [],
    structuredContext: data.structuredContext ?? { who: '', values: '', intention: '', additional: '' },
    format: data.format ?? { depth: 'standard', questionCount: 5, reportStyle: 'report', suggestedReason: '' },
    createdAt: new Date().toISOString(),
    status: 'active',
    conversation: [],
    personReport: null,
    operatorReport: null,
    tokenUsage: { input: 0, output: 0, cost: 0 },
  };
  store.set(`experience:${experience.slug}`, experience);
  return experience;
}

export async function updateExperience(slug: string, updates: Partial<Experience>): Promise<Experience | null> {
  const existing = store.get(`experience:${slug}`);
  if (!existing) return null;
  const updated = { ...existing, ...updates };
  store.set(`experience:${slug}`, updated);
  return updated;
}

export async function listExperiences(): Promise<Experience[]> {
  return Array.from(store.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}
