export interface NextStep {
  title: string;
  timing: string;
  duration: number;
  description: string;
}

export function parseNextSteps(text: string): NextStep[] {
  const match = text.match(/\[NEXT_STEPS\]([\s\S]*?)\[\/NEXT_STEPS\]/);
  if (!match) return [];
  try {
    const data = JSON.parse(match[1]);
    return data.steps ?? [];
  } catch {
    return [];
  }
}

export function stripTags(text: string): string {
  return text
    .replace(/\[NEXT_STEPS\][\s\S]*?\[\/NEXT_STEPS\]/g, '')
    .replace(/\[COMPLETE\]/gi, '')
    .trim();
}

export function generateGoogleCalendarUrl(step: NextStep): string {
  const now = new Date();
  const timingMatch = step.timing.match(/^\+(\d+)d(\d{2}):(\d{2})$/);
  let start: Date;
  if (timingMatch) {
    const [, days, hours, minutes] = timingMatch;
    start = new Date(now);
    start.setDate(start.getDate() + parseInt(days));
    start.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  } else {
    start = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    start.setHours(9, 0, 0, 0);
  }
  const end = new Date(start.getTime() + step.duration * 60 * 1000);
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(step.title)}&dates=${fmt(start)}/${fmt(end)}&details=${encodeURIComponent(step.description)}`;
}
