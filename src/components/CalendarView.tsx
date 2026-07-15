'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface BlackoutDate {
  date: string;
  reason?: string;
}

interface BookedSession {
  date: string;
  title: string;
  startTime?: string;
  endTime?: string;
}

interface CalendarData {
  blackout_dates: BlackoutDate[];
  booked_sessions: BookedSession[];
  month: string;
}

export function CalendarView({ month }: { month?: string }) {
  const [calendarData, setCalendarData] = useState<CalendarData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(month || new Date().toISOString().slice(0, 7));

  useEffect(() => {
    fetchCalendarData();
  }, [currentMonth]);

  const fetchCalendarData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/calendar?month=${currentMonth}`);
      if (!response.ok) {
        throw new Error('Failed to fetch calendar data');
      }
      const data = await response.json();
      setCalendarData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (month: string): number => {
    const [year, monthNum] = month.split('-').map(Number);
    return new Date(year, monthNum, 0).getDate();
  };

  const getFirstDayOfMonth = (month: string): number => {
    const [year, monthNum] = month.split('-').map(Number);
    return new Date(year, monthNum - 1, 1).getDay();
  };

  const getStatusForDate = (date: string): 'available' | 'booked' | 'blackout' => {
    if (!calendarData) return 'available';

    const isBlackout = calendarData.blackout_dates.some((bd) => bd.date === date);
    if (isBlackout) return 'blackout';

    const isBooked = calendarData.booked_sessions.some((bs) => bs.date === date);
    if (isBooked) return 'booked';

    return 'available';
  };

  const getBookedSessionsForDate = (date: string): BookedSession[] => {
    if (!calendarData) return [];
    return calendarData.booked_sessions.filter((bs) => bs.date === date);
  };

  const getBlackoutReasonForDate = (date: string): string | undefined => {
    if (!calendarData) return undefined;
    const blackout = calendarData.blackout_dates.find((bd) => bd.date === date);
    return blackout?.reason;
  };

  const handlePreviousMonth = () => {
    const [year, month] = currentMonth.split('-').map(Number);
    const date = new Date(year, month - 2, 1);
    setCurrentMonth(date.toISOString().slice(0, 7));
  };

  const handleNextMonth = () => {
    const [year, month] = currentMonth.split('-').map(Number);
    const date = new Date(year, month, 1);
    setCurrentMonth(date.toISOString().slice(0, 7));
  };

  const getStatusColor = (status: 'available' | 'booked' | 'blackout'): string => {
    switch (status) {
      case 'available':
        return '#10b981'; // Green
      case 'booked':
        return '#eab308'; // Yellow
      case 'blackout':
        return '#9ca3af'; // Grey
      default:
        return '#ffffff';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Loading calendar...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!calendarData) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">No calendar data available</div>
      </div>
    );
  }

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days: (number | null)[] = Array(firstDay).fill(null);

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const monthName = new Date(`${currentMonth}-01`).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto p-6 rounded-2xl glass"
    >
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handlePreviousMonth}
            className="px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            style={{ color: 'var(--color-primary)' }}
          >
            ← Previous
          </button>
          <h2 className="text-2xl font-semibold" style={{ color: 'var(--color-primary)' }}>
            {monthName}
          </h2>
          <button
            onClick={handleNextMonth}
            className="px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            style={{ color: 'var(--color-primary)' }}
          >
            Next →
          </button>
        </div>

        <div className="flex gap-2 justify-center mb-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#10b981' }} />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#eab308' }} />
            <span>Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#9ca3af' }} />
            <span>Blackout</span>
          </div>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="text-center font-semibold text-sm py-2"
            style={{ color: 'var(--color-primary)' }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const dateStr = `${currentMonth}-${String(day).padStart(2, '0')}`;
          const status = getStatusForDate(dateStr);
          const statusColor = getStatusColor(status);
          const bookedSessions = getBookedSessionsForDate(dateStr);
          const blackoutReason = getBlackoutReasonForDate(dateStr);

          return (
            <motion.div
              key={day}
              whileHover={{ scale: 1.05 }}
              className="aspect-square rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all hover:shadow-lg group relative"
              style={{
                backgroundColor: statusColor,
                opacity: status === 'available' ? 0.9 : 0.8,
              }}
            >
              <span className="text-sm font-semibold text-white z-10">{day}</span>

              {/* Tooltip on hover */}
              {(bookedSessions.length > 0 || blackoutReason) && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-900 text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap z-20">
                  {blackoutReason && <div>{blackoutReason}</div>}
                  {bookedSessions.map((session, idx) => (
                    <div key={idx}>{session.title}</div>
                  ))}
                </div>
              )}

              {/* Indicator dot for booked sessions */}
              {bookedSessions.length > 0 && (
                <div className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-white opacity-75" />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Session details section */}
      {calendarData.booked_sessions.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold mb-4" style={{ color: 'var(--color-primary)' }}>
            Booked Sessions ({calendarData.booked_sessions.length})
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {calendarData.booked_sessions.map((session, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-sm"
              >
                <div className="font-medium">{session.title}</div>
                <div className="text-gray-600 dark:text-gray-400 text-xs">
                  {session.date}
                  {session.startTime && ` • ${session.startTime}`}
                  {session.endTime && ` - ${session.endTime}`}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Blackout dates section */}
      {calendarData.blackout_dates.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold mb-4" style={{ color: 'var(--color-primary)' }}>
            Blackout Dates ({calendarData.blackout_dates.length})
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {calendarData.blackout_dates.map((blackout, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-sm"
              >
                <div className="font-medium">{blackout.date}</div>
                {blackout.reason && (
                  <div className="text-gray-600 dark:text-gray-400 text-xs">{blackout.reason}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
