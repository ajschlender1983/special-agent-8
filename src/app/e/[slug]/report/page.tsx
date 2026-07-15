'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'motion/react';
import { BrandProvider } from '@/components/brand/brand-provider';
import { FrameworkVisual } from '@/components/report/framework-visual';
import { brands } from '@/lib/brands';
import type { Experience } from '@/lib/experience-store';
import type { BrandId } from '@/lib/brands';

interface PersonReport {
  tagline: string;
  mirror: string;
  framework: {
    type: 'radar' | 'bar';
    labels: string[];
    values: number[];
    maxValue?: number;
  };
  nextSteps: Array<{ title: string; description: string }>;
}

function parseReport(raw: string | null): PersonReport | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    // If it's not JSON, treat as a text-based report
    return {
      tagline: 'Your reflection awaits',
      mirror: raw,
      framework: { type: 'bar', labels: [], values: [] },
      nextSteps: [],
    };
  }
}

export default function PersonReportPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [experience, setExperience] = useState<Experience | null>(null);
  const [report, setReport] = useState<PersonReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/experience?slug=${slug}`);
        if (!res.ok) {
          setLoading(false);
          return;
        }
        const data: Experience = await res.json();
        setExperience(data);
        setReport(parseReport(data.personReport));
      } catch {
        // Failed to load
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-16 h-16 rounded-full mx-auto mb-4 animate-shimmer"
            style={{ background: 'radial-gradient(circle, rgba(212,165,116,0.3), transparent 70%)' }}
          />
          <div className="text-neutral-500 text-sm">Loading your report...</div>
        </div>
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="text-5xl mb-4 opacity-20">?</div>
          <h2 className="text-xl font-semibold text-white mb-2" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
            Report not found
          </h2>
          <p className="text-neutral-500 text-sm">This experience may not exist or hasn&apos;t been completed yet.</p>
        </div>
      </div>
    );
  }

  const brand = brands[experience.brand];
  const chartType = experience.journeyType === 'participant' ? 'radar' : 'bar';

  return (
    <BrandProvider brand={brand}>
      <div className="min-h-screen">
        {/* Hero section */}
        <section className="relative py-20 px-6 overflow-hidden">
          <div className="absolute inset-0 aurora-bg opacity-30 pointer-events-none" />
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 max-w-2xl mx-auto text-center"
          >
            <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-[var(--color-text-muted)] mb-4">
              {experience.name}&apos;s Report
            </div>
            <h1
              className="text-4xl md:text-5xl font-bold gradient-text leading-tight mb-4"
              style={{ fontFamily: 'var(--font-heading, "Cormorant Garamond", serif)' }}
            >
              {report?.tagline ?? 'Your Reflection'}
            </h1>
            <p className="text-[var(--color-text-muted)] text-sm">
              Generated from your conversation with Special Agent #8
            </p>
          </motion.div>
        </section>

        {/* Content */}
        <div className="max-w-2xl mx-auto px-6 pb-20 space-y-8">
          {/* The Mirror section */}
          {report?.mirror && (
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-3">
                The Mirror
              </div>
              <div className="glass rounded-2xl p-6 md:p-8">
                <div className="text-[var(--color-text)] text-base leading-[1.8] whitespace-pre-wrap">
                  {report.mirror}
                </div>
              </div>
            </motion.section>
          )}

          {/* Framework visualization */}
          {report?.framework && report.framework.labels.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-3">
                Your Framework
              </div>
              <div className="glass rounded-2xl p-6 md:p-8">
                <FrameworkVisual
                  type={chartType}
                  data={Object.fromEntries(report.framework.labels.map((l: string, i: number) => [l, report.framework.values[i] ?? 0]))}
                  primaryColor={brand.colors.primary}
                />
              </div>
            </motion.section>
          )}

          {/* Next steps */}
          {report?.nextSteps && report.nextSteps.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-3">
                Next Steps
              </div>
              <div className="space-y-3">
                {report.nextSteps.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                    whileHover={{ x: 4 }}
                    className="glass rounded-xl p-5 flex items-start gap-4 cursor-default group"
                  >
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-transform group-hover:scale-110"
                      style={{ backgroundColor: `${brand.colors.primary}20`, color: brand.colors.primary }}
                    >
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-[var(--color-text)] text-sm mb-1">{step.title}</div>
                      <div className="text-[var(--color-text-muted)] text-xs leading-relaxed">{step.description}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-center pt-8 border-t border-white/5"
          >
            <p className="text-[var(--color-text-muted)] text-xs">
              Crafted by Special Agent #8 for {experience.name}
            </p>
          </motion.div>
        </div>
      </div>
    </BrandProvider>
  );
}
