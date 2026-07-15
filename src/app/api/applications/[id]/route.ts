import { NextRequest, NextResponse } from 'next/server';
import { getApplication, updateApplication } from '@/lib/application-store';
import { sendDecisionEmail } from '@/lib/email';
import type { Application } from '@/lib/application-schema';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const adminToken = request.headers.get('x-admin-token');

    // Verify admin token
    if (!adminToken) {
      return NextResponse.json(
        { error: 'Missing admin token' },
        { status: 401 }
      );
    }

    // TODO: Validate admin token against environment variable or database
    const expectedToken = process.env.ADMIN_TOKEN || 'default-admin-token';
    if (adminToken !== expectedToken) {
      return NextResponse.json(
        { error: 'Invalid admin token' },
        { status: 403 }
      );
    }

    // Fetch the application
    const application = await getApplication(id);
    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      application,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Failed to fetch application: ${errorMessage}`);
    return NextResponse.json(
      { error: 'Failed to fetch application', details: errorMessage },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const adminToken = request.headers.get('x-admin-token');

    // Verify admin token
    if (!adminToken) {
      return NextResponse.json(
        { error: 'Missing admin token' },
        { status: 401 }
      );
    }

    // TODO: Validate admin token against environment variable or database
    const expectedToken = process.env.ADMIN_TOKEN || 'default-admin-token';
    if (adminToken !== expectedToken) {
      return NextResponse.json(
        { error: 'Invalid admin token' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { status, notes } = body;

    // Validate status
    const validStatuses: Application['status'][] = ['pending', 'approved', 'rejected'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        {
          error: 'Invalid status',
          details: `Status must be one of: ${validStatuses.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Fetch existing application
    const existingApplication = await getApplication(id);
    if (!existingApplication) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    // Update the application
    const updates: Partial<Omit<Application, 'id' | 'submittedAt'>> = {
      status: status || existingApplication.status,
      reviewedAt: new Date().toISOString(),
    };

    if (notes) {
      updates.reviewerNotes = notes;
    }

    const updatedApplication = await updateApplication(id, updates);
    if (!updatedApplication) {
      return NextResponse.json(
        { error: 'Failed to update application' },
        { status: 500 }
      );
    }

    // Send decision email if status changed and is now approved or rejected
    if (status && (status === 'approved' || status === 'rejected')) {
      const emailResult = await sendDecisionEmail(
        updatedApplication,
        status === 'approved',
        notes
      );

      if (!emailResult.success) {
        console.warn(`Email decision notification failed for application ${id}: ${emailResult.error}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Application ${status ? 'updated to ' + status : 'updated'} successfully`,
      application: updatedApplication,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Failed to update application: ${errorMessage}`);
    return NextResponse.json(
      { error: 'Failed to update application', details: errorMessage },
      { status: 500 }
    );
  }
}
