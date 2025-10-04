import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WifiOff, RefreshCw } from 'lucide-react';

export default function Offline() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full glass-card">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <WifiOff className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Brak połączenia</CardTitle>
          <CardDescription>
            Nie można połączyć się z internetem
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            Sprawdź swoje połączenie internetowe i spróbuj ponownie.
            Niektóre funkcje mogą być dostępne w trybie offline.
          </p>
          <Button
            onClick={handleRefresh}
            className="w-full bg-gradient-primary hover:bg-gradient-primary/90"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Spróbuj ponownie
          </Button>
          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground text-center">
              W trybie offline możesz przeglądać wcześniej załadowane dane,
              ale nie możesz wprowadzać zmian.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
