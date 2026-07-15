import { z } from 'zod';

// Validation schema (must match the frontend)
const applicationSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Invalid phone number'),
  company: z.string().min(2, 'Company name is required'),
  position: z.string().min(2, 'Position is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  experience: z.enum(['beginner', 'intermediate', 'advanced']),
});

type ApplicationData = z.infer<typeof applicationSchema>;

// In-memory storage for demo purposes (replace with database in production)
const applications: ApplicationData[] = [];

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate data
    const validatedData = applicationSchema.parse(body);

    // Store application
    applications.push(validatedData);

    // Log to console (for development)
    console.log('New application received:', {
      name: validatedData.fullName,
      email: validatedData.email,
      company: validatedData.company,
      timestamp: new Date().toISOString(),
    });

    // Return success response
    return Response.json(
      {
        success: true,
        message: 'Application submitted successfully',
        data: {
          fullName: validatedData.fullName,
          email: validatedData.email,
          timestamp: new Date().toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return Response.json(
        {
          success: false,
          message: 'Validation failed',
          errors: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }

    // Handle other errors
    console.error('Application submission error:', error);
    return Response.json(
      {
        success: false,
        message: 'An error occurred while processing your application',
      },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve all applications (demo only)
export async function GET() {
  return Response.json(
    {
      success: true,
      count: applications.length,
      applications,
    },
    { status: 200 }
  );
}
