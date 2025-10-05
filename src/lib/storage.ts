const STORAGE_KEYS = {
  JOBS: 'fachowiec_jobs',
  TIME_ENTRIES: 'fachowiec_time_entries',
  PHOTOS: 'fachowiec_photos',
  CLIENTS: 'fachowiec_clients',
  ESTIMATES: 'fachowiec_estimates',
};

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function getData<T>(key: string): T[] {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

function saveData<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

export async function getJobs() {
  return getData(STORAGE_KEYS.JOBS);
}

export async function saveJob(job: any) {
  const jobs = await getJobs();
  const now = new Date().toISOString();

  if (job.id && job.id.includes('-')) {
    const index = jobs.findIndex((j: any) => j.id === job.id);
    if (index !== -1) {
      jobs[index] = { ...job, updated_at: now };
    } else {
      jobs.push({ ...job, created_at: now, updated_at: now });
    }
  } else {
    const newJob = {
      ...job,
      id: generateId(),
      created_at: now,
      updated_at: now,
    };
    jobs.push(newJob);
  }

  saveData(STORAGE_KEYS.JOBS, jobs);
}

export async function deleteJob(jobId: string) {
  const jobs = await getJobs();
  const filteredJobs = jobs.filter((j: any) => j.id !== jobId);
  saveData(STORAGE_KEYS.JOBS, filteredJobs);
}

export async function getTimeEntries() {
  return getData(STORAGE_KEYS.TIME_ENTRIES);
}

export async function saveTimeEntry(timeEntry: any) {
  const entries = await getTimeEntries();
  const now = new Date().toISOString();

  if (timeEntry.id) {
    const index = entries.findIndex((e: any) => e.id === timeEntry.id);
    if (index !== -1) {
      entries[index] = { ...timeEntry };
    } else {
      entries.push({ ...timeEntry, created_at: now });
    }
  } else {
    const newEntry = {
      ...timeEntry,
      id: generateId(),
      created_at: now,
    };
    entries.push(newEntry);
  }

  saveData(STORAGE_KEYS.TIME_ENTRIES, entries);
}

export async function deleteTimeEntry(entryId: string) {
  const entries = await getTimeEntries();
  const filteredEntries = entries.filter((e: any) => e.id !== entryId);
  saveData(STORAGE_KEYS.TIME_ENTRIES, filteredEntries);
}

export async function getPhotos() {
  return getData(STORAGE_KEYS.PHOTOS);
}

export async function savePhoto(photo: any) {
  const photos = await getPhotos();
  const now = new Date().toISOString();

  const newPhoto = {
    ...photo,
    id: generateId(),
    created_at: now,
  };

  photos.push(newPhoto);
  saveData(STORAGE_KEYS.PHOTOS, photos);
}

export async function deletePhoto(photoId: string) {
  const photos = await getPhotos();
  const filteredPhotos = photos.filter((p: any) => p.id !== photoId);
  saveData(STORAGE_KEYS.PHOTOS, filteredPhotos);
}

export async function getClients() {
  return getData(STORAGE_KEYS.CLIENTS);
}

export async function saveClient(client: any) {
  const clients = await getClients();
  const now = new Date().toISOString();

  if (client.id) {
    const index = clients.findIndex((c: any) => c.id === client.id);
    if (index !== -1) {
      clients[index] = { ...client, updated_at: now };
    } else {
      clients.push({ ...client, created_at: now, updated_at: now });
    }
  } else {
    const newClient = {
      ...client,
      id: generateId(),
      created_at: now,
      updated_at: now,
    };
    clients.push(newClient);
  }

  saveData(STORAGE_KEYS.CLIENTS, clients);
}

export async function deleteClient(clientId: string) {
  const clients = await getClients();
  const filteredClients = clients.filter((c: any) => c.id !== clientId);
  saveData(STORAGE_KEYS.CLIENTS, filteredClients);
}

export async function getEstimates() {
  return getData(STORAGE_KEYS.ESTIMATES);
}

export async function saveEstimate(estimate: any) {
  const estimates = await getEstimates();
  const now = new Date().toISOString();

  if (estimate.id) {
    const index = estimates.findIndex((e: any) => e.id === estimate.id);
    if (index !== -1) {
      estimates[index] = { ...estimate, updated_at: now };
    } else {
      estimates.push({ ...estimate, created_at: now, updated_at: now });
    }
  } else {
    const newEstimate = {
      ...estimate,
      id: generateId(),
      created_at: now,
      updated_at: now,
    };
    estimates.push(newEstimate);
  }

  saveData(STORAGE_KEYS.ESTIMATES, estimates);
}

export async function deleteEstimate(estimateId: string) {
  const estimates = await getEstimates();
  const filteredEstimates = estimates.filter((e: any) => e.id !== estimateId);
  saveData(STORAGE_KEYS.ESTIMATES, filteredEstimates);
}

export function initializeSampleData(): void {
}
