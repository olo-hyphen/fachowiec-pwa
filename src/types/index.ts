export type JobStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled';

export type JobPriority = 'low' | 'medium' | 'high' | 'urgent';

export type PhotoType = 'before' | 'progress' | 'after' | 'issue' | 'solution';

export interface Job {
  id: string;
  title: string;
  description: string;
  status: JobStatus;
  priority?: JobPriority;
  clientName: string;
  clientPhone?: string;
  clientEmail?: string;
  address: string;
  estimatedHours: number;
  hourlyRate: number;
  totalCost: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  category?: string;
  tags?: string[];
  notes?: string;
}

export interface TimeEntry {
  id: string;
  jobId: string;
  startTime: string;
  endTime?: string;
  duration: number; // in minutes
  description?: string;
  createdAt: string;
}

export interface Photo {
  id: string;
  jobId: string;
  type: PhotoType;
  url: string;
  description?: string;
  createdAt: string;
}

export interface KPI {
  completedJobs: number;
  totalRevenue: number;
  averageJobDuration: number;
  averageRating: number;
  activeJobs: number;
  profitMargin: number;
}