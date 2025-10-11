import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Command } from '@/components/ui/command';
import { CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandSeparator } from '@/components/ui/command';
import { useCommand } from '@/contexts/CommandContext';
import { cn } from '@/lib/utils';
import { Search, Home, Briefcase, Users, Clock, Camera, FileText, CalendarIcon, BarChart3, Settings, Plus } from 'lucide-react';

const pages = [
  { value: 'dashboard', label: 'Dashboard', icon: Home, href: '/' },
  { value: 'jobs', label: 'Zlecenia', icon: Briefcase, href: '/jobs' },
  { value: 'clients', label: 'Klienci', icon: Users, href: '/clients' },
  { value: 'time-tracking', label: 'Czas pracy', icon: Clock, href: '/time-tracking' },
  { value: 'photos', label: 'Zdjęcia', icon: Camera, href: '/photos' },
  { value: 'estimates', label: 'Kosztorysy', icon: FileText, href: '/estimates' },
  { value: 'calendar', label: 'Kalendarz', icon: CalendarIcon, href: '/calendar' },
  { value: 'reports', label: 'Raporty', icon: BarChart3, href: '/reports' },
  { value: 'settings', label: 'Ustawienia', icon: Settings, href: '/settings' },
];

const actions = [
  { value: 'new-job', label: 'Nowe zlecenie', icon: Plus, href: '/jobs' },
  { value: 'toggle-theme', label: 'Przełącz theme', icon: Settings, action: () => {} }, // Implement toggle
];

export function CommandPalette() {
  const { open, setOpen } = useCommand();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [jobs, setJobs] = useState([]); // Fetch from storage
  const [clients, setClients] = useState([]); // Fetch

  // Fetch jobs and clients on open
  useEffect(() => {
    if (open) {
      // Assuming getJobs, getClients from storage
      const allJobs = getJobs ? getJobs() : [];
      const allClients = getClients ? getClients() : [];
      setJobs(allJobs);
      setClients(allClients);
    }
  }, [open]);

  // Global shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        if (e.target instanceof HTMLElement && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [setOpen]);

  const filteredPages = pages.filter(page => 
    page.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 5);

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 5);

  const filteredActions = actions.filter(action => 
    action.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (value: string) => {
    setOpen(false);
    const page = pages.find(p => p.value === value);
    if (page) {
      navigate(page.href);
      return;
    }
    const action = actions.find(a => a.value === value);
    if (action && action.action) {
      action.action();
      return;
    }
    // For jobs/clients
    const job = jobs.find(j => j.id === value);
    if (job) {
      navigate(`/jobs/${job.id}`);
      return;
    }
    const client = clients.find(c => c.id === value);
    if (client) {
      navigate(`/clients/${client.id}`);
      return;
    }
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen} className="glass-elevated rounded-xl backdrop-blur-xl animate-slide-up-fade">
      <CommandInput placeholder="Szukaj stron, zleceń, klientów..." value={searchTerm} onValueChange={setSearchTerm} />
      <CommandList>
        <CommandEmpty>Brak wyników.</CommandEmpty>
        {filteredPages.length > 0 && (
          <CommandGroup heading="Strony">
            {filteredPages.map((page) => (
              <CommandItem key={page.value} value={page.value} onSelect={() => handleSelect(page.value)}>
                <page.icon className="mr-2 h-4 w-4" />
                <span>{page.label}</span>
                <CommandShortcut>⌘ {page.value.charAt(0).toUpperCase()}</CommandShortcut> {/* Approximate */}
              </CommandItem>
            ))}
          </CommandGroup>
        )}
        {filteredJobs.length > 0 && (
          <CommandGroup heading="Zlecenia">
            {filteredJobs.map((job) => (
              <CommandItem key={job.id} value={job.id} onSelect={() => handleSelect(job.id)}>
                <Briefcase className="mr-2 h-4 w-4" />
                <span>{job.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
        {filteredClients.length > 0 && (
          <CommandGroup heading="Klienci">
            {filteredClients.map((client) => (
              <CommandItem key={client.id} value={client.id} onSelect={() => handleSelect(client.id)}>
                <Users className="mr-2 h-4 w-4" />
                <span>{client.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
        {filteredActions.length > 0 && (
          <CommandGroup heading="Akcje">
            {filteredActions.map((action) => (
              <CommandItem key={action.value} value={action.value} onSelect={() => handleSelect(action.value)}>
                <action.icon className="mr-2 h-4 w-4" />
                <span>{action.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
        <CommandSeparator />
        <CommandGroup heading="Pomoc">
          <CommandItem onSelect={() => {/* show shortcuts */}}>
            <Search className="mr-2 h-4 w-4" />
            <span>Pokaż skróty klawiszowe</span>
            <CommandShortcut>?</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}