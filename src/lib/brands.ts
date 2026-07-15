export type BrandId = 'aoj' | 'p42' | 'fsl' | 'opus' | 'lpl';
export type JourneyType = 'participant' | 'prospect-p42' | 'prospect-fsl' | 'customer-opus' | 'investor';

export interface Brand {
  id: BrandId;
  name: string;
  tagline: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textMuted: string;
    accent: string;
  };
  fonts: { heading: string; body: string };
  darkMode: boolean;
}

export const brands: Record<BrandId, Brand> = {
  aoj: {
    id: 'aoj', name: 'Alchemy of Joy', tagline: 'The 90-Day Joy Journey',
    colors: { primary: '#D4A574', secondary: '#E8C9A0', background: '#FDF8F0', surface: '#FFFFFF', text: '#2D2D2D', textMuted: '#8B8B8B', accent: '#B8956A' },
    fonts: { heading: "'Cormorant Garamond', serif", body: "'Inter', sans-serif" },
    darkMode: false,
  },
  p42: {
    id: 'p42', name: 'POWER of 42', tagline: 'Map Your Source Field',
    colors: { primary: '#D4A574', secondary: '#A89070', background: '#1A1A1A', surface: '#2A2A2A', text: '#F5F5F5', textMuted: '#999999', accent: '#E8C9A0' },
    fonts: { heading: "'Cormorant Garamond', serif", body: "'Inter', sans-serif" },
    darkMode: true,
  },
  fsl: {
    id: 'fsl', name: 'Full Spectrum Love', tagline: 'Love as a Full Spectrum',
    colors: { primary: '#C4788A', secondary: '#E8B4C4', background: '#FFF5F7', surface: '#FFFFFF', text: '#2D2D2D', textMuted: '#8B8B8B', accent: '#A85670' },
    fonts: { heading: "'Cormorant Garamond', serif", body: "'Inter', sans-serif" },
    darkMode: false,
  },
  opus: {
    id: 'opus', name: 'Opus SoundTemple', tagline: 'Sound as Medicine',
    colors: { primary: '#6A8CAF', secondary: '#4A6C8F', background: '#0F1520', surface: '#1A2535', text: '#E8EDF2', textMuted: '#8899AA', accent: '#7BA3C9' },
    fonts: { heading: "'Cormorant Garamond', serif", body: "'Inter', sans-serif" },
    darkMode: true,
  },
  lpl: {
    id: 'lpl', name: 'Light Pump Labs', tagline: 'Engineering Feelings at Scale',
    colors: { primary: '#D4A574', secondary: '#F0D4A8', background: '#0A0A0A', surface: '#1A1A1A', text: '#F5F5F5', textMuted: '#888888', accent: '#E8C9A0' },
    fonts: { heading: "'Cormorant Garamond', serif", body: "'Inter', sans-serif" },
    darkMode: true,
  },
};

export const journeyBrandMap: Record<JourneyType, BrandId> = {
  participant: 'aoj',
  'prospect-p42': 'p42',
  'prospect-fsl': 'fsl',
  'customer-opus': 'opus',
  investor: 'lpl',
};

export const journeyLabels: Record<JourneyType, string> = {
  participant: 'AOJ Participant',
  'prospect-p42': 'P42 Prospect',
  'prospect-fsl': 'FSL Prospect',
  'customer-opus': 'Opus Customer',
  investor: 'LPL Investor',
};

export function getBrandCSSVars(brand: Brand): Record<string, string> {
  return {
    '--color-primary': brand.colors.primary,
    '--color-secondary': brand.colors.secondary,
    '--color-background': brand.colors.background,
    '--color-surface': brand.colors.surface,
    '--color-text': brand.colors.text,
    '--color-text-muted': brand.colors.textMuted,
    '--color-accent': brand.colors.accent,
    '--font-heading': brand.fonts.heading,
    '--font-body': brand.fonts.body,
  };
}
