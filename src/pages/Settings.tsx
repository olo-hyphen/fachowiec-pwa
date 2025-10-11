import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Bell, Clock, Filter, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
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
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <Settings className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Ustawienia</h1>
        </div>
      </div>

      <Card>
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

      <Button onClick={handleSave} className="w-full">
        Zapisz ustawienia
      </Button>
    </div>
  );
};

export default SettingsPage;
