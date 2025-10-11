import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getClient, getClients } from '@/lib/storage'; // Assuming storage functions
import { Client } from '@/types'; // Assuming Client type

export default function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const clientData = getClient(id); // or getClients().find(c => c.id === id)
      setClient(clientData);
      setLoading(false);
    }
  }, [id]);

  if (loading) return <div className="p-8">Ładowanie...</div>;
  if (!client) return <div className="p-8">Klient nie znaleziony</div>;

  return (
    <div className="min-h-screen mesh-bg pb-safe">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-hero bg-clip-text text-transparent font-poppins mb-2">
          {client.name}
        </div>
        <p className="text-sm md:text-base text-muted-foreground font-inter mb-8">
          Szczegóły klienta {client.id}
        </p>
        <div className="glass-premium rounded-2xl p-6 shadow-medium space-y-4">
          <p><strong>Email:</strong> {client.email || 'Brak'}</p>
          <p><strong>Telefon:</strong> {client.phone || 'Brak'}</p>
          <p><strong>Adres:</strong> {client.address || 'Brak'}</p>
          {/* Add more details */}
          <button 
            onClick={() => navigate('/clients')} 
            className="mt-4 btn-primary"
          >
            Powrót do listy
          </button>
        </div>
      </div>
    </div>
  );
}