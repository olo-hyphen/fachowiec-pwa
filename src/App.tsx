import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Navbar />
          <main className="pb-20 md:pb-0">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/time-tracking" element={<TimeTracking />} />
              <Route path="/photos" element={<Photos />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/estimates" element={<Estimates />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/reports" element={<div className="p-4 md:p-8"><h1 className="text-2xl font-poppins">Raporty - W przygotowaniu</h1></div>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <MobileNavigation />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
