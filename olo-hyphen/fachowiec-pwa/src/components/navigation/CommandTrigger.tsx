import React from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCommand } from '@/contexts/CommandContext';

export function CommandTrigger() {
  const { setOpen } = useCommand();

  return (
    <Button
      variant="ghost"
      size="sm"
      className="hidden md:flex h-9 px-3"
      onClick={() => setOpen(true)}
      aria-label="Otwórz wyszukiwanie"
    >
      <Search className="h-4 w-4" />
      <span className="sr-only md:not-sr-only ml-2 text-sm">Szukaj</span>
      <kbd className="ml-auto h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium text-muted-foreground pointer-events-none">
        ⌘K
      </kbd>
    </Button>
  );
}