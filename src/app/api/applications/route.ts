import { NextRequest, NextResponse } from 'next/server';
import { validateApplicationData } from '@/lib/application-schema';
import { createApplication } from '@/lib/application-store';
import { sendConfirmationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the application data
    const validation = validateApplicationData(body);
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      );
    }

    const validatedData = validation.data!;

    // Create the application in the store
    const application = await createApplication(validatedData);

    // Send confirmation email (TODO: implement actual sending)
    const emailResult = await sendConfirmationEmail(
      application.email,
      application.name,
      application.id
    );

    // Log warning if email sending fails, but don't fail the request
    if (!emailResult.success) {
      console.warn(`Email confirmation failed for application ${application.id}: ${emailResult.error}`);
    }

    return NextResponse.json(
      {
        success: true,
        application_id: application.id,
        message: 'Application submitted successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Failed to create application: ${errorMessage}`);
    return NextResponse.json(
      { error: 'Failed to submit application', details: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
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

    // TODO: Implement proper pagination
    // For now, return all applications
    return NextResponse.json({
      success: true,
      message: 'Admin endpoint for listing applications',
      note: 'Implement listing logic as needed',
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Failed to list applications: ${errorMessage}`);
    return NextResponse.json(
      { error: 'Failed to list applications', details: errorMessage },
      { status: 500 }
    );
  }
}
