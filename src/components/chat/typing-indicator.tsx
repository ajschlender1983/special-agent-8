'use client';

import { motion } from 'motion/react';

export function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      className="flex justify-start mb-4"
    >
      <div className="glass border-l-2 rounded-2xl px-5 py-3.5" style={{ borderLeftColor: 'var(--color-primary)' }}>
        <div className="text-[10px] font-medium uppercase tracking-widest mb-1.5" style={{ color: 'var(--color-primary)' }}>Agent 8</div>
        <div className="flex gap-1.5 items-center">
          <span className="w-2 h-2 rounded-full typing-dot" style={{ backgroundColor: 'var(--color-primary)' }} />
          <span className="w-2 h-2 rounded-full typing-dot" style={{ backgroundColor: 'var(--color-primary)' }} />
          <span className="w-2 h-2 rounded-full typing-dot" style={{ backgroundColor: 'var(--color-primary)' }} />
        </div>
      </div>
    </motion.div>
  );
}
