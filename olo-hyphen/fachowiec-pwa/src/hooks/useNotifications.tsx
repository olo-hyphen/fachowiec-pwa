import { useEffect } from 'react';
import { toast } from 'sonner';
import { getJobs } from '../lib/storage';
import { getNotificationSettings, addSentNotification, wasNotified } from '../lib/storage';

interface Job {
  id: string;
  title: string;
  clientName?: string;
  address?: string;
  scheduled_date?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  // inne pola...
}

function isSameDay(d1: Date, d2: Date): boolean {
  return d1.getFullYear() === d2.getFullYear() && 
         d1.getMonth() === d2.getMonth() && 
         d1.getDate() === d2.getDate();
}

function checkIfShouldNotify(scheduledDate: Date, now: Date, settings: NotificationSettings): boolean {
  const diff = scheduledDate.getTime() - now.getTime();
  const hoursDiff = diff / (1000 * 60 * 60);

  switch(settings.timing) {
    case 'same-day':
      return isSameDay(scheduledDate, now) && now.getHours() === settings.timingHour;
    case 'day-before':
      return hoursDiff >= 24 && hoursDiff < 26 && now.getHours() === settings.timingHour;
    case '2-days-before':
      return hoursDiff >= 48 && hoursDiff < 50 && now.getHours() === settings.timingHour;
    case 'week-before':
      return hoursDiff >= 168 && hoursDiff < 170 && now.getHours() === settings.timingHour;
    default:
      return false;
  }
}

function shouldNotifyBasedOnPriority(job: Job, settings: NotificationSettings): boolean {
  switch(settings.priorityFilter) {
    case 'all': return true;
    case 'high-urgent': return job.priority === 'high' || job.priority === 'urgent';
    case 'urgent-only': return job.priority === 'urgent';
    default: return true;
  }
}

function getTimingText(settings: NotificationSettings): string {
  const hour = settings.timingHour.toString().padStart(2, '0');
  switch(settings.timing) {
    case 'same-day': return `Dziś o ${hour}:00`;
    case 'day-before': return `Jutro o ${hour}:00`;
    case '2-days-before': return `Za 2 dni o ${hour}:00`;
    case 'week-before': return `Za tydzień o ${hour}:00`;
    default: return '';
  }
}

function sendJobNotification(job: Job, settings: NotificationSettings) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(`Zlecenie: ${job.title}`, {
      body: `${getTimingText(settings)} | ${job.clientName || 'Klient'} | ${job.address || ''}`,
      icon: '/pwa-192x192.png',
      badge: '/pwa-192x192.png',
      tag: `job-${job.id}`,
      requireInteraction: false,
      data: {
        jobId: job.id,
        url: `/jobs?highlight=${job.id}`
      }
    });
  }
}

export function useNotifications() {
  const requestPermission = async (): Promise<boolean> => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  };

  const hasPermission = 'Notification' in window && Notification.permission === 'granted';

  const sendTestNotification = () => {
    if (hasPermission) {
      new Notification('FachowiecApp', {
        body: 'To jest testowe powiadomienie!',
        icon: '/pwa-192x192.png',
        badge: '/pwa-192x192.png',
        tag: 'test-notification'
      });
    }
  };

  const checkAndNotify = async () => {
    const settings = getNotificationSettings();
    if (!settings.enabled) return;

    const jobs = await getJobs() as Job[];
    const now = new Date();

    for (const job of jobs) {
      if (!job.scheduled_date) continue;
      if (job.status === 'completed' || job.status === 'cancelled') continue;
      if (!shouldNotifyBasedOnPriority(job, settings)) continue;

      const scheduledDate = new Date(job.scheduled_date);
      const shouldNotify = checkIfShouldNotify(scheduledDate, now, settings);

      if (shouldNotify && !wasNotified(job.id)) {
        const sent = {
          jobId: job.id,
          sentAt: now.toISOString(),
          timing: settings.timing
        };
        if (hasPermission) {
          sendJobNotification(job, settings);
        } else if (settings.inAppEnabled) {
          toast.info(`Przypomnienie: ${job.title}`, {
            description: `${getTimingText(settings)} | ${job.clientName || 'Klient'} | ${job.address || ''}`,
            action: {
              label: 'Otwórz',
              onClick: () => {
                window.location.href = `/jobs?highlight=${job.id}`;
              },
            },
            duration: 10000,
          });
        }
        addSentNotification(sent);
      }
    }
  };

  useEffect(() => {
    checkAndNotify();
  }, [hasPermission]);

  return {
    requestPermission,
    hasPermission,
    sendTestNotification,
    checkAndNotify
  };
}
