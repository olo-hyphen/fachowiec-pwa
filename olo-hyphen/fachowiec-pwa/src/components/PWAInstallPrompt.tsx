import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Smartphone, X } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';
import { useEffect, useState } from 'react';

export function PWAInstallPrompt() {
  const { isInstallable, promptInstall, closePrompt, isInstalled } = usePWA();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const wasDismissed = localStorage.getItem('pwa-install-dismissed');
    if (wasDismissed) {
      setDismissed(true);
    }
  }, []);

  const handleInstall = async () => {
    const installed = await promptInstall();
    if (installed) {
      localStorage.setItem('pwa-install-dismissed', 'true');
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('pwa-install-dismissed', 'true');
    closePrompt();
  };

  if (!isInstallable || dismissed || isInstalled) {
    return null;
  }

  return (
    <div className="fixed bottom-20 md:bottom-4 left-4 right-4 md:left-auto md:right-4 z-50 animate-slide-up">
      <Card className="glass-card border-primary/20 shadow-lg max-w-md">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Smartphone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Zainstaluj aplikację</CardTitle>
                <CardDescription className="text-sm">
                  Uzyskaj szybszy dostęp i pracuj offline
                </CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 -mt-1 -mr-1"
              onClick={handleDismiss}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Błyskawiczny dostęp z ekranu głównego
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Pracuj offline bez połączenia
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Powiadomienia o ważnych wydarzeniach
              </li>
            </ul>
            <div className="flex gap-2">
              <Button
                onClick={handleInstall}
                className="flex-1 bg-gradient-primary hover:bg-gradient-primary/90"
              >
                <Download className="h-4 w-4 mr-2" />
                Zainstaluj teraz
              </Button>
              <Button variant="outline" onClick={handleDismiss}>
                Później
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
