# Fachowiec PWA - Przewodnik wdrożenia

## 🚀 Opcje hostingu

Aplikacja jest gotowa do wdrożenia na następujących platformach:

### 1. Vercel (Zalecane) ⭐

**Zalety:**
- Automatyczne wdrożenia z GitHub
- Szybka sieć CDN
- Darmowy plan dla projektów osobistych
- Zero-config dla aplikacji Vite/React
- Preview deployments dla PR

**Instrukcja:**

1. Zaloguj się na [vercel.com](https://vercel.com)
2. Kliknij "Add New" → "Project"
3. Importuj repozytorium `olo-hyphen/fachowiec-pwa`
4. Vercel automatycznie wykryje ustawienia:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Kliknij "Deploy"

**URL:** `https://fachowiec-pwa.vercel.app`

---

### 2. Netlify

**Zalety:**
- Łatwa konfiguracja
- Dobre wsparcie dla PWA
- Darmowy SSL
- Form handling i serverless functions

**Instrukcja:**

1. Zaloguj się na [netlify.com](https://netlify.com)
2. Kliknij "Add new site" → "Import an existing project"
3. Wybierz GitHub i repozytorium `olo-hyphen/fachowiec-pwa`
4. Ustawienia (automatycznie wykryte z `netlify.toml`):
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Kliknij "Deploy site"

**URL:** `https://fachowiec-pwa.netlify.app`

---

### 3. GitHub Pages

**Zalety:**
- Całkowicie darmowy
- Zintegrowany z GitHub
- Prosty w użyciu

**Instrukcja:**

1. W repozytorium GitHub przejdź do Settings → Pages
2. W sekcji "Build and deployment":
   - Source: GitHub Actions
3. Workflow `.github/workflows/deploy.yml` jest już dodany
4. Push do brancha `main` automatycznie wdroży aplikację

**Konfiguracja base URL:**

Jeśli repozytorium nie jest głównym (np. `username.github.io`), musisz dodać base w `vite.config.ts`:

```typescript
export default defineConfig({
  base: '/fachowiec-pwa/', // nazwa repozytorium
  // reszta konfiguracji...
})
```

**URL:** `https://olo-hyphen.github.io/fachowiec-pwa/`

---

## 📋 Przygotowanie przed wdrożeniem

### 1. Sprawdź build lokalnie

```bash
npm run build
npm run preview
```

### 2. Sprawdź plik package.json

Upewnij się, że wszystkie skrypty są poprawne:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### 3. Zmienne środowiskowe

Aplikacja nie wymaga zmiennych środowiskowych (używa localStorage).

---

## 🔧 Pliki konfiguracyjne

### ✅ Utworzone pliki:

- `netlify.toml` - konfiguracja dla Netlify
- `vercel.json` - konfiguracja dla Vercel
- `.github/workflows/deploy.yml` - workflow dla GitHub Pages

---

## 📱 PWA - Testowanie po wdrożeniu

Po wdrożeniu sprawdź:

1. **Manifest:**
   - Otwórz DevTools → Application → Manifest
   - Sprawdź czy wszystkie ikony się ładują

2. **Service Worker:**
   - Sprawdź w Application → Service Workers
   - Powinien być zarejestrowany i aktywny

3. **Offline:**
   - Włącz tryb offline w DevTools
   - Aplikacja powinna działać

4. **Instalacja:**
   - Na telefonie/komputerze powinna pojawić się opcja "Dodaj do ekranu głównego"

---

## 🌐 Własna domena

### Vercel:

1. Settings → Domains
2. Dodaj swoją domenę
3. Skonfiguruj DNS zgodnie z instrukcjami

### Netlify:

1. Domain settings → Add custom domain
2. Skonfiguruj DNS u swojego dostawcy

### GitHub Pages:

1. Settings → Pages → Custom domain
2. Dodaj plik `CNAME` w katalogu `public/` z nazwą domeny
3. Skonfiguruj DNS:
   ```
   A Record → 185.199.108.153
   A Record → 185.199.109.153
   A Record → 185.199.110.153
   A Record → 185.199.111.153
   ```

---

## ✅ Checklist przed wdrożeniem

- [x] Build przechodzi lokalnie
- [x] Aplikacja działa w trybie preview
- [x] Wszystkie testy zakończone sukcesem
- [x] Pliki konfiguracyjne utworzone
- [ ] Wybrano platformę hostingu
- [ ] Repozytorium podłączone do hostingu
- [ ] Aplikacja wdrożona
- [ ] PWA działa poprawnie
- [ ] SSL aktywny (HTTPS)

---

## 🆘 Troubleshooting

### Problem: Białą strona po wdrożeniu

**Rozwiązanie:**
- Sprawdź Console w DevTools
- Zweryfikuj `base` w `vite.config.ts`
- Upewnij się, że routing SPA jest skonfigurowany (redirects)

### Problem: Service Worker nie działa

**Rozwiązanie:**
- PWA wymaga HTTPS (localhost też działa)
- Sprawdź czy `manifest.json` jest dostępny
- Wyczyść cache przeglądarki

### Problem: 404 na podstronach

**Rozwiązanie:**
- Sprawdź czy masz skonfigurowane redirects w `netlify.toml` lub `vercel.json`
- Dla GitHub Pages użyj `404.html` = `index.html`

---

## 📊 Monitoring

### Vercel Analytics:

Dodaj `@vercel/analytics`:

```bash
npm install @vercel/analytics
```

W `src/main.tsx`:

```typescript
import { inject } from '@vercel/analytics';
inject();
```

### Lighthouse:

Uruchom testy wydajności:

```bash
npx lighthouse https://your-app-url.com --view
```

---

## 🎯 Polecana opcja: Vercel

Dla tego projektu polecam **Vercel** ze względu na:
- Najlepszą integrację z Vite
- Automatyczne optimizacje
- Najszybsze wdrożenie
- Darmowy plan w zupełności wystarczający
- Preview deployments dla każdego PR

**Deployment zajmie około 2-3 minut!**
