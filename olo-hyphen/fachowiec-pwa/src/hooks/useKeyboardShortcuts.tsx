import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

export function useKeyboardShortcuts() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore shortcuts when typing in inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifier = isMac ? e.metaKey : e.ctrlKey;

      // Ctrl/Cmd + D - Dashboard
      if (modifier && e.key === 'd') {
        e.preventDefault();
        navigate('/');
        toast({ title: "Przejście do Dashboard" });
      }

      // Ctrl/Cmd + J - Jobs
      if (modifier && e.key === 'j') {
        e.preventDefault();
        navigate('/jobs');
        toast({ title: "Przejście do Zleceń" });
      }

      // Ctrl/Cmd + T - Time Tracking
      if (modifier && e.key === 't') {
        e.preventDefault();
        navigate('/time-tracking');
        toast({ title: "Przejście do Czasu Pracy" });
      }

      // Ctrl/Cmd + P - Photos
      if (modifier && e.key === 'p') {
        e.preventDefault();
        navigate('/photos');
        toast({ title: "Przejście do Zdjęć" });
      }

      // Ctrl/Cmd + C - Clients
      if (modifier && e.key === 'c') {
        e.preventDefault();
        navigate('/clients');
        toast({ title: "Przejście do Klientów" });
      }

      // Ctrl/Cmd + E - Estimates
      if (modifier && e.key === 'e') {
        e.preventDefault();
        navigate('/estimates');
        toast({ title: "Przejście do Kosztorysów" });
      }

      // ? - Show shortcuts help
      if (e.key === '?' && !modifier) {
        e.preventDefault();
        toast({
          title: "Skróty klawiszowe",
          description: (
            <div className="mt-2 space-y-1 text-sm">
              <div><kbd className="px-2 py-1 bg-muted rounded">Ctrl/⌘ D</kbd> - Dashboard</div>
              <div><kbd className="px-2 py-1 bg-muted rounded">Ctrl/⌘ J</kbd> - Zlecenia</div>
              <div><kbd className="px-2 py-1 bg-muted rounded">Ctrl/⌘ T</kbd> - Czas Pracy</div>
              <div><kbd className="px-2 py-1 bg-muted rounded">Ctrl/⌘ P</kbd> - Zdjęcia</div>
              <div><kbd className="px-2 py-1 bg-muted rounded">Ctrl/⌘ C</kbd> - Klienci</div>
              <div><kbd className="px-2 py-1 bg-muted rounded">Ctrl/⌘ E</kbd> - Kosztorysy</div>
              <div><kbd className="px-2 py-1 bg-muted rounded">?</kbd> - Pomoc</div>
            </div>
          ),
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);
}
