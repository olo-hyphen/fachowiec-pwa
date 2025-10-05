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
      jobs[index] = { ...job, updatedAt: now };
    } else {
      jobs.push({ ...job, createdAt: now, updatedAt: now });
    }
  } else {
    const newJob = {
      ...job,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
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
      clients[index] = { ...client, updatedAt: now };
    } else {
      clients.push({ ...client, createdAt: now, updatedAt: now });
    }
  } else {
    const newClient = {
      ...client,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
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
      estimates[index] = { ...estimate, updatedAt: now };
    } else {
      estimates.push({ ...estimate, createdAt: now, updatedAt: now });
    }
  } else {
    const newEstimate = {
      ...estimate,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
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
  // Check if data already exists
  const existingJobs = getData(STORAGE_KEYS.JOBS);
  if (existingJobs.length > 0) return;

  // Sample clients
  const sampleClients = [
    {
      id: '1',
      name: 'Jan Kowalski',
      email: 'jan.kowalski@email.com',
      phone: '+48 123 456 789',
      address: 'ul. Słoneczna 12, Warszawa',
      rating: 5,
      notes: 'Stały klient, zawsze płaci na czas',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2', 
      name: 'Anna Nowak',
      email: 'anna.nowak@email.com',
      phone: '+48 987 654 321',
      address: 'ul. Kwiatowa 5, Kraków',
      rating: 4,
      notes: 'Wymagająca klientka, ale fair',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '3',
      name: 'Firma ABC Sp. z o.o.',
      email: 'kontakt@firmabc.pl',
      phone: '+48 555 123 456',
      address: 'ul. Przemysłowa 10, Gdańsk',
      rating: 5,
      notes: 'Duże zlecenia, długoterminowa współpraca',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  // Sample jobs
  const now = new Date();
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  
  const sampleJobs = [
    {
      id: '1',
      title: 'Remont łazienki',
      description: 'Kompleksowy remont łazienki - wymiana płytek, armatur, instalacji',
      status: 'in-progress',
      priority: 'high',
      clientName: 'Jan Kowalski',
      clientPhone: '+48 123 456 789',
      clientEmail: 'jan.kowalski@email.com',
      address: 'ul. Słoneczna 12, Warszawa',
      estimatedHours: 40,
      hourlyRate: 80,
      totalCost: 3200,
      actual_cost: 2800,
      category: 'Hydraulika',
      tags: ['remont', 'łazienka', 'płytki'],
      notes: 'Klient chce wysokiej jakości materiały',
      scheduled_date: nextWeek.toISOString().split('T')[0],
      createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Instalacja elektryczna',
      description: 'Wymiana instalacji elektrycznej w mieszkaniu 60m2',
      status: 'pending',
      priority: 'medium',
      clientName: 'Anna Nowak',
      clientPhone: '+48 987 654 321',
      clientEmail: 'anna.nowak@email.com',
      address: 'ul. Kwiatowa 5, Kraków',
      estimatedHours: 25,
      hourlyRate: 90,
      totalCost: 2250,
      category: 'Elektryka',
      tags: ['elektryka', 'instalacja', 'mieszkanie'],
      notes: 'Trzeba koordynować z malarzem',
      scheduled_date: nextMonth.toISOString().split('T')[0],
      createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '3',
      title: 'Malowanie biura',
      description: 'Malowanie ścian i sufitów w biurze 100m2',
      status: 'completed',
      priority: 'low',
      clientName: 'Firma ABC Sp. z o.o.',
      clientPhone: '+48 555 123 456',
      clientEmail: 'kontakt@firmabc.pl',
      address: 'ul. Przemysłowa 10, Gdańsk',
      estimatedHours: 20,
      hourlyRate: 60,
      totalCost: 1200,
      actual_cost: 1200,
      category: 'Malowanie',
      tags: ['malowanie', 'biuro', 'farba'],
      notes: 'Praca wykonana zgodnie z harmonogramem',
      completedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  // Sample time entries
  const sampleTimeEntries = [
    {
      id: '1',
      jobId: '1',
      startTime: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(now.getTime() - 60 * 60 * 1000).toISOString(),
      duration: 60,
      description: 'Przygotowanie ścian do układania płytek',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      jobId: '1',
      startTime: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      duration: 120,
      description: 'Układanie płytek podłogowych',
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      jobId: '3',
      startTime: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000).toISOString(),
      duration: 480,
      description: 'Malowanie pierwszej warstwy',
      createdAt: new Date().toISOString()
    }
  ];

  // Sample estimates
  const sampleEstimates = [
    {
      id: '1',
      client_id: '2',
      title: 'Kosztorys - Remont kuchni',
      description: 'Kompleksowy remont kuchni z wymianą mebli',
      items: [
        { description: 'Demontaż starych mebli', quantity: 1, unit_price: 500, total: 500 },
        { description: 'Malowanie ścian', quantity: 15, unit_price: 30, total: 450 },
        { description: 'Montaż nowych mebli', quantity: 1, unit_price: 1200, total: 1200 }
      ],
      subtotal: 2150,
      tax_rate: 23,
      tax_amount: 494.50,
      total_amount: 2644.50,
      status: 'sent',
      valid_until: nextMonth.toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  // Save sample data
  saveData(STORAGE_KEYS.CLIENTS, sampleClients);
  saveData(STORAGE_KEYS.JOBS, sampleJobs);
  saveData(STORAGE_KEYS.TIME_ENTRIES, sampleTimeEntries);
  saveData(STORAGE_KEYS.ESTIMATES, sampleEstimates);
  
  console.log('Sample data initialized successfully');
}
