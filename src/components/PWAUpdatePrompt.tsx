import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, X } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';

export function PWAUpdatePrompt() {
  const { needRefresh, updateServiceWorker, closeUpdatePrompt } = usePWA();

  if (!needRefresh) {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 right-4 md:left-auto md:right-4 z-50 animate-slide-down">
      <Card className="glass-card border-primary/20 shadow-lg max-w-md">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <RefreshCw className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Dostępna aktualizacja</CardTitle>
                <CardDescription className="text-sm">
                  Nowa wersja aplikacji jest gotowa
                </CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 -mt-1 -mr-1"
              onClick={closeUpdatePrompt}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button
              onClick={updateServiceWorker}
              className="flex-1 bg-gradient-primary hover:bg-gradient-primary/90"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Zaktualizuj teraz
            </Button>
            <Button variant="outline" onClick={closeUpdatePrompt}>
              Później
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
