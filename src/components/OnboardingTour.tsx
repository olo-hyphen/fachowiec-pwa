import Joyride, { Step, CallBackProps, STATUS, EVENTS } from 'react-joyride';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function OnboardingTour() {
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Sprawdź czy tour był już wyświetlony
    const tourCompleted = localStorage.getItem('fachowiec_tour_completed');
    if (!tourCompleted) {
      // Opóźnienie 1s dla załadowania UI
      setTimeout(() => setRun(true), 1000);
    }
  }, []);

  const steps: Step[] = [
    // === INTRO ===
    {
      target: 'body',
      content: (
        <div>
          <h2 className="text-2xl font-bold mb-3">Witaj w FachowiecApp! 👋</h2>
          <p className="mb-2">
            Twoja kompleksowa aplikacja do zarządzania zleceniami, czasem pracy i dokumentacją.
          </p>
          <p>
            Ten krótki tour pokaże Ci wszystkie funkcje. Możesz go pominąć klikając "Pomiń tour".
          </p>
        </div>
      ),
      placement: 'center',
      disableBeacon: true,
    },

    // === DASHBOARD ===
    {
      target: '[data-tour="dashboard-link"]',
      content: 'To Dashboard - Twój główny widok z podsumowaniem działalności.',
      placement: 'bottom',
    },
    {
      target: '[data-tour="kpi-cards"]',
      content: 'Te karty pokazują kluczowe wskaźniki: zakończone zlecenia, przychody, średni czas pracy i więcej.',
      placement: 'bottom',
    },
    {
      target: '[data-tour="recent-jobs"]',
      content: 'Tutaj widzisz listę ostatnich zleceń z możliwością szybkiego dostępu.',
      placement: 'top',
    },

    // === NAVIGATION ===
    {
      target: '[data-tour="jobs-link"]',
      content: 'Przejdźmy do Zleceń - serca aplikacji!',
      placement: 'bottom',
    },

    // === JOBS (po nawigacji musi być useEffect w Jobs.tsx) ===
    {
      target: '[data-tour="add-job-button"]',
      content: 'Kliknij tutaj, aby dodać nowe zlecenie. Formularz zawiera wszystkie potrzebne pola.',
      placement: 'left',
    },
    {
      target: '[data-tour="search-input"]',
      content: 'Szukaj zleceń po tytule, kliencie, adresie lub kategorii.',
      placement: 'bottom',
    },
    {
      target: '[data-tour="filters"]',
      content: 'Filtruj zlecenia według statusu, priorytetu i sortuj według różnych kryteriów.',
      placement: 'bottom',
    },
    {
      target: '[data-tour="job-card"]',
      content: 'Każda karta zawiera szczegóły zlecenia. Kliknij aby edytować lub szybko zmień status.',
      placement: 'top',
    },

    // === TIME TRACKING ===
    {
      target: '[data-tour="time-tracking-link"]',
      content: 'Przejdźmy do śledzenia czasu pracy.',
      placement: 'bottom',
    },
    {
      target: '[data-tour="timer"]',
      content: 'Timer pozwala śledzić czas w czasie rzeczywistym. Start/Pause/Stop - proste jak 1-2-3!',
      placement: 'bottom',
    },
    {
      target: '[data-tour="time-entries"]',
      content: 'Wszystkie sesje czasowe są zapisywane i widoczne tutaj. Zobacz podsumowanie per zlecenie.',
      placement: 'top',
    },

    // === PHOTOS ===
    {
      target: '[data-tour="photos-link"]',
      content: 'Dokumentacja fotograficzna - niezbędna dla każdego zlecenia.',
      placement: 'bottom',
    },
    {
      target: '[data-tour="photo-upload"]',
      content: 'Upload zdjęć przed/w trakcie/po oraz dokumentacja problemów i rozwiązań.',
      placement: 'bottom',
    },
    {
      target: '[data-tour="photo-filters"]',
      content: 'Filtruj zdjęcia według zlecenia, typu lub wyszukaj po opisie.',
      placement: 'bottom',
    },

    // === CLIENTS ===
    {
      target: '[data-tour="clients-link"]',
      content: 'Zarządzaj bazą swoich klientów.',
      placement: 'bottom',
    },
    {
      target: '[data-tour="client-rating"]',
      content: 'Oceniaj klientów gwiazdkami i dodawaj notatki. Przydatne dla przyszłych współprac!',
      placement: 'top',
    },

    // === ESTIMATES ===
    {
      target: '[data-tour="estimates-link"]',
      content: 'Twórz profesjonalne kosztorysy.',
      placement: 'bottom',
    },
    {
      target: '[data-tour="estimate-calculator"]',
      content: 'Automatyczne obliczanie VAT i sum. Dynamiczne dodawanie pozycji.',
      placement: 'bottom',
    },

    // === CALENDAR ===
    {
      target: '[data-tour="calendar-link"]',
      content: 'Kalendarz pokazuje plan wszystkich zleceń.',
      placement: 'bottom',
    },
    {
      target: '[data-tour="calendar-view"]',
      content: 'Zlecenia z ustawioną datą pojawiają się w kalendarzu. Kod kolorami według priorytetu.',
      placement: 'bottom',
    },

    // === FEATURES ===
    {
      target: '[data-tour="theme-toggle"]',
      content: 'Przełączaj między jasnym/ciemnym/systemowym motywem.',
      placement: 'bottom',
    },
    {
      target: '[data-tour="keyboard-shortcuts"]',
      content: 'Naciśnij "?" aby zobaczyć wszystkie skróty klawiszowe (Ctrl+D, Ctrl+J, etc.).',
      placement: 'bottom',
    },
    {
      target: '[data-tour="pwa-status"]',
      content: 'Status PWA - aplikacja działa offline i możesz ją zainstalować na urządzeniu!',
      placement: 'bottom',
    },

    // === OUTRO ===
    {
      target: 'body',
      content: (
        <div>
          <h2 className="text-2xl font-bold mb-3">Gotowe! 🎉</h2>
          <p className="mb-2">
            Poznałeś wszystkie funkcje FachowiecApp.
          </p>
          <p className="mb-3">
            <strong>Wskazówki:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Dane są zapisywane lokalnie - działasz offline</li>
            <li>Zainstaluj jako PWA dla lepszego doświadczenia</li>
            <li>Używaj skrótów klawiszowych dla szybszej pracy</li>
            <li>Możesz zawsze wrócić do tego tour w Ustawieniach</li>
          </ul>
        </div>
      ),
      placement: 'center',
    },
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, type, index } = data;

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      localStorage.setItem('fachowiec_tour_completed', 'true');
      setRun(false);
    }

    if (type === EVENTS.STEP_BEFORE) {
      // Nawiguj przed pokazaniem kroku
      if (index === 4 && location.pathname !== '/jobs') { // jobs-link step
        navigate('/jobs');
      } else if (index === 9 && location.pathname !== '/time-tracking') { // time-tracking-link
        navigate('/time-tracking');
      } else if (index === 12 && location.pathname !== '/photos') { // photos-link
        navigate('/photos');
      } else if (index === 15 && location.pathname !== '/clients') { // clients-link
        navigate('/clients');
      } else if (index === 17 && location.pathname !== '/estimates') { // estimates-link
        navigate('/estimates');
      } else if (index === 19 && location.pathname !== '/calendar') { // calendar-link
        navigate('/calendar');
      }
    }

    if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
      setStepIndex(index + (type === EVENTS.TARGET_NOT_FOUND ? 1 : 0));
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      stepIndex={stepIndex}
      continuous
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: 'hsl(262 83% 58%)', // --primary z Tailwind
          zIndex: 10000,
        },
        tooltip: {
          borderRadius: 12,
          padding: 20,
        },
        buttonNext: {
          background: 'linear-gradient(135deg, hsl(262 83% 58%), hsl(262 83% 48%))',
          borderRadius: 8,
        },
      }}
      locale={{
        back: 'Wstecz',
        close: 'Zamknij',
        last: 'Zakończ',
        next: 'Dalej',
        skip: 'Pomiń tour',
      }}
    />
  );
}