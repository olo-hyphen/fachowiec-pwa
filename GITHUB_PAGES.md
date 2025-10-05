# GitHub Pages - Konfiguracja

## ✅ Zmiany dla GitHub Pages

### 1. Konfiguracja automatyczna
Aplikacja automatycznie wykrywa czy jest budowana dla GitHub Pages przez zmienną środowiskową `GITHUB_PAGES`.

### 2. Różnice między hostingami

| Funkcja | GitHub Pages | Vercel/Netlify |
|---------|-------------|----------------|
| Base URL | `/fachowiec-pwa/` | `/` |
| Manifest scope | `/fachowiec-pwa/` | `/` |
| Manifest start_url | `/fachowiec-pwa/` | `/` |
| Ikony PWA | `/fachowiec-pwa/icon.png` | `/icon.png` |
| Shortcuts | `/fachowiec-pwa/jobs` | `/jobs` |

### 3. SPA Routing dla GitHub Pages

Dodano obsługę routingu dla Single Page Application:

- **404.html** - przekierowuje do index.html z zachowaniem ścieżki
- **index.html** - skrypt odczytuje i przywraca oryginalną ścieżkę

To rozwiązuje problem 404 na podstronach (np. `/jobs`, `/clients`)

### 4. GitHub Actions Workflow

Workflow automatycznie:
1. Instaluje zależności
2. Buduje z `GITHUB_PAGES=true`
3. Uploaduje artifact
4. Wdraża na GitHub Pages

## 🚀 Jak wdrożyć na GitHub Pages

### Krok 1: Zmerguj PR do main

```bash
# Zmerguj PR #3
gh pr merge 3 --merge
```

### Krok 2: Włącz GitHub Pages

1. Idź do **Settings** → **Pages**
2. W sekcji **Build and deployment**:
   - Source: **GitHub Actions**
3. Gotowe!

### Krok 3: Sprawdź deployment

Workflow uruchomi się automatycznie po merge do `main`.

Status: https://github.com/olo-hyphen/fachowiec-pwa/actions

### Krok 4: Otwórz aplikację

URL: **https://olo-hyphen.github.io/fachowiec-pwa/**

## 🔧 Testowanie lokalnie

Możesz przetestować build dla GitHub Pages lokalnie:

```bash
# Build z GitHub Pages config
GITHUB_PAGES=true npm run build

# Testuj lokalnie (wymaga http-server)
npx http-server dist -p 8080
```

Pamiętaj: Musisz otworzyć `http://localhost:8080/fachowiec-pwa/`

## ⚙️ Zmiana konfiguracji

Jeśli chcesz zmienić base URL (np. dla innej nazwy repo):

**vite.config.ts:**
```typescript
base: process.env.GITHUB_PAGES === 'true' ? '/NOWA-NAZWA/' : '/',
```

**404.html:**
Automatycznie dostosuje się do nowej struktury URL.

## 🔄 Dla innych hostingów (Vercel/Netlify)

Build automatycznie używa `/` jako base:

```bash
# Normalny build (bez GITHUB_PAGES)
npm run build
```

Wszystko działa out-of-the-box! ✨

## 📝 Uwagi

- PWA manifest automatycznie dostosowuje ścieżki
- Service Worker cache'uje assety z prawidłowymi ścieżkami
- Router React prawidłowo obsługuje routing z base URL
- 404 redirect działa transparentnie dla użytkownika

## ✅ Testy przeszły pomyślnie

- ✅ Build z GITHUB_PAGES=true
- ✅ Build bez GITHUB_PAGES
- ✅ Manifest PWA z poprawnymi ścieżkami
- ✅ Index.html z base URL
- ✅ 404.html redirect działa
- ✅ GitHub Actions workflow skonfigurowany

## 🎯 Deployment gotowy!

Aplikacja jest w pełni skonfigurowana i gotowa do wdrożenia na GitHub Pages.
