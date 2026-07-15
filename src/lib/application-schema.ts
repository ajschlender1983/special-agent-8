export interface ApplicationData {
  name: string;
  email: string;
  phone: string;
  organization: string;
  position: string;
  message: string;
  submittedAt: string;
}

export interface Application extends ApplicationData {
  id: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedAt?: string;
  reviewerNotes?: string;
}

// Validation helper
export function validateApplicationData(data: unknown): { valid: boolean; errors: string[]; data?: ApplicationData } {
  const errors: string[] = [];

  if (typeof data !== 'object' || data === null) {
    return { valid: false, errors: ['Invalid request body'] };
  }

  const obj = data as Record<string, unknown>;

  // Validate name
  if (typeof obj.name !== 'string' || obj.name.trim().length === 0) {
    errors.push('Name is required and must be a non-empty string');
  } else if (obj.name.length > 100) {
    errors.push('Name must not exceed 100 characters');
  }

  // Validate email
  if (typeof obj.email !== 'string' || obj.email.trim().length === 0) {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(obj.email)) {
    errors.push('Email must be a valid email address');
  }

  // Validate phone
  if (typeof obj.phone !== 'string' || obj.phone.trim().length === 0) {
    errors.push('Phone is required');
  } else if (obj.phone.length < 10 || obj.phone.length > 20) {
    errors.push('Phone must be between 10 and 20 characters');
  }

  // Validate organization
  if (typeof obj.organization !== 'string' || obj.organization.trim().length === 0) {
    errors.push('Organization is required');
  } else if (obj.organization.length > 150) {
    errors.push('Organization must not exceed 150 characters');
  }

  // Validate position
  if (typeof obj.position !== 'string' || obj.position.trim().length === 0) {
    errors.push('Position is required');
  } else if (obj.position.length > 100) {
    errors.push('Position must not exceed 100 characters');
  }

  // Validate message
  if (typeof obj.message !== 'string' || obj.message.trim().length === 0) {
    errors.push('Message is required');
  } else if (obj.message.length > 2000) {
    errors.push('Message must not exceed 2000 characters');
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  const validatedData: ApplicationData = {
    name: obj.name.trim(),
    email: obj.email.trim().toLowerCase(),
    phone: obj.phone.trim(),
    organization: obj.organization.trim(),
    position: obj.position.trim(),
    message: obj.message.trim(),
    submittedAt: new Date().toISOString(),
  };

  return { valid: true, errors: [], data: validatedData };
}
