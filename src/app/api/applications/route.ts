import { NextRequest, NextResponse } from 'next/server';

interface Application {
  id: string;
  name: string;
  email: string;
  session_type: string;
  preferred_date: string;
  status: 'pending' | 'approved' | 'rejected';
}

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'demo-token-123';

let applications: Application[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    session_type: 'coaching',
    preferred_date: '2024-08-15',
    status: 'pending',
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    session_type: 'consultation',
    preferred_date: '2024-08-20',
    status: 'pending',
  },
  {
    id: '3',
    name: 'Carol Williams',
    email: 'carol@example.com',
    session_type: 'workshop',
    preferred_date: '2024-08-25',
    status: 'approved',
  },
  {
    id: '4',
    name: 'David Brown',
    email: 'david@example.com',
    session_type: 'coaching',
    preferred_date: '2024-09-01',
    status: 'rejected',
  },
];

function verifyToken(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return false;

  const token = authHeader.replace('Bearer ', '');
  return token === ADMIN_TOKEN;
}

export async function GET(request: NextRequest) {
  if (!verifyToken(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const pendingApplications = applications.filter(app => app.status === 'pending');

  return NextResponse.json({
    applications: [...pendingApplications, ...applications.filter(app => app.status !== 'pending')],
    total: applications.length,
    pending: pendingApplications.length,
  });
}

export async function PATCH(request: NextRequest) {
  if (!verifyToken(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { id, status } = await request.json();

    if (!id || !status || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const appIndex = applications.findIndex(app => app.id === id);
    if (appIndex === -1) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    applications[appIndex].status = status as 'approved' | 'rejected';

    return NextResponse.json({
      success: true,
      application: applications[appIndex],
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}
