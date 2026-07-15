import { NextRequest, NextResponse } from 'next/server';

interface BlackoutDate {
  date: string; // ISO format YYYY-MM-DD
  reason?: string;
}

interface BookedSession {
  date: string; // ISO format YYYY-MM-DD
  title: string;
  startTime?: string;
  endTime?: string;
}

interface CalendarData {
  blackout_dates: BlackoutDate[];
  booked_sessions: BookedSession[];
  month: string; // ISO format YYYY-MM
}

// In-memory storage (replace with database in production)
let calendarStorage: CalendarData = {
  blackout_dates: [],
  booked_sessions: [],
  month: new Date().toISOString().slice(0, 7),
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const month = searchParams.get('month') || new Date().toISOString().slice(0, 7);

  // Filter data for the requested month
  const blackoutDates = calendarStorage.blackout_dates.filter(
    (d) => d.date.startsWith(month)
  );
  const bookedSessions = calendarStorage.booked_sessions.filter(
    (s) => s.date.startsWith(month)
  );

  return NextResponse.json({
    blackout_dates: blackoutDates,
    booked_sessions: bookedSessions,
    month,
  });
}

export async function POST(request: NextRequest) {
  const adminToken = request.headers.get('authorization')?.replace('Bearer ', '');
  const expectedToken = process.env.ADMIN_TOKEN || 'default-admin-token';

  if (adminToken !== expectedToken) {
    return NextResponse.json(
      { error: 'Unauthorized: Invalid or missing admin token' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { action, date, reason, month } = body;

    if (!action || !date) {
      return NextResponse.json(
        { error: 'Missing required fields: action, date' },
        { status: 400 }
      );
    }

    if (action === 'add-blackout') {
      // Add blackout date
      const newBlackout: BlackoutDate = {
        date,
        reason: reason || 'Unavailable',
      };
      calendarStorage.blackout_dates.push(newBlackout);

      return NextResponse.json(
        {
          success: true,
          message: 'Blackout date added',
          blackout_date: newBlackout,
        },
        { status: 201 }
      );
    } else if (action === 'remove-blackout') {
      // Remove blackout date
      calendarStorage.blackout_dates = calendarStorage.blackout_dates.filter(
        (d) => d.date !== date
      );

      return NextResponse.json(
        { success: true, message: 'Blackout date removed' },
        { status: 200 }
      );
    } else if (action === 'add-booking') {
      // Add booked session
      const { title, startTime, endTime } = body;
      if (!title) {
        return NextResponse.json(
          { error: 'Missing required field: title' },
          { status: 400 }
        );
      }

      const newBooking: BookedSession = {
        date,
        title,
        startTime,
        endTime,
      };
      calendarStorage.booked_sessions.push(newBooking);

      return NextResponse.json(
        {
          success: true,
          message: 'Booking added',
          booked_session: newBooking,
        },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { error: 'Invalid action. Use: add-blackout, remove-blackout, or add-booking' },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
