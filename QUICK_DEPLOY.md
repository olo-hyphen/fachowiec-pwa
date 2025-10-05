# 🚀 Szybki przewodnik wdrożenia

## Kroki wdrożenia na Vercel (NAJSZYBSZE - 2 minuty!)

### Opcja 1: Przez stronę internetową (Najłatwiejsze)

1. **Zaloguj się na Vercel:**
   - Wejdź na [vercel.com](https://vercel.com)
   - Zaloguj się przez GitHub

2. **Zaimportuj projekt:**
   - Kliknij "Add New" → "Project"
   - Znajdź repozytorium `olo-hyphen/fachowiec-pwa`
   - Kliknij "Import"

3. **Deploy:**
   - Vercel automatycznie wykryje ustawienia
   - Kliknij "Deploy"
   - Gotowe! 🎉

4. **Twoja aplikacja:**
   - URL: `https://fachowiec-pwa.vercel.app`
   - Każdy push do `main` automatycznie wdraża nową wersję

### Opcja 2: Przez CLI

```bash
# Zainstaluj Vercel CLI
npm i -g vercel

# Deploy
cd /path/to/fachowiec-pwa
vercel --prod
```

---

## Alternatywa: Netlify

### Metoda 1: Drag & Drop (Najprostsza)

1. Zbuduj projekt lokalnie:
   ```bash
   npm run build
   ```

2. Wejdź na [netlify.com](https://netlify.com)

3. Przeciągnij folder `dist` na stronę

4. Gotowe! 🎉

### Metoda 2: GitHub Integration

1. Wejdź na [netlify.com](https://netlify.com)
2. "Add new site" → "Import an existing project"
3. Wybierz GitHub → `olo-hyphen/fachowiec-pwa`
4. Deploy!

---

## GitHub Pages

### Automatyczne wdrożenie (już skonfigurowane!)

1. **Włącz GitHub Pages:**
   - Idź do Settings → Pages
   - Build and deployment → Source: **GitHub Actions**

2. **Zmerguj PR #3 do main**
   
3. **Workflow się uruchomi automatycznie**

4. **Aplikacja będzie dostępna pod:**
   - `https://olo-hyphen.github.io/fachowiec-pwa/`

**UWAGA:** Musisz zaktualizować `base` w `vite.config.ts`:

```typescript
export default defineConfig({
  base: '/fachowiec-pwa/',
  // ...
})
```

---

## 🎯 Która opcja wybrać?

| Cecha | Vercel | Netlify | GitHub Pages |
|-------|--------|---------|--------------|
| Szybkość wdrożenia | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| Łatwość | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| Darmowy plan | ✅ | ✅ | ✅ |
| Custom domain | ✅ | ✅ | ✅ |
| Auto SSL | ✅ | ✅ | ✅ |
| Preview deployments | ✅ | ✅ | ❌ |
| Analytics | ✅ Płatne | ✅ Płatne | ❌ |

**Rekomendacja:** **Vercel** - najlepsza integracja z Vite/React

---

## 📱 Po wdrożeniu

### Sprawdź:

1. **PWA działa:**
   - Otwórz DevTools → Application → Manifest
   - Service Worker powinien być aktywny

2. **Instalacja działa:**
   - Na telefonie pojawi się "Dodaj do ekranu głównego"

3. **Offline mode:**
   - Wyłącz internet
   - Aplikacja powinna nadal działać

### Testowanie:

```bash
# Lighthouse audit
npx lighthouse https://your-app-url.com --view
```

---

## 🔧 Własna domena

### Vercel:

1. Settings → Domains → Add
2. Dodaj swoją domenę
3. Skonfiguruj DNS u swojego providera

### Netlify:

1. Domain settings → Add custom domain
2. Skonfiguruj DNS

---

## ✅ Gotowe pliki:

- ✅ `netlify.toml` - konfiguracja Netlify
- ✅ `vercel.json` - konfiguracja Vercel  
- ✅ `.github/workflows/deploy.yml` - GitHub Actions
- ✅ `deploy.sh` - skrypt pomocniczy
- ✅ `DEPLOYMENT.md` - pełna dokumentacja

---

## 🆘 Pomoc

Jeśli coś nie działa:

1. Sprawdź Console w przeglądarce
2. Zweryfikuj czy build przechodzi: `npm run build`
3. Przetestuj lokalnie: `npm run preview`
4. Sprawdź logi na platformie hostingowej

---

**Powodzenia! 🚀**

Twoja aplikacja będzie dostępna dla użytkowników w ciągu kilku minut!
