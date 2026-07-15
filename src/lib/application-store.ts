import { nanoid } from 'nanoid';
import type { Application, ApplicationData } from './application-schema';

const store = new Map<string, Application>();

export async function createApplication(data: ApplicationData): Promise<Application> {
  const application: Application = {
    ...data,
    id: `app_${nanoid(12)}`,
    status: 'pending',
  };
  store.set(application.id, application);
  return application;
}

export async function getApplication(id: string): Promise<Application | null> {
  return store.get(id) ?? null;
}

export async function updateApplication(
  id: string,
  updates: Partial<Omit<Application, 'id' | 'submittedAt'>>
): Promise<Application | null> {
  const existing = store.get(id);
  if (!existing) return null;

  const updated: Application = {
    ...existing,
    ...updates,
  };

  store.set(id, updated);
  return updated;
}

export async function listApplications(): Promise<Application[]> {
  return Array.from(store.values()).sort(
    (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  );
}

export async function listApplicationsByStatus(status: Application['status']): Promise<Application[]> {
  return Array.from(store.values())
    .filter((app) => app.status === status)
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
}
