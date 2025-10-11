import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getJob, getJobs } from '@/lib/storage'; // Assuming storage functions
import { Job } from '@/types';

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const jobData = getJob(id); // or getJobs().find(j => j.id === id)
      setJob(jobData);
      setLoading(false);
    }
  }, [id]);

  if (loading) return <div className="p-8">Ładowanie...</div>;
  if (!job) return <div className="p-8">Zlecenie nie znalezione</div>;

  return (
    <div className="min-h-screen mesh-bg pb-safe">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-hero bg-clip-text text-transparent font-poppins mb-2">
          {job.title}
        </h1>
        <p className="text-sm md:text-base text-muted-foreground font-inter mb-8">
          Szczegóły zlecenia {job.id}
        </p>
        <div className="glass-premium rounded-2xl p-6 shadow-medium space-y-4">
          <p><strong>Klient:</strong> {job.clientName || 'Brak'}</p>
          <p><strong>Status:</strong> {job.status}</p>
          <p><strong>Opis:</strong> {job.description || 'Brak opisu'}</p>
          {/* Add more details */}
          <button 
            onClick={() => navigate('/jobs')} 
            className="mt-4 btn-primary"
          >
            Powrót do listy
          </button>
        </div>
      </div>
    </div>
  );
}