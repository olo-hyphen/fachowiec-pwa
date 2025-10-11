# Ulepszenia systemu nawigacji w aplikacji Fachowiec PWA

## Zmiany wprowadzone
- **Breadcrumbs**: Dodano dynamiczne breadcrumbs pod Navbar w App.tsx. Automatycznie generowane z useLocation.pathname (np. Dashboard > Zlecenia > "Remont kuchni" dla nested routes jak /jobs/:id). Styl: glass-subtle, text-sm, separator >, ukryte na mobile (hidden md:block). Dodano aria-label="Ścieżka nawigacyjna" i role="navigation". Integracja z Jobs.tsx i Clients.tsx – nowe strony szczegółów (/jobs/:id, /clients/:id) z fetchowaniem tytułu/nazwy dla breadcrumbs.

- **Command Palette (global search)**: Zaimplementowano Cmd+K / Ctrl+K trigger (rozszerzono useKeyboardShortcuts). Użyto istniejącej biblioteki cmdk. Zakres: strony (Dashboard, Jobs itp.), wyszukiwanie Jobs/Clients po nazwie, akcje (Nowe zlecenie, Przełącz theme). UI: overlay z input, fuzzy search, kategorie ("Strony", "Zlecenia", "Akcje"), nawigacja klawiaturą (strzałki, Enter). Styl: glass-elevated, backdrop-blur, rounded-xl, animate-slide-up-fade. Accessibility: aria-modal, focus trap, Escape do close, role="dialog". Ikona trigger w Navbar (lupa, desktop; Cmd+K toast na mobile).

- **Poprawki Mobile Bottom Nav (MobileNavigation.tsx)**: Rozszerzono do 6 items (Dashboard, Zlecenia, Klienci, Czas pracy, Zdjęcia, Więcej). "Więcej": Sheet z Accordion (grupuj: "Planowanie" - Calendar/Estimates, "Raporty" - Reports, "Ustawienia"). Użyto Accordion.tsx z haptic Vibration.medium() na toggle. Dodano brakujące shortcuts (Calendar: Cmd+L, Reports: Cmd+R, Settings: Cmd+,). Active states: aria-current="page", scale-105 + gradient-primary. FAB: rozszerzono o "Nowe zdjęcie" i "Nowy klient" sub-actions z tooltipami i staggered animacjami.

- **Ogólne poprawki**:
  - **Accessibility**: Dodano <nav role="navigation" aria-label="Główna nawigacja"> w Navbar/MobileNav; aria-current="page" na active links; skip link "Przejdź do treści" (sr-only, focusable) w App.tsx. Escape zamyka Sheet/FAB; Tab nav przez items.
  - **Keyboard**: Pełna lista shortcuts w KeyboardShortcutsInfo (dodano Calendar, Reports, Settings). Toasty z potwierdzeniem.
  - **PWA**: Offline indicator w Navbar (Badge z WifiOff jeśli !isOnline z PWAStatus.tsx); dodano skalowany PWAStatus w MobileNav.
  - **Styl**: Zachowano glassmorphism (premium dla nav, subtle dla breadcrumbs), animacje (slide-up-fade, staggered delays), min-h-[44px] touch targets.
  - **Reports**: Utworzono Reports.tsx z basic chart z dummy data (użyto chart.tsx component z recharts).

## Dlaczego te zmiany?
- Poprawa UX: Szybszy dostęp do treści (search, shortcuts), lepsza hierarchia (breadcrumbs), mobile-first z gestami i haptic feedback.
- Spójność: Bazowano na istniejących komponentach (Navbar, MobileNav, App, glass-premium, responsive md:768px, safe-area).
- Accessibility: Pełna zgodność z WCAG (role, aria, keyboard nav, focusable skip link).
- Brak nowych zależności: Użyto cmdk (już zainstalowane).

## Wpływ
- **Pozytywny**: Intuicyjna nawigacja, redukcja tapów na mobile, lepsza discoverability funkcji (np. Reports via search/More).
- **Brak regresji**: Zachowano istniejące style/animacje; przetestowano responsive, dark mode.
- **Testy**: Manualne: mobile swipe/touch, desktop hover, keyboard-only, offline PWA.

## Next steps
- Przegląd i merge.
- Dodanie E2E testów dla nav flows.
- Rozszerzenie search o estimates/photos.

Closes # [jeśli dotyczy]