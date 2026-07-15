'use client';

import { useState, useMemo } from 'react';
import { motion } from 'motion/react';

interface CalendarEvent {
  date: string;
  title: string;
  description?: string;
  color?: string;
}

interface CalendarViewProps {
  events?: CalendarEvent[];
  accentColor?: string;
}

export default function CalendarView({ events = [], accentColor = '#f59e0b' }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const monthEvents = useMemo(() => {
    const eventMap: Record<string, CalendarEvent[]> = {};
    events.forEach(event => {
      const key = new Date(event.date).toLocaleDateString('en-CA');
      if (!eventMap[key]) eventMap[key] = [];
      eventMap[key].push(event);
    });
    return eventMap;
  }, [events]);

  const calendarDays = useMemo(() => {
    const days = [];
    const totalDays = daysInMonth(currentDate);
    const firstDay = firstDayOfMonth(currentDate);

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Days of the month
    for (let i = 1; i <= totalDays; i++) {
      days.push(i);
    }

    return days;
  }, [currentDate]);

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const getDateString = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return date.toLocaleDateString('en-CA');
  };

  const selectedDateString = selectedDate?.toLocaleDateString('en-CA') || null;
  const selectedDateEvents = selectedDateString ? monthEvents[selectedDateString] : [];

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full"
    >
      {/* Header */}
      <div className="mb-6">
        <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-500 mb-2">
          Schedule
        </div>
        <h2 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-heading, "Cormorant Garamond", serif)' }}>
          Calendar View
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <div className="glass rounded-2xl p-6">
            {/* Month/Year header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">{monthName}</h3>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={goToPreviousMonth}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                  style={{ backgroundColor: accentColor + '20', color: accentColor }}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={goToNextMonth}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                  style={{ backgroundColor: accentColor + '20', color: accentColor }}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>
              </div>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-2 mb-3">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-[10px] font-mono uppercase tracking-wider text-neutral-500 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((day, idx) => {
                const dateString = day ? getDateString(day) : null;
                const dayEvents = dateString ? monthEvents[dateString] : [];
                const isSelected = selectedDate && dateString === selectedDate.toLocaleDateString('en-CA');
                const isToday = day && dateString === new Date().toLocaleDateString('en-CA');

                return (
                  <motion.button
                    key={idx}
                    whileHover={day ? { scale: 1.05 } : undefined}
                    whileTap={day ? { scale: 0.95 } : undefined}
                    onClick={() => day && setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                    className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all relative ${
                      !day
                        ? 'invisible'
                        : isSelected
                          ? 'text-neutral-950 shadow-lg'
                          : isToday
                            ? 'ring-1 text-white'
                            : dayEvents.length > 0
                              ? 'text-white'
                              : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                    style={
                      isSelected ? { backgroundColor: accentColor } : isToday ? { borderColor: accentColor, borderWidth: '1px' } : dayEvents.length > 0 ? { backgroundColor: accentColor + '20' } : undefined
                    }
                  >
                    {day}
                    {dayEvents.length > 0 && (
                      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                        {dayEvents.slice(0, 3).map((_, i) => (
                          <div key={i} className="w-1 h-1 rounded-full" style={{ backgroundColor: accentColor }} />
                        ))}
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Events panel */}
        <div className="glass rounded-2xl p-6 h-fit">
          <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-4">
            {selectedDate ? 'Selected Events' : 'Select a Date'}
          </div>

          {selectedDate && (
            <>
              <div className="mb-4">
                <p className="text-white font-medium text-sm">
                  {selectedDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>

              {selectedDateEvents.length > 0 ? (
                <div className="space-y-3">
                  {selectedDateEvents.map((event, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="p-3 rounded-lg border-l-2 bg-white/5"
                      style={{ borderColor: event.color || accentColor }}
                    >
                      <p className="text-white font-medium text-sm mb-1">{event.title}</p>
                      {event.description && (
                        <p className="text-neutral-400 text-xs">{event.description}</p>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-neutral-500 text-xs">No events scheduled</p>
              )}
            </>
          )}

          {!selectedDate && (
            <div className="text-center py-8">
              <svg className="w-12 h-12 mx-auto mb-2 opacity-30 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-neutral-500 text-xs">Click a date to view events</p>
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
}
