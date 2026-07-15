'use client';

import { motion } from 'motion/react';

interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  personName?: string;
  index?: number;
  isLatest?: boolean;
  isStreaming?: boolean;
}

function renderContent(text: string) {
  const cleaned = text
    .replace(/\[NEXT_STEPS\][\s\S]*?\[\/NEXT_STEPS\]/g, '')
    .replace(/\[COMPLETE\]/gi, '')
    .trim();
  if (!cleaned) return null;

  return cleaned.split('\n\n').map((paragraph, i) => (
    <p key={i} className={i > 0 ? 'mt-2.5' : ''}>
      {paragraph.split(/(\*\*.*?\*\*)/).map((segment, j) =>
        segment.startsWith('**') && segment.endsWith('**')
          ? <strong key={j} className="font-semibold">{segment.slice(2, -2)}</strong>
          : segment
      )}
    </p>
  ));
}

export function MessageBubble({ role, content, personName, index = 0, isLatest, isStreaming }: MessageBubbleProps) {
  const isAgent = role === 'assistant';
  const rendered = renderContent(content);
  if (!rendered) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: Math.min(index * 0.05, 0.2) }}
      className={`flex ${isAgent ? 'justify-start' : 'justify-end'} mb-4`}
    >
      <div className={`max-w-[85%] rounded-2xl px-5 py-3.5 ${
        isAgent
          ? 'glass border-l-2 text-[var(--color-text)]'
          : 'text-white'
      }`}
        style={isAgent
          ? { borderLeftColor: 'var(--color-primary)' }
          : { background: `linear-gradient(135deg, var(--color-primary), var(--color-secondary))` }
        }
      >
        <div className="text-[10px] font-medium uppercase tracking-widest mb-1.5" style={{ color: isAgent ? 'var(--color-primary)' : 'rgba(255,255,255,0.7)' }}>
          {isAgent ? 'Agent 8' : personName ?? 'You'}
        </div>
        <div className="text-sm leading-[1.7]">{rendered}</div>
        {isAgent && isLatest && isStreaming && (
          <span className="inline-block w-0.5 h-4 ml-0.5 animate-glow-pulse" style={{ backgroundColor: 'var(--color-primary)' }} />
        )}
      </div>
    </motion.div>
  );
}
