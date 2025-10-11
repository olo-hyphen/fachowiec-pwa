# 🛠️ Fachowiec PWA - Aplikacja do zarządzania zleceniami

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]()
[![PWA](https://img.shields.io/badge/PWA-enabled-blue)]()
[![License](https://img.shields.io/badge/license-MIT-green)]()

**Kompleksowa aplikacja Progressive Web App dla fachowców** - zarządzaj zleceniami, klientami, czasem pracy i kosztorysami w jednym miejscu. Działa offline z wykorzystaniem localStorage!

## ✨ Funkcje

- 📱 **Progressive Web App** - instalowalna na telefonie i komputerze
- 🔒 **System autentykacji** - bezpieczne logowanie z localStorage
- 📊 **Dashboard** - przegląd statystyk i aktywnych zleceń
- 👥 **Zarządzanie klientami** - baza kontaktów z oceną i notatkami
- 📋 **Zlecenia** - pełne zarządzanie zleceniami z priorytetami i statusami
- 💰 **Kosztorysy** - tworzenie profesjonalnych kosztorysów z VAT
- 📅 **Kalendarz** - wizualizacja zleceń w kalendarzu miesięcznym
- ⏱️ **Czas pracy** - śledzenie czasu pracy przy zleceniach
- 📸 **Zdjęcia** - dokumentacja zleceń (przed/po)
- 🌙 **Tryb ciemny** - automatyczne przełączanie motywu
- 📱 **Responsywny design** - działa na wszystkich urządzeniach
- 🔄 **Offline-first** - pełna funkcjonalność bez internetu

## 🚀 Szybki start

### Wymagania

- Node.js 18+ 
- npm lub bun

### Instalacja

```bash
# Klonuj repozytorium
git clone https://github.com/olo-hyphen/fachowiec-pwa.git
cd fachowiec-pwa

# Zainstaluj zależności
npm install

# Uruchom serwer deweloperski
npm run dev
```

Aplikacja będzie dostępna pod adresem `http://localhost:8080`

### Build produkcyjny

```bash
# Zbuduj aplikację
npm run build

# Podgląd buildu
npm run preview
```

## 📦 Technologie

### Frontend
- **React 18** - biblioteka UI
- **TypeScript** - typowanie statyczne
- **Vite** - szybki bundler
- **TailwindCSS v4** - style CSS
- **Shadcn UI** - komponenty UI
- **React Router** - routing
- **Lucide Icons** - ikony

### PWA
- **Vite PWA Plugin** - generowanie Service Workera
- **Workbox** - strategia cachowania
- **Web Manifest** - konfiguracja PWA

### Storage
- **localStorage** - przechowywanie danych użytkownika
- **sessionStorage** - dane sesji

## 🔐 Bezpieczeństwo

- Hasła przechowywane lokalnie (zalecane dodanie hashowania w produkcji)
- Sesje wygasają po 7 dniach
- Separacja danych per użytkownik
- Brak zewnętrznych połączeń (100% offline)

## 📱 Instalacja PWA

1. Otwórz aplikację w przeglądarce
2. Kliknij "Dodaj do ekranu głównego" w menu przeglądarki
3. Aplikacja zainstaluje się jako natywna aplikacja
4. Ikona pojawi się na ekranie głównym

## 🚀 Wdrożenie

Aplikacja jest gotowa do wdrożenia na:

### Vercel (Zalecane) ⭐

```bash
# Zainstaluj Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Lub połącz repozytorium przez [vercel.com](https://vercel.com)

### Netlify

```bash
# Zbuduj projekt
npm run build

# Przeciągnij folder dist na netlify.com
```

Lub użyj Netlify CLI:

```bash
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

### GitHub Pages

Workflow GitHub Actions jest już skonfigurowany w `.github/workflows/deploy.yml`

1. Idź do Settings → Pages
2. Source: **GitHub Actions**
3. Push do `main` automatycznie wdroży aplikację

**📖 Szczegółowe instrukcje:** [DEPLOYMENT.md](./DEPLOYMENT.md)  
**⚡ Szybki przewodnik:** [QUICK_DEPLOY.md](./QUICK_DEPLOY.md)

## 📂 Struktura projektu

```
fachowiec-pwa/
├── public/              # Statyczne pliki
│   ├── icons/          # Ikony PWA
│   └── manifest.json   # Web Manifest
├── src/
│   ├── components/     # Komponenty React
│   │   ├── ui/        # Shadcn UI komponenty
│   │   ├── layout/    # Layout komponenty
│   │   └── auth/      # Komponenty autentykacji
│   ├── contexts/      # React Contexts
│   ├── hooks/         # Custom hooks
│   ├── lib/           # Biblioteki
│   │   ├── auth.ts   # System autentykacji
│   │   └── storage.ts # Zarządzanie localStorage
│   ├── pages/         # Strony aplikacji
│   └── types/         # TypeScript typy
├── netlify.toml       # Konfiguracja Netlify
├── vercel.json        # Konfiguracja Vercel
└── vite.config.ts     # Konfiguracja Vite + PWA
```

## 🧪 Testy

```bash
# Uruchom testy (jeśli zaimplementowane)
npm test

# Sprawdź build
npm run build

# Lighthouse audit
npx lighthouse http://localhost:8080 --view
```

## 📊 LocalStorage

Aplikacja przechowuje dane w localStorage:

```
fachowiec_users              - Użytkownicy
fachowiec_session            - Aktualna sesja
fachowiec_clients_{userId}   - Klienci
fachowiec_jobs_{userId}      - Zlecenia
fachowiec_estimates_{userId} - Kosztorysy
fachowiec_time_entries_{userId} - Czas pracy
fachowiec_photos_{userId}    - Zdjęcia
```

## 🛣️ Roadmap

- [ ] Hashowanie haseł (bcrypt)
- [ ] Export/Import danych do JSON
- [ ] Synchronizacja z chmurą (opcjonalna)
- [ ] Więcej raportów i statystyk
- [ ] Faktury i płatności
- [ ] Powiadomienia push
- [ ] Tryb offline z sync queue

## 🤝 Kontribucje

Pull requesty są mile widziane!

1. Fork projektu
2. Stwórz branch (`git checkout -b feature/AmazingFeature`)
3. Commit zmian (`git commit -m 'Add AmazingFeature'`)
4. Push do brancha (`git push origin feature/AmazingFeature`)
5. Otwórz Pull Request

## 📄 Licencja

MIT License - zobacz [LICENSE](LICENSE) dla szczegółów

## 👨‍💻 Autor

**OlekTV Olczyk**

- GitHub: [@olo-hyphen](https://github.com/olo-hyphen)

## 🙏 Podziękowania

- [Shadcn UI](https://ui.shadcn.com/) - komponenty UI
- [Lucide](https://lucide.dev/) - ikony
- [Vite PWA](https://vite-pwa-org.netlify.app/) - plugin PWA

---

**⚡ Zbudowane z Vite + React + TypeScript + TailwindCSS**

**📱 Offline-first Progressive Web App**

**🎨 Responsywny i nowoczesny design**
