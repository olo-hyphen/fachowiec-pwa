#!/bin/bash

# 🚀 Skrypt szybkiego wdrożenia Fachowiec PWA
# Autor: Capy AI
# Data: 5 października 2025

set -e

echo "🚀 Rozpoczynam wdrożenie Fachowiec PWA..."
echo ""

# Kolory
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Funkcja do wyświetlania kroków
step() {
    echo -e "${BLUE}➜${NC} $1"
}

success() {
    echo -e "${GREEN}✓${NC} $1"
}

warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

error() {
    echo -e "${RED}✗${NC} $1"
}

# Sprawdzenie Node.js
step "Sprawdzanie Node.js..."
if ! command -v node &> /dev/null; then
    error "Node.js nie jest zainstalowany!"
    exit 1
fi
NODE_VERSION=$(node -v)
success "Node.js $NODE_VERSION"

# Sprawdzenie npm
step "Sprawdzanie npm..."
if ! command -v npm &> /dev/null; then
    error "npm nie jest zainstalowany!"
    exit 1
fi
NPM_VERSION=$(npm -v)
success "npm $NPM_VERSION"

# Instalacja zależności
step "Instalowanie zależności..."
npm install
success "Zależności zainstalowane"

# Build
step "Budowanie aplikacji..."
npm run build
success "Aplikacja zbudowana"

# Sprawdzenie rozmiaru
step "Analiza buildu..."
BUILD_SIZE=$(du -sh dist | cut -f1)
success "Rozmiar buildu: $BUILD_SIZE"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✓ Build gotowy do wdrożenia!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📦 Wybierz platformę do wdrożenia:"
echo ""
echo "1️⃣  Vercel (Zalecane)"
echo "   • npx vercel --prod"
echo "   • Lub połącz repo na vercel.com"
echo ""
echo "2️⃣  Netlify"
echo "   • npx netlify-cli deploy --prod --dir=dist"
echo "   • Lub przeciągnij folder dist na netlify.com"
echo ""
echo "3️⃣  GitHub Pages"
echo "   • git push origin main"
echo "   • Włącz GitHub Pages w Settings → Pages"
echo "   • Source: GitHub Actions"
echo ""
echo "📖 Więcej informacji: DEPLOYMENT.md"
echo ""

# Opcjonalnie uruchom preview
read -p "Czy chcesz uruchomić podgląd lokalnie? (t/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Tt]$ ]]; then
    step "Uruchamianie preview..."
    npm run preview
fi
