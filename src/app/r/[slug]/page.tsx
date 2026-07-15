'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import type { Experience } from '@/lib/experience-store';

interface OperatorReport {
  readiness: 'high' | 'medium' | 'low';
  summary: string;
  insights: string[];
  recommendations: string[];
  transcript?: Array<{ role: string; content: string }>;
}

function parseOperatorReport(raw: string | null): OperatorReport | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return {
      readiness: 'medium',
      summary: raw,
      insights: [],
      recommendations: [],
    };
  }
}

const READINESS_COLORS: Record<string, { bg: string; text: string; glow: string; label: string }> = {
  high: { bg: 'rgba(16,185,129,0.15)', text: '#10b981', glow: '0 0 20px rgba(16,185,129,0.3)', label: 'High Readiness' },
  medium: { bg: 'rgba(245,158,11,0.15)', text: '#f59e0b', glow: '0 0 20px rgba(245,158,11,0.3)', label: 'Medium Readiness' },
  low: { bg: 'rgba(239,68,68,0.15)', text: '#ef4444', glow: '0 0 20px rgba(239,68,68,0.3)', label: 'Low Readiness' },
};

function OperatorReportContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const token = searchParams.get('token');

  const [experience, setExperience] = useState<Experience | null>(null);
  const [report, setReport] = useState<OperatorReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

  useEffect(() => {
    async function load() {
      // Token validation (basic check: must be present)
      if (!token) {
        setLoading(false);
        return;
      }
      setAuthorized(true);

      try {
        const res = await fetch(`/api/experience?slug=${slug}`);
        if (!res.ok) {
          setLoading(false);
          return;
        }
        const data: Experience = await res.json();
        setExperience(data);
        setReport(parseOperatorReport(data.operatorReport));
      } catch {
        // Failed to load
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug, token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-8 h-8 border-2 border-neutral-700 border-t-amber-500 rounded-full mx-auto mb-4"
          />
          <div className="text-neutral-500 text-sm">Loading intelligence report...</div>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="text-5xl mb-4 opacity-20">
            <svg className="w-12 h-12 mx-auto text-neutral-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
            Access Denied
          </h2>
          <p className="text-neutral-500 text-sm">A valid token is required to view this report.</p>
        </div>
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <h2 className="text-xl font-semibold text-white mb-2" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
            Experience not found
          </h2>
          <p className="text-neutral-500 text-sm">This experience may not exist yet.</p>
        </div>
      </div>
    );
  }

  const readinessStyle = READINESS_COLORS[report?.readiness ?? 'medium'];
  const tokenUsage = experience.tokenUsage;
  const hasTokenData = tokenUsage && (tokenUsage.input > 0 || tokenUsage.output > 0);

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Sticky glass header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-neutral-950/80 border-b border-white/5">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-500">Operator Intelligence</div>
            <h1 className="text-lg font-semibold text-white" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
              Special Agent #8
            </h1>
          </div>
          <div className="text-right">
            <div className="text-xs text-neutral-500">{experience.name}</div>
            <div className="text-[10px] text-neutral-600 font-mono">{experience.slug}</div>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
        {/* Readiness badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4"
        >
          <div
            className="px-5 py-2.5 rounded-full text-sm font-semibold animate-glow-pulse"
            style={{
              backgroundColor: readinessStyle.bg,
              color: readinessStyle.text,
              boxShadow: readinessStyle.glow,
            }}
          >
            {readinessStyle.label}
          </div>
          <div className="text-neutral-600 text-xs font-mono">
            {experience.status === 'completed' ? 'Conversation complete' : 'In progress'}
          </div>
        </motion.div>

        {/* Summary */}
        {report?.summary && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500 mb-3">Summary</div>
            <div className="glass rounded-2xl p-6">
              <p className="text-neutral-300 text-sm leading-[1.8]">{report.summary}</p>
            </div>
          </motion.section>
        )}

        {/* Key insights */}
        {report?.insights && report.insights.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500 mb-3">Key Insights</div>
            <div className="glass rounded-2xl p-6">
              <ol className="space-y-4">
                {report.insights.map((insight, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                    className="flex items-start gap-4"
                  >
                    <span className="text-amber-500/60 font-mono text-xs mt-0.5 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                    <div className="flex-1 border-l-2 border-amber-500/20 pl-4">
                      <p className="text-neutral-300 text-sm leading-relaxed italic">&ldquo;{insight}&rdquo;</p>
                    </div>
                  </motion.li>
                ))}
              </ol>
            </div>
          </motion.section>
        )}

        {/* Follow-up recommendations */}
        {report?.recommendations && report.recommendations.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500 mb-3">Follow-Up Recommendations</div>
            <div className="glass rounded-2xl p-6 space-y-3">
              {report.recommendations.map((rec, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.4 + i * 0.08 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 bg-amber-500/10 text-amber-500">
                    {i + 1}
                  </div>
                  <p className="text-neutral-300 text-sm leading-relaxed">{rec}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Transcript section (collapsible) */}
        {experience.conversation && experience.conversation.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <button
              onClick={() => setShowTranscript(!showTranscript)}
              className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500 hover:text-neutral-300 transition-colors mb-3"
            >
              <span>Transcript ({experience.conversation.length} messages)</span>
              <motion.svg
                animate={{ rotate: showTranscript ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="w-3 h-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </motion.svg>
            </button>
            <AnimatePresence>
              {showTranscript && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="glass rounded-2xl p-6 space-y-4 max-h-[600px] overflow-y-auto">
                    {experience.conversation.map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === 'assistant' ? 'justify-start' : 'justify-end'}`}>
                        <div className={`max-w-[85%] rounded-xl px-4 py-3 text-sm ${
                          msg.role === 'assistant'
                            ? 'bg-neutral-800/50 border-l-2 border-amber-500/30 text-neutral-300'
                            : 'bg-neutral-800 text-neutral-200'
                        }`}>
                          <div className="text-[9px] font-mono uppercase tracking-wider text-neutral-600 mb-1">
                            {msg.role === 'assistant' ? 'Agent 8' : experience.name}
                          </div>
                          <div className="leading-relaxed">{msg.content}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>
        )}

        {/* Token usage stats */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500 mb-3">Usage</div>
          <div className="grid grid-cols-3 gap-3">
            <div className="glass rounded-xl p-4 text-center">
              <div className="text-[10px] font-mono uppercase text-neutral-600 mb-1">Input Tokens</div>
              <div className="text-lg font-semibold text-neutral-300 font-mono">
                {hasTokenData ? tokenUsage.input.toLocaleString() : '--'}
              </div>
            </div>
            <div className="glass rounded-xl p-4 text-center">
              <div className="text-[10px] font-mono uppercase text-neutral-600 mb-1">Output Tokens</div>
              <div className="text-lg font-semibold text-neutral-300 font-mono">
                {hasTokenData ? tokenUsage.output.toLocaleString() : '--'}
              </div>
            </div>
            <div className="glass rounded-xl p-4 text-center">
              <div className="text-[10px] font-mono uppercase text-neutral-600 mb-1">Est. Cost</div>
              <div className="text-lg font-semibold text-neutral-300 font-mono">
                {hasTokenData ? `$${tokenUsage.cost.toFixed(4)}` : '--'}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Footer */}
        <div className="text-center pt-6 border-t border-white/5">
          <p className="text-neutral-600 text-xs font-mono">
            Special Agent #8 Operator Report -- {new Date(experience.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function OperatorReportPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-neutral-500 text-sm">Loading...</div>
      </div>
    }>
      <OperatorReportContent />
    </Suspense>
  );
}
