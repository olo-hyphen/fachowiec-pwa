import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/theme/ThemeProvider";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { PWAInstallPrompt } from "./components/PWAInstallPrompt";
import { PWAUpdatePrompt } from "./components/PWAUpdatePrompt";
import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import TimeTracking from "./pages/TimeTracking";
import Photos from "./pages/Photos";
import Clients from "./pages/Clients";
import Estimates from "./pages/Estimates";
import Calendar from "./pages/Calendar";
import Navbar from "./components/layout/Navbar";
import MobileNavigation from "./components/layout/MobileNavigation";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import Reports from "./pages/Reports";
import JobDetail from "./pages/JobDetail";
import ClientDetail from "./pages/ClientDetail";
import { Breadcrumbs } from "./components/navigation/Breadcrumbs";

import { useNotifications } from "./hooks/useNotifications";
import { useEffect } from 'react';
import OnboardingTour from './components/OnboardingTour';

const queryClient = new QueryClient();

function AppContent() {
  useKeyboardShortcuts();
  const { checkAndNotify } = useNotifications();

  useEffect(() => {
    checkAndNotify();
    const interval = setInterval(checkAndNotify, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [checkAndNotify]);
  
  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <Navbar />
        <Breadcrumbs />
      <a href="#main-content" className="sr-only focus:not-sr-only bg-background p-2 rounded z-50 fixed top-4 left-4">Przejdź do treści głównej</a>
        <main id="main-content" className="pb-20 md:pb-0">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/jobs" element={<Jobs />} />
                  <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/time-tracking" element={<TimeTracking />} />
          <Route path="/photos" element={<Photos />} />
          <Route path="/clients" element={<Clients />} />
                  <Route path="/clients/:id" element={<ClientDetail />} />
          <Route path="/estimates" element={<Estimates />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <MobileNavigation />
      <OnboardingTour />
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="fachowiec-theme">
              <CommandProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
            <CommandPalette />
            <AppContent />
          <PWAInstallPrompt />
          <PWAUpdatePrompt />
        </BrowserRouter>
      </TooltipProvider>
          </CommandProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
