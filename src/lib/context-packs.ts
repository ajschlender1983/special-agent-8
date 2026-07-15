import fs from 'fs';
import path from 'path';
import type { JourneyType } from './brands';

const cache = new Map<JourneyType, string>();

const packFiles: Record<JourneyType, string> = {
  participant: 'aoj-context.md',
  'prospect-p42': 'p42-context.md',
  'prospect-fsl': 'fsl-context.md',
  'customer-opus': 'opus-context.md',
  investor: 'investor-context.md',
};

export function getContextPack(journeyType: JourneyType): string {
  if (cache.has(journeyType)) return cache.get(journeyType)!;
  const filePath = path.join(process.cwd(), 'content', packFiles[journeyType]);
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    cache.set(journeyType, content);
    return content;
  } catch {
    return '';
  }
}
