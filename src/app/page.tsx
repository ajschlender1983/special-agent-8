'use client';

import { useState, useRef, useCallback, type DragEvent, type ClipboardEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { journeyLabels, brands, journeyBrandMap } from '@/lib/brands';
import type { JourneyType, BrandId } from '@/lib/brands';
import ApplicationForm from '@/components/ApplicationForm';
import Gallery from '@/components/Gallery';
import CalendarView from '@/components/CalendarView';

type Step = 'context' | 'review' | 'done';
type Depth = 'quick' | 'standard' | 'deep';

const DEPTH_INFO: Record<Depth, { label: string; time: string; questions: string }> = {
  quick: { label: 'Quick Snapshot', time: '~5 min', questions: '2-3 questions' },
  standard: { label: 'Standard', time: '~15 min', questions: '4-5 questions' },
  deep: { label: 'Deep Dive', time: '~30 min', questions: '6-8 questions' },
};

interface SuggestResponse {
  depth: Depth;
  questionCount: number;
  reportStyle: 'snapshot' | 'report' | 'deep-dive';
  suggestedReason: string;
  personaRead: string;
}

interface CreateResponse {
  slug: string;
  experienceUrl: string;
  operatorUrl: string;
}

export default function AdminPage() {
  const [step, setStep] = useState<Step>('context');
  const [name, setName] = useState('');
  const [journeyType, setJourneyType] = useState<JourneyType | ''>('');
  const [context, setContext] = useState({ who: '', values: '', intention: '', additional: '' });
  const [contextImages, setContextImages] = useState<Record<string, string[]>>({ who: [], values: [], intention: [], additional: [] });
  const [loading, setLoading] = useState(false);

  // Review step state
  const [suggestion, setSuggestion] = useState<SuggestResponse | null>(null);
  const [selectedDepth, setSelectedDepth] = useState<Depth>('standard');

  // Done step state
  const [result, setResult] = useState<CreateResponse | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Demo components visibility
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const allImages = Object.values(contextImages).flat();

  async function handleAnalyze() {
    if (!name.trim() || !journeyType) return;
    setLoading(true);
    try {
      const res = await fetch('/api/suggest-format', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, journeyType,
          who: context.who, values: context.values,
          intention: context.intention, additional: context.additional,
          imageCount: allImages.length,
        }),
      });
      const data: SuggestResponse = await res.json();
      setSuggestion(data);
      setSelectedDepth(data.depth);
      setStep('review');
    } catch {
      setSuggestion({
        depth: 'standard', questionCount: 5, reportStyle: 'report',
        suggestedReason: 'Standard format selected as default.',
        personaRead: name,
      });
      setSelectedDepth('standard');
      setStep('review');
    } finally {
      setLoading(false);
    }
  }

  async function handleLaunch() {
    if (!suggestion) return;
    setLoading(true);
    try {
      const depthInfo = DEPTH_INFO[selectedDepth];
      const questionCount = selectedDepth === 'quick' ? 3 : selectedDepth === 'standard' ? 5 : 7;
      const reportStyle = selectedDepth === 'quick' ? 'snapshot' : selectedDepth === 'deep' ? 'deep-dive' : 'report';

      const res = await fetch('/api/experience', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, journeyType,
          structuredContext: context,
          contextImages: allImages,
          format: {
            depth: selectedDepth,
            questionCount,
            reportStyle,
            suggestedReason: suggestion.suggestedReason,
          },
        }),
      });
      const data: CreateResponse = await res.json();
      setResult(data);
      setStep('done');
    } catch (err) {
      console.error('Failed to create experience:', err);
    } finally {
      setLoading(false);
    }
  }

  function copyToClipboard(text: string, field: string) {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  }

  function handleReset() {
    setStep('context');
    setName('');
    setJourneyType('');
    setContext({ who: '', values: '', intention: '', additional: '' });
    setContextImages({ who: [], values: [], intention: [], additional: [] });
    setSuggestion(null);
    setSelectedDepth('standard');
    setResult(null);
  }

  const brandId: BrandId | undefined = journeyType ? journeyBrandMap[journeyType] : undefined;
  const accentColor = brandId ? brands[brandId].colors.primary : '#f59e0b';

  return (
    <div className="relative min-h-screen bg-neutral-950 text-white overflow-hidden">
      {/* Aurora background */}
      <div className="aurora-bg fixed inset-0 pointer-events-none" />
      <div className="noise-overlay fixed inset-0 pointer-events-none z-[1]" />

      {/* Floating ambient orbs */}
      <div className="fixed top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[180px] opacity-[0.04] animate-float pointer-events-none" style={{ background: `radial-gradient(circle, ${accentColor}, transparent 70%)` }} />
      <div className="fixed bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-[160px] opacity-[0.03] animate-float pointer-events-none" style={{ background: `radial-gradient(circle, #6366f1, transparent 70%)`, animationDelay: '-3s' }} />
      <div className="fixed top-2/3 left-1/2 w-[300px] h-[300px] rounded-full blur-[140px] opacity-[0.03] animate-float pointer-events-none" style={{ background: `radial-gradient(circle, #14b8a6, transparent 70%)`, animationDelay: '-7s' }} />

      {/* Main content */}
      <div className="relative z-[2] max-w-5xl mx-auto px-6 py-16">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-12">
          <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-500 mb-3">Operator Console</div>
          <h1 className="text-4xl font-bold gradient-text" style={{ fontFamily: 'var(--font-heading, "Cormorant Garamond", serif)' }}>
            Special Agent #8
          </h1>
          <p className="text-neutral-400 text-sm mt-2">Conversational intelligence for the LPL ecosystem</p>
        </motion.div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-3 mb-10">
          {(['context', 'review', 'done'] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300 ${
                step === s
                  ? 'text-neutral-950 shadow-lg'
                  : s === 'done' && step !== 'done'
                    ? 'bg-neutral-800 text-neutral-500'
                    : step === 'done' || (step === 'review' && s === 'context')
                      ? 'bg-neutral-700 text-neutral-300'
                      : 'bg-neutral-800 text-neutral-500'
              }`} style={step === s ? { backgroundColor: accentColor } : undefined}>
                {i + 1}
              </div>
              {i < 2 && <div className="w-12 h-px bg-neutral-800" />}
            </div>
          ))}
        </div>

        {/* Step content with transitions */}
        <AnimatePresence mode="wait">
          {step === 'context' && (
            <motion.div key="context" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
              {/* Name field */}
              <div className="mb-6">
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2">Person&apos;s Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Enter their name..."
                  className="w-full glass rounded-xl px-4 py-3 bg-transparent text-white placeholder-neutral-600 outline-none focus:ring-1 transition-all text-sm"
                  style={{ focusRingColor: accentColor } as React.CSSProperties}
                />
              </div>

              {/* Journey type selector */}
              <div className="mb-8">
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-3">Journey Type</label>
                <div className="flex flex-wrap gap-2">
                  {(Object.entries(journeyLabels) as [JourneyType, string][]).map(([key, label]) => {
                    const bId = journeyBrandMap[key];
                    const brandColor = brands[bId].colors.primary;
                    const isSelected = journeyType === key;
                    return (
                      <button
                        key={key}
                        onClick={() => setJourneyType(key)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          isSelected
                            ? 'text-white shadow-lg'
                            : 'glass text-neutral-400 hover:text-neutral-200'
                        }`}
                        style={isSelected ? { backgroundColor: brandColor + '30', borderColor: brandColor, border: `1px solid ${brandColor}` } : undefined}
                      >
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: brandColor }} />
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Structured context fields */}
              <div className="space-y-5 mb-8">
                <ContextField
                  label="Who is this person?"
                  placeholder="Background, role, how you know them..."
                  value={context.who}
                  onChange={v => setContext(c => ({ ...c, who: v }))}
                  images={contextImages.who}
                  onImagesChange={imgs => setContextImages(c => ({ ...c, who: imgs }))}
                  accentColor={accentColor}
                />
                <ContextField
                  label="What do they value?"
                  placeholder="What matters to them, motivations, priorities..."
                  value={context.values}
                  onChange={v => setContext(c => ({ ...c, values: v }))}
                  images={contextImages.values}
                  onImagesChange={imgs => setContextImages(c => ({ ...c, values: imgs }))}
                  accentColor={accentColor}
                />
                <ContextField
                  label="What's the intention?"
                  placeholder="Why are you creating this experience for them?"
                  value={context.intention}
                  onChange={v => setContext(c => ({ ...c, intention: v }))}
                  images={contextImages.intention}
                  onImagesChange={imgs => setContextImages(c => ({ ...c, intention: imgs }))}
                  accentColor={accentColor}
                />
                <ContextField
                  label="Additional context"
                  placeholder="Screenshots, notes, anything else helpful..."
                  value={context.additional}
                  onChange={v => setContext(c => ({ ...c, additional: v }))}
                  images={contextImages.additional}
                  onImagesChange={imgs => setContextImages(c => ({ ...c, additional: imgs }))}
                  accentColor={accentColor}
                />
              </div>

              {/* Analyze button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAnalyze}
                disabled={!name.trim() || !journeyType || loading}
                className="w-full py-3.5 rounded-xl font-medium text-sm text-neutral-950 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ backgroundColor: accentColor }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-neutral-950/30 border-t-neutral-950 rounded-full animate-spin" />
                    Analyzing...
                  </span>
                ) : (
                  'Analyze & Suggest Format'
                )}
              </motion.button>
            </motion.div>
          )}

          {step === 'review' && suggestion && (
            <motion.div key="review" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
              {/* Persona read */}
              <div className="glass rounded-2xl p-6 mb-6">
                <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500 mb-3">SA8&apos;s Read</div>
                <p className="text-neutral-300 italic text-lg leading-relaxed" style={{ fontFamily: 'var(--font-heading, "Cormorant Garamond", serif)' }}>
                  &ldquo;{suggestion.personaRead}&rdquo;
                </p>
              </div>

              {/* Format suggestion */}
              <div className="glass rounded-2xl p-6 mb-6">
                <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500 mb-2">Suggested Format</div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-white font-semibold text-lg">{DEPTH_INFO[suggestion.depth].label}</span>
                  <span className="text-neutral-500 text-sm">{DEPTH_INFO[suggestion.depth].time}</span>
                </div>
                <p className="text-neutral-400 text-sm">{suggestion.suggestedReason}</p>
              </div>

              {/* Depth selector cards */}
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500 mb-3">Select Depth</div>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {(Object.entries(DEPTH_INFO) as [Depth, typeof DEPTH_INFO[Depth]][]).map(([depth, info]) => {
                  const isSelected = selectedDepth === depth;
                  const isSuggested = suggestion.depth === depth;
                  return (
                    <motion.button
                      key={depth}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setSelectedDepth(depth)}
                      className={`relative glass rounded-xl p-4 text-left transition-all duration-200 ${
                        isSelected ? 'ring-1' : 'opacity-60 hover:opacity-80'
                      }`}
                      style={isSelected ? { borderColor: accentColor, border: `1px solid ${accentColor}40`, boxShadow: `0 0 12px ${accentColor}20` } : undefined}
                    >
                      {isSuggested && (
                        <span className="absolute -top-2 right-3 text-[9px] font-mono uppercase px-2 py-0.5 rounded-full" style={{ backgroundColor: accentColor + '30', color: accentColor }}>
                          Suggested
                        </span>
                      )}
                      <div className="font-medium text-white text-sm mb-1">{info.label}</div>
                      <div className="text-neutral-500 text-xs">{info.time}</div>
                      <div className="text-neutral-500 text-xs">{info.questions}</div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Context summary */}
              <div className="glass rounded-2xl p-6 mb-8">
                <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500 mb-3">Context Summary</div>
                <div className="space-y-2 text-sm">
                  <div className="flex gap-3">
                    <span className="text-neutral-500 shrink-0 w-20">Name</span>
                    <span className="text-neutral-200">{name}</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-neutral-500 shrink-0 w-20">Journey</span>
                    <span className="text-neutral-200">{journeyType ? journeyLabels[journeyType] : ''}</span>
                  </div>
                  {context.who && (
                    <div className="flex gap-3">
                      <span className="text-neutral-500 shrink-0 w-20">Who</span>
                      <span className="text-neutral-300 line-clamp-2">{context.who}</span>
                    </div>
                  )}
                  {context.intention && (
                    <div className="flex gap-3">
                      <span className="text-neutral-500 shrink-0 w-20">Intention</span>
                      <span className="text-neutral-300 line-clamp-2">{context.intention}</span>
                    </div>
                  )}
                  {allImages.length > 0 && (
                    <div className="flex gap-3">
                      <span className="text-neutral-500 shrink-0 w-20">Images</span>
                      <span className="text-neutral-300">{allImages.length} screenshot{allImages.length !== 1 ? 's' : ''}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setStep('context')}
                  className="flex-1 py-3 rounded-xl glass text-neutral-300 text-sm font-medium hover:text-white transition-colors"
                >
                  Back
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLaunch}
                  disabled={loading}
                  className="flex-[2] py-3.5 rounded-xl font-medium text-sm text-neutral-950 transition-all disabled:opacity-40"
                  style={{ backgroundColor: accentColor }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-neutral-950/30 border-t-neutral-950 rounded-full animate-spin" />
                      Launching...
                    </span>
                  ) : (
                    'Launch Experience'
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}

          {step === 'done' && result && (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
              <div className="text-center mb-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                  className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center animate-glow-pulse"
                  style={{ backgroundColor: accentColor + '20' }}
                >
                  <svg className="w-8 h-8" style={{ color: accentColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
                <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-heading, "Cormorant Garamond", serif)' }}>
                  Experience Created
                </h2>
                <p className="text-neutral-400 text-sm">Share the link below with {name}</p>
              </div>

              <div className="space-y-4 mb-10">
                {/* Person link */}
                <div className="glass rounded-xl p-5">
                  <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500 mb-2">Person&apos;s Experience Link</div>
                  <div className="flex items-center gap-3">
                    <code className="flex-1 text-sm text-neutral-200 bg-neutral-900/50 rounded-lg px-3 py-2 overflow-x-auto">
                      {typeof window !== 'undefined' ? window.location.origin : ''}{result.experienceUrl}
                    </code>
                    <button
                      onClick={() => copyToClipboard(`${typeof window !== 'undefined' ? window.location.origin : ''}${result.experienceUrl}`, 'person')}
                      className="shrink-0 px-4 py-2 rounded-lg text-xs font-medium transition-all"
                      style={copiedField === 'person' ? { backgroundColor: '#22c55e30', color: '#22c55e' } : { backgroundColor: accentColor + '20', color: accentColor }}
                    >
                      {copiedField === 'person' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>

                {/* Operator report link */}
                <div className="glass rounded-xl p-5">
                  <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500 mb-2">Operator Report Link</div>
                  <div className="flex items-center gap-3">
                    <code className="flex-1 text-sm text-neutral-200 bg-neutral-900/50 rounded-lg px-3 py-2 overflow-x-auto">
                      {typeof window !== 'undefined' ? window.location.origin : ''}{result.operatorUrl}
                    </code>
                    <button
                      onClick={() => copyToClipboard(`${typeof window !== 'undefined' ? window.location.origin : ''}${result.operatorUrl}`, 'operator')}
                      className="shrink-0 px-4 py-2 rounded-lg text-xs font-medium transition-all"
                      style={copiedField === 'operator' ? { backgroundColor: '#22c55e30', color: '#22c55e' } : { backgroundColor: accentColor + '20', color: accentColor }}
                    >
                      {copiedField === 'operator' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleReset}
                className="w-full py-3.5 rounded-xl glass text-neutral-300 font-medium text-sm hover:text-white transition-colors"
              >
                Create Another
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Component Showcase Tabs */}
        <div className="mt-16 pt-12 border-t border-neutral-800">
          <div className="text-center mb-10">
            <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-500 mb-3">Component Library</div>
            <h2 className="text-3xl font-bold gradient-text" style={{ fontFamily: 'var(--font-heading, "Cormorant Garamond", serif)' }}>
              Integrated Components
            </h2>
          </div>

          {/* Tab buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setShowApplicationForm(!showApplicationForm);
                setShowGallery(false);
                setShowCalendar(false);
              }}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                showApplicationForm
                  ? 'text-neutral-950 shadow-lg'
                  : 'glass text-neutral-300 hover:text-white'
              }`}
              style={showApplicationForm ? { backgroundColor: accentColor } : undefined}
            >
              Application Form
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setShowGallery(!showGallery);
                setShowApplicationForm(false);
                setShowCalendar(false);
              }}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                showGallery
                  ? 'text-neutral-950 shadow-lg'
                  : 'glass text-neutral-300 hover:text-white'
              }`}
              style={showGallery ? { backgroundColor: accentColor } : undefined}
            >
              Gallery (182 Images)
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setShowCalendar(!showCalendar);
                setShowApplicationForm(false);
                setShowGallery(false);
              }}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                showCalendar
                  ? 'text-neutral-950 shadow-lg'
                  : 'glass text-neutral-300 hover:text-white'
              }`}
              style={showCalendar ? { backgroundColor: accentColor } : undefined}
            >
              Calendar
            </motion.button>
          </div>

          {/* Component containers */}
          <AnimatePresence mode="wait">
            {showApplicationForm && (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="glass rounded-2xl p-8 mb-8"
              >
                <ApplicationForm accentColor={accentColor} />
              </motion.div>
            )}

            {showGallery && (
              <motion.div
                key="gallery"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="mb-8"
              >
                <Gallery accentColor={accentColor} />
              </motion.div>
            )}

            {showCalendar && (
              <motion.div
                key="calendar"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="mb-8"
              >
                <CalendarView accentColor={accentColor} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}


/* ------------------------------------------------------------------ */
/*  ContextField — reusable structured input with inline image support */
/* ------------------------------------------------------------------ */

interface ContextFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  images: string[];
  onImagesChange: (imgs: string[]) => void;
  accentColor: string;
}

function ContextField({ label, placeholder, value, onChange, images, onImagesChange, accentColor }: ContextFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const processFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files).filter(f => f.type.startsWith('image/'));
    fileArray.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onImagesChange([...images, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  }, [images, onImagesChange]);

  const handlePaste = useCallback((e: ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    const imageItems = Array.from(items).filter(item => item.type.startsWith('image/'));
    if (imageItems.length > 0) {
      e.preventDefault();
      const files = imageItems.map(item => item.getAsFile()).filter(Boolean) as File[];
      processFiles(files);
    }
  }, [processFiles]);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer?.files) {
      processFiles(e.dataTransfer.files);
    }
  }, [processFiles]);

  const removeImage = useCallback((index: number) => {
    onImagesChange(images.filter((_, i) => i !== index));
  }, [images, onImagesChange]);

  return (
    <div
      className={`glass rounded-xl p-4 transition-all duration-200 ${isDragOver ? 'ring-1' : ''}`}
      style={isDragOver ? { borderColor: accentColor, boxShadow: `0 0 8px ${accentColor}30` } : undefined}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex items-center justify-between mb-2">
        <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">{label}</label>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="text-neutral-600 hover:text-neutral-400 transition-colors p-1"
          title="Add image"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
          </svg>
        </button>
      </div>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        onPaste={handlePaste}
        placeholder={placeholder}
        rows={3}
        className="w-full bg-transparent text-neutral-200 placeholder-neutral-700 outline-none resize-none text-sm leading-relaxed"
      />

      {/* Image thumbnails */}
      {images.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-white/5">
          {images.map((img, i) => (
            <div key={i} className="relative group">
              <img src={img} alt="" className="w-16 h-16 rounded-lg object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
              <button
                onClick={() => removeImage(i)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500/80 text-white text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                x
              </button>
            </div>
          ))}
        </div>
      )}

      {isDragOver && (
        <div className="mt-2 text-center py-3 rounded-lg border border-dashed text-xs text-neutral-500" style={{ borderColor: accentColor + '40' }}>
          Drop image here
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={e => e.target.files && processFiles(e.target.files)}
      />
    </div>
  );
}
