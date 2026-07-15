'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { BrandProvider } from '@/components/brand/brand-provider';
import { ChatInterface } from '@/components/chat/chat-interface';
import { brands, journeyLabels } from '@/lib/brands';
import { generateGoogleCalendarUrl, parseNextSteps, stripTags } from '@/lib/calendar';
import type { Experience } from '@/lib/experience-store';
import type { BrandId } from '@/lib/brands';
import type { NextStep } from '@/lib/calendar';

type PageState = 'loading' | 'not-found' | 'active' | 'completed';

export default function ExperiencePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [state, setState] = useState<PageState>('loading');
  const [experience, setExperience] = useState<Experience | null>(null);
  const [completionData, setCompletionData] = useState<{ nextSteps: NextStep[]; finalMessage: string } | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/experience?slug=${slug}`);
        if (!res.ok) {
          setState('not-found');
          return;
        }
        const data: Experience = await res.json();
        if (data.status === 'completed') {
          router.replace(`/e/${slug}/report`);
          return;
        }
        setExperience(data);
        setState('active');
      } catch {
        setState('not-found');
      }
    }
    load();
  }, [slug, router]);

  const handleComplete = useCallback((nextSteps: NextStep[]) => {
    setCompletionData({ nextSteps, finalMessage: 'Your personalized experience is complete.' });
    setState('completed');
  }, []);

  // Loading state
  if (state === 'loading') {
    const loadingBrand = experience?.brand ?? 'aoj';
    const brand = brands[loadingBrand];
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-20 h-20 rounded-full mx-auto mb-6 animate-shimmer"
            style={{ background: `radial-gradient(circle, ${brand.colors.primary}40, transparent 70%)` }}
          />
          <div className="text-neutral-400 text-sm animate-fade-in">Loading your experience...</div>
        </div>
      </div>
    );
  }

  // Not found state
  if (state === 'not-found') {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="text-6xl mb-4 opacity-20">?</div>
          <h2 className="text-xl font-semibold text-white mb-2" style={{ fontFamily: 'var(--font-heading, "Cormorant Garamond", serif)' }}>
            Experience not found
          </h2>
          <p className="text-neutral-500 text-sm">This link may have expired or doesn&apos;t exist.</p>
        </div>
      </div>
    );
  }

  if (!experience) return null;
  const brand = brands[experience.brand];

  // Completed / cinematic outro
  if (state === 'completed' && completionData) {
    return (
      <BrandProvider brand={brand}>
        <div className="min-h-screen flex flex-col">
          {/* Cinematic completion screen */}
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="max-w-lg w-full">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-center mb-10"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.3 }}
                  className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center animate-glow-pulse"
                  style={{ backgroundColor: `${brand.colors.primary}20` }}
                >
                  <svg className="w-10 h-10" style={{ color: brand.colors.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </motion.div>

                <h2
                  className="text-3xl font-bold mb-3 gradient-text"
                  style={{ fontFamily: 'var(--font-heading, "Cormorant Garamond", serif)' }}
                >
                  Your experience is complete
                </h2>
                <p className="text-[var(--color-text-muted)] text-sm leading-relaxed max-w-md mx-auto">
                  {completionData.finalMessage.slice(0, 200)}{completionData.finalMessage.length > 200 ? '...' : ''}
                </p>
              </motion.div>

              {/* Next steps cards */}
              {completionData.nextSteps.length > 0 && (
                <div className="space-y-3 mb-8">
                  <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--color-text-muted)] text-center mb-4">
                    Your Next Steps
                  </div>
                  {completionData.nextSteps.map((step, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                      className="glass rounded-xl p-4 flex items-start gap-4"
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                        style={{ backgroundColor: `${brand.colors.primary}20`, color: brand.colors.primary }}
                      >
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-[var(--color-text)] text-sm">{step.title}</div>
                        <div className="text-[var(--color-text-muted)] text-xs mt-1">{step.description}</div>
                      </div>
                      <a
                        href={generateGoogleCalendarUrl(step)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 text-[10px] font-mono uppercase px-3 py-1.5 rounded-lg transition-colors hover:opacity-80"
                        style={{ backgroundColor: `${brand.colors.primary}15`, color: brand.colors.primary }}
                      >
                        + Cal
                      </a>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* View report button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push(`/e/${slug}/report`)}
                  className="w-full py-3.5 rounded-xl font-medium text-sm transition-all"
                  style={{ backgroundColor: brand.colors.primary, color: brand.darkMode ? '#0a0a0a' : '#ffffff' }}
                >
                  View Your Report
                </motion.button>
              </motion.div>
            </div>
          </div>
        </div>
      </BrandProvider>
    );
  }

  // Active chat state
  return (
    <BrandProvider brand={brand}>
      <div className="min-h-screen flex flex-col">
        {/* Glass header */}
        <header className="sticky top-0 z-50 glass backdrop-blur-xl border-b border-white/5">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold"
              style={{ backgroundColor: `${brand.colors.primary}20`, color: brand.colors.primary }}
            >
              8
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-[var(--color-text)]" style={{ fontFamily: 'var(--font-heading, "Cormorant Garamond", serif)' }}>
                {brand.name}
              </div>
              <div className="text-[10px] text-[var(--color-text-muted)]">
                {journeyLabels[experience.journeyType]}
              </div>
            </div>
          </div>
        </header>

        {/* Chat interface */}
        <div className="flex-1">
          <ChatInterface
            slug={slug}
            personName={experience.name}
            onComplete={handleComplete}
          />
        </div>
      </div>
    </BrandProvider>
  );
}
