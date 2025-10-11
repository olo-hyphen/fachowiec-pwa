import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Bell, Clock, Filter, AlertCircle, CheckCircle, XCircle, Play } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { useNotifications } from '../hooks/useNotifications';
import { getNotificationSettings, saveNotificationSettings, NotificationSettings } from '../lib/storage';

const SettingsPage = () => {
  const navigate = useNavigate();
  const [localSettings, setLocalSettings] = useState<NotificationSettings>(getNotificationSettings());
  const { requestPermission, hasPermission, sendTestNotification } = useNotifications();

  useEffect(() => {
    if (localSettings.enabled && !hasPermission) {
      requestPermission();
    }
  }, [localSettings.enabled, hasPermission, requestPermission]);

  const handleTimingChange = (value: string) => {
    let hour = 8;
    if (value !== 'same-day') hour = 18;
    setLocalSettings({ ...localSettings, timing: value as any, timingHour: hour });
  };

  const handleSave = () => {
    saveNotificationSettings(localSettings);
    // Może toast success
  };

  const getPermissionStatus = () => {
    if (!('Notification' in window)) return { text: 'Niedostępne', icon: AlertCircle };
    const permission = Notification.permission;
    if (permission === 'granted') return { text: 'Przyznane', icon: CheckCircle, color: 'default' };
    if (permission === 'denied') return { text: 'Zablokowane', icon: XCircle, color: 'destructive' };
    return { text: 'Nie zapytano', icon: AlertCircle, color: 'secondary' };
  };

  const status = getPermissionStatus();

  return (
    <div className="min-h-screen mesh-bg pb-24">
      <div className="container mx-auto p-4 md:p-8 space-y-8 animate-fade-in">
        <div className="flex items-center justify-between animate-slide-up-fade">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-primary rounded-2xl text-primary-foreground shadow-glow">
              <Settings className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-hero bg-clip-text text-transparent font-poppins">Ustawienia</h1>
              <p className="text-muted-foreground mt-2 font-inter text-sm md:text-base">Konfiguracja aplikacji</p>
            </div>
          </div>
        </div>

        <Card className="glass-premium border-none shadow-medium">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Powiadomienia</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Włącz powiadomienia push</Label>
              <Switch
                checked={localSettings.enabled}
                onCheckedChange={(checked) => setLocalSettings({ ...localSettings, enabled: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium">Status uprawnień</Label>
                <Badge variant={status.color as any}>
                  <status.icon className="h-3 w-3 mr-1" />
                  {status.text}
                </Badge>
              </div>
            </div>

            {localSettings.enabled && (
              <>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Kiedy przypominać</Label>
                  <Select value={localSettings.timing} onValueChange={handleTimingChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="same-day">W dniu zlecenia o 8:00</SelectItem>
                      <SelectItem value="day-before">1 dzień przed o 18:00</SelectItem>
                      <SelectItem value="2-days-before">2 dni przed o 18:00</SelectItem>
                      <SelectItem value="week-before">1 tydzień przed o 18:00</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Powiadom o zleceniach</Label>
                  <RadioGroup
                    value={localSettings.priorityFilter}
                    onValueChange={(value) => setLocalSettings({ ...localSettings, priorityFilter: value as any })}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="all" />
                      <Label htmlFor="all">Wszystkie priorytety</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="high-urgent" id="high-urgent" />
                      <Label htmlFor="high-urgent">Tylko urgent + high</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="urgent-only" id="urgent-only" />
                      <Label htmlFor="urgent-only">Tylko urgent</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Powiadomienia in-app (fallback)</Label>
                  <Switch
                    checked={localSettings.inAppEnabled}
                    onCheckedChange={(checked) => setLocalSettings({ ...localSettings, inAppEnabled: checked })}
                  />
                </div>

                <Button onClick={sendTestNotification} className="w-full">
                  Test powiadomienia
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tour aplikacji</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Zobacz ponownie tour wprowadzający
          </p>
          <Button
            variant="outline"
            onClick={() => {
              localStorage.removeItem('fachowiec_tour_completed');
              window.location.reload();
            }}
          >
            <Play className="mr-2 h-4 w-4" />
            Uruchom tour ponownie
          </Button>
        </CardContent>
      </Card>

      <Button onClick={handleSave} className="w-full">
        Zapisz ustawienia
      </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
