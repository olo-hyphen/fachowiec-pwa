import { supabase } from '@/lib/supabaseClient';

// Jobs
export async function getJobs() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }

  return data || [];
}

export async function saveJob(job: any) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Map frontend fields (camelCase) to backend schema (snake_case) and discard unknown columns
  const now = new Date().toISOString();
  const mappedData: any = {
    title: job.title,
    description: job.description ?? null,
    status: job.status ?? 'pending',
    priority: job.priority ?? 'medium',
    estimated_hours: job.estimatedHours ?? null,
    hourly_rate: job.hourlyRate ?? null,
    total_cost: job.totalCost ?? null,
    notes: job.notes ?? null,
    user_id: user.id,
    updated_at: now,
  };

  if (job.completedAt) mappedData.completed_at = job.completedAt;

  // Update only if id is a valid UUID; otherwise insert a new row
  const isUuid = (val: string) =>
    typeof val === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(val);

  if (isUuid(job.id)) {
    const { error } = await supabase
      .from('jobs')
      .update(mappedData)
      .eq('id', job.id)
      .eq('user_id', user.id);

    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('jobs')
      .insert([mappedData]);

    if (error) throw error;
  }
}

export async function deleteJob(jobId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('jobs')
    .delete()
    .eq('id', jobId)
    .eq('user_id', user.id);

  if (error) throw error;
}

// Time Entries
export async function getTimeEntries() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('time_entries')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching time entries:', error);
    return [];
  }

  return data || [];
}

export async function saveTimeEntry(timeEntry: any) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const entryData = {
    ...timeEntry,
    user_id: user.id
  };

  if (timeEntry.id) {
    const { error } = await supabase
      .from('time_entries')
      .update(entryData)
      .eq('id', timeEntry.id)
      .eq('user_id', user.id);

    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('time_entries')
      .insert([entryData]);

    if (error) throw error;
  }
}

export async function deleteTimeEntry(entryId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('time_entries')
    .delete()
    .eq('id', entryId)
    .eq('user_id', user.id);

  if (error) throw error;
}

// Photos
export async function getPhotos() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('photos')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching photos:', error);
    return [];
  }

  return data || [];
}

export async function savePhoto(photo: any) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const photoData = {
    ...photo,
    user_id: user.id
  };

  const { error } = await supabase
    .from('photos')
    .insert([photoData]);

  if (error) throw error;
}

export async function deletePhoto(photoId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('photos')
    .delete()
    .eq('id', photoId)
    .eq('user_id', user.id);

  if (error) throw error;
}

// Clients
export async function getClients() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching clients:', error);
    return [];
  }

  return data || [];
}

export async function saveClient(client: any) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const clientData = {
    ...client,
    user_id: user.id,
    updated_at: new Date().toISOString()
  };

  if (client.id) {
    const { error } = await supabase
      .from('clients')
      .update(clientData)
      .eq('id', client.id)
      .eq('user_id', user.id);

    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('clients')
      .insert([clientData]);

    if (error) throw error;
  }
}

export async function deleteClient(clientId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', clientId)
    .eq('user_id', user.id);

  if (error) throw error;
}

// Cost Estimates
export async function getEstimates() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('cost_estimates')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching estimates:', error);
    return [];
  }

  return data || [];
}

export async function saveEstimate(estimate: any) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const estimateData = {
    ...estimate,
    user_id: user.id,
    updated_at: new Date().toISOString()
  };

  if (estimate.id) {
    const { error } = await supabase
      .from('cost_estimates')
      .update(estimateData)
      .eq('id', estimate.id)
      .eq('user_id', user.id);

    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('cost_estimates')
      .insert([estimateData]);

    if (error) throw error;
  }
}

export async function deleteEstimate(estimateId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('cost_estimates')
    .delete()
    .eq('id', estimateId)
    .eq('user_id', user.id);

  if (error) throw error;
}

// Initialize with sample data - no longer needed with real auth
export function initializeSampleData(): void {
  // Sample data initialization removed - users will create their own data
}
