'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'motion/react';
import { MessageBubble } from './message-bubble';
import { TypingIndicator } from './typing-indicator';
import { parseNextSteps, stripTags } from '@/lib/calendar';
import type { NextStep } from '@/lib/calendar';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface ChatInterfaceProps {
  slug: string;
  personName: string;
  onComplete: (nextSteps: NextStep[]) => void;
  onError?: (error: string) => void;
}

export function ChatInterface({ slug, personName, onComplete, onError }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
      sendToAgent([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function sendToAgent(currentMessages: Message[]) {
    setIsStreaming(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, messages: currentMessages.map(m => ({ role: m.role, content: m.content })) }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(err.error || 'Chat request failed');
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader');

      const decoder = new TextDecoder();
      let assistantContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split('\n')) {
          if (!line.startsWith('data: ')) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.type === 'text') {
              assistantContent += data.text;
              setMessages([...currentMessages, { role: 'assistant', content: assistantContent, timestamp: Date.now() }]);
            }
            if (data.type === 'error') {
              throw new Error(data.error);
            }
            if (data.type === 'done' && data.isComplete) {
              const nextSteps = parseNextSteps(assistantContent);
              const reportRes = await fetch('/api/reports', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slug }),
              });
              if (!reportRes.ok) {
                onError?.('Report generation failed. Your conversation was saved — the report may be available shortly.');
              }
              const cleanContent = stripTags(assistantContent);
              setMessages([...currentMessages, { role: 'assistant', content: cleanContent, timestamp: Date.now() }]);
              onComplete(nextSteps);
            }
          } catch (e) {
            if (e instanceof Error && e.message !== 'Request failed') {
              console.error('Parse error:', e);
            }
          }
        }
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Something went wrong';
      onError?.(msg);
      setMessages(prev => [...prev, { role: 'assistant', content: `I hit a snag — ${msg.includes('budget') ? 'the daily budget has been reached' : "let's try that again"}. Could you rephrase?`, timestamp: Date.now() }]);
    } finally {
      setIsStreaming(false);
    }
  }

  function handleSend() {
    if (!input.trim() || isStreaming) return;
    const userMessage: Message = { role: 'user', content: input.trim(), timestamp: Date.now() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    inputRef.current?.focus();
    sendToAgent(updatedMessages);
  }

  return (
    <div className="flex flex-col h-full">
      {/* Ambient glow */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[200px] opacity-[0.04] animate-glow-pulse pointer-events-none" style={{ background: 'var(--color-primary)' }} />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1 relative">
        {messages.length === 0 && !isStreaming && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center animate-fade-in">
              <div className="text-sm font-medium gradient-text uppercase tracking-widest">Agent 8</div>
              <div className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>Preparing your session...</div>
            </div>
          </div>
        )}
        {messages.map((msg, i) => (
          <MessageBubble key={i} role={msg.role} content={msg.content} personName={personName} index={i} isLatest={i === messages.length - 1} isStreaming={isStreaming} />
        ))}
        <AnimatePresence>
          {isStreaming && messages[messages.length - 1]?.role !== 'assistant' && <TypingIndicator />}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="glass border-t px-4 py-3" style={{ borderColor: 'rgba(128,128,128,0.1)' }}>
        <div className="flex gap-3 max-w-2xl mx-auto">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your response..."
            disabled={isStreaming}
            className="flex-1 bg-[var(--color-surface)] border rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 disabled:opacity-40 transition-all"
            style={{ color: 'var(--color-text)', borderColor: 'rgba(128,128,128,0.15)' }}
          />
          <button
            onClick={handleSend}
            disabled={isStreaming || !input.trim()}
            className="rounded-full px-6 py-3 text-sm font-medium text-white transition-all disabled:opacity-30 hover:opacity-90"
            style={{ background: `linear-gradient(135deg, var(--color-primary), var(--color-secondary))` }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
