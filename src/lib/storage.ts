export interface User {
  id: string;
  email: string;
  full_name?: string;
  created_at: string;
}

interface NotificationSettings {
  enabled: boolean;
  timing: 'same-day' | 'day-before' | '2-days-before' | 'week-before';
  timingHour: number;
  priorityFilter: 'all' | 'high-urgent' | 'urgent-only';
  inAppEnabled: boolean;
}

interface SentNotification {
  jobId: string;
  sentAt: string;
  timing: string;
}

const DEMO_USER_KEY = 'fachowiec_user';

function getOrCreateDemoUser(): User {
  let userStr = localStorage.getItem(DEMO_USER_KEY);
  if (!userStr) {
    const user: User = {
      id: 'demo-user',
      email: 'demo@fachowiec.pl',
      full_name: 'Demo Użytkownik',
      created_at: new Date().toISOString()
    };
    localStorage.setItem(DEMO_USER_KEY, JSON.stringify(user));
    return user;
  }
  return JSON.parse(userStr) as User;
}

const STORAGE_KEYS = {
  JOBS: 'fachowiec_jobs',
  TIME_ENTRIES: 'fachowiec_time_entries',
  PHOTOS: 'fachowiec_photos',
  CLIENTS: 'fachowiec_clients',
  ESTIMATES: 'fachowiec_estimates',
};

const NOTIFICATION_SETTINGS_KEY = 'fachowiec_notification_settings_demo-user';
const SENT_NOTIFICATIONS_KEY = 'fachowiec_notifications_sent_demo-user';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function getUserData<T>(key: string): T[] {
  const user = getOrCreateDemoUser();

  const data = localStorage.getItem(`${key}_${user.id}`);
  return data ? JSON.parse(data) : [];
}

function saveUserData<T>(key: string, data: T[]): void {
  const user = getOrCreateDemoUser();

  localStorage.setItem(`${key}_${user.id}`, JSON.stringify(data));
}

export async function getJobs() {
  return getUserData(STORAGE_KEYS.JOBS);
}

export async function saveJob(job: any) {
  const jobs = await getJobs();
  const now = new Date().toISOString();

  if (job.id && job.id.includes('-')) {
    const index = jobs.findIndex((j: any) => j.id === job.id);
    if (index !== -1) {
      jobs[index] = { ...job, user_id: 'demo-user', updated_at: now };
    } else {
      jobs.push({ ...job, user_id: 'demo-user', created_at: now, updated_at: now });
    }
  } else {
    const newJob = {
      ...job,
      id: generateId(),
      user_id: 'demo-user',
      created_at: now,
      updated_at: now,
    };
    jobs.push(newJob);
  }

  saveUserData(STORAGE_KEYS.JOBS, jobs);
}

export async function deleteJob(jobId: string) {
  const jobs = await getJobs();
  const filteredJobs = jobs.filter((j: any) => j.id !== jobId);

  saveUserData(STORAGE_KEYS.JOBS, filteredJobs);
}

export async function getTimeEntries() {
  return getUserData(STORAGE_KEYS.TIME_ENTRIES);
}

export async function saveTimeEntry(timeEntry: any) {
  const entries = await getTimeEntries();
  const now = new Date().toISOString();

  if (timeEntry.id) {
    const index = entries.findIndex((e: any) => e.id === timeEntry.id);
    if (index !== -1) {
      entries[index] = { ...timeEntry, user_id: 'demo-user' };
    } else {
      entries.push({ ...timeEntry, user_id: 'demo-user', created_at: now });
    }
  } else {
    const newEntry = {
      ...timeEntry,
      id: generateId(),
      user_id: 'demo-user',
      created_at: now,
    };
    entries.push(newEntry);
  }

  saveUserData(STORAGE_KEYS.TIME_ENTRIES, entries);
}

export async function deleteTimeEntry(entryId: string) {
  const entries = await getTimeEntries();
  const filteredEntries = entries.filter((e: any) => e.id !== entryId);

  saveUserData(STORAGE_KEYS.TIME_ENTRIES, filteredEntries);
}

export async function getPhotos() {
  return getUserData(STORAGE_KEYS.PHOTOS);
}

export async function savePhoto(photo: any) {
  const photos = await getPhotos();
  const now = new Date().toISOString();

  const newPhoto = {
    ...photo,
    id: generateId(),
    user_id: 'demo-user',
    created_at: now,
  };

  photos.push(newPhoto);
  saveUserData(STORAGE_KEYS.PHOTOS, photos);
}

export async function deletePhoto(photoId: string) {
  const photos = await getPhotos();
  const filteredPhotos = photos.filter((p: any) => p.id !== photoId);

  saveUserData(STORAGE_KEYS.PHOTOS, filteredPhotos);
}

export async function getClients() {
  return getUserData(STORAGE_KEYS.CLIENTS);
}

export async function saveClient(client: any) {
  const clients = await getClients();
  const now = new Date().toISOString();

  if (client.id) {
    const index = clients.findIndex((c: any) => c.id === client.id);
    if (index !== -1) {
      clients[index] = { ...client, user_id: 'demo-user', updated_at: now };
    } else {
      clients.push({ ...client, user_id: 'demo-user', created_at: now, updated_at: now });
    }
  } else {
    const newClient = {
      ...client,
      id: generateId(),
      user_id: 'demo-user',
      created_at: now,
      updated_at: now,
    };
    clients.push(newClient);
  }

  saveUserData(STORAGE_KEYS.CLIENTS, clients);
}

export async function deleteClient(clientId: string) {
  const clients = await getClients();
  const filteredClients = clients.filter((c: any) => c.id !== clientId);

  saveUserData(STORAGE_KEYS.CLIENTS, filteredClients);
}

export async function getEstimates() {
  return getUserData(STORAGE_KEYS.ESTIMATES);
}

export async function saveEstimate(estimate: any) {
  const estimates = await getEstimates();
  const now = new Date().toISOString();

  if (estimate.id) {
    const index = estimates.findIndex((e: any) => e.id === estimate.id);
    if (index !== -1) {
      estimates[index] = { ...estimate, user_id: 'demo-user', updated_at: now };
    } else {
      estimates.push({ ...estimate, user_id: 'demo-user', created_at: now, updated_at: now });
    }
  } else {
    const newEstimate = {
      ...estimate,
      id: generateId(),
      user_id: 'demo-user',
      created_at: now,
      updated_at: now,
    };
    estimates.push(newEstimate);
  }

  saveUserData(STORAGE_KEYS.ESTIMATES, estimates);
}

export async function deleteEstimate(estimateId: string) {
  const estimates = await getEstimates();
  const filteredEstimates = estimates.filter((e: any) => e.id !== estimateId);

  saveUserData(STORAGE_KEYS.ESTIMATES, filteredEstimates);
}

export function getNotificationSettings(): NotificationSettings {
  const data = localStorage.getItem(NOTIFICATION_SETTINGS_KEY);
  if (!data) {
    const defaultSettings: NotificationSettings = {
      enabled: false,
      timing: 'same-day',
      timingHour: 8,
      priorityFilter: 'all',
      inAppEnabled: true,
    };
    saveNotificationSettings(defaultSettings);
    return defaultSettings;
  }
  return JSON.parse(data) as NotificationSettings;
}

export function saveNotificationSettings(settings: NotificationSettings): void {
  localStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(settings));
}

export function getSentNotifications(): SentNotification[] {
  const data = localStorage.getItem(SENT_NOTIFICATIONS_KEY);
  return data ? JSON.parse(data) : [];
}

export function addSentNotification(sent: SentNotification): void {
  const sents = getSentNotifications();
  sents.push(sent);
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const filtered = sents.filter(s => new Date(s.sentAt) > thirtyDaysAgo);
  localStorage.setItem(SENT_NOTIFICATIONS_KEY, JSON.stringify(filtered));
}

export function wasNotified(jobId: string): boolean {
  const sents = getSentNotifications();
  return sents.some(s => s.jobId === jobId);
}

export function initializeSampleData(): void {
}
