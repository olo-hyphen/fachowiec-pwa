import { NavLink, useNavigate } from "react-router-dom";
import { Home, Briefcase, Users, FileText, Calendar, Plus, Clock, Settings } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useSwipeGesture } from "@/hooks/useSwipeGesture";
import { Vibration } from "@/lib/vibration";
import { cn } from "@/lib/utils";
import { MoreSheet } from "@/components/navigation/MoreSheet";
import { MoreHorizontal } from "lucide-react";
import { PWAStatus } from "@/components/PWAStatus";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home, dataTour: 'dashboard-link' },
  { name: "Zlecenia", href: "/jobs", icon: Briefcase, dataTour: 'jobs-link' },
  { name: "Klienci", href: "/clients", icon: Users, dataTour: 'clients-link' },
  { name: "Czas pracy", href: "/time-tracking", icon: Clock, dataTour: 'time-tracking-link' },
  { name: "Zdjęcia", href: "/photos", icon: Camera, dataTour: 'photos-link' },
  { name: "Więcej", href: "#", icon: MoreHorizontal, dataTour: 'more-menu' },
];

/**
 * Enhanced Mobile Navigation with:
 * - Swipe gestures to hide/show
 * - Haptic feedback on interactions
 * - Premium glassmorphism styling
 * - Smooth animations
 */
export default function MobileNavigation() {
  const [showFAB, setShowFAB] = useState(false);
  const [hideNav, setHideNav] = useState(false);
  const navigate = useNavigate();

  // Swipe gesture for bottom nav
  const { handlers: swipeHandlers } = useSwipeGesture({
    onSwipeUp: () => {
      setHideNav(true);
      Vibration.light();
    },
    onSwipeDown: () => {
      setHideNav(false);
      Vibration.light();
    },
    threshold: 30,
  });

  const handleNavigate = (path: string) => {
    Vibration.light(); // Haptic feedback
    navigate(path);
    setShowFAB(false);
  };

  const toggleFAB = () => {
    Vibration.medium();
    setShowFAB(!showFAB);
  };

  const handleNavClick = () => {
    Vibration.light();
  };

  return (
    <>
      {/* Bottom Navigation with Swipe */}
      <div 
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 md:hidden transition-transform duration-300",
          hideNav ? "translate-y-full" : "translate-y-0"
        )}
        {...swipeHandlers}
      >
        <div className="glass-premium rounded-t-3xl border-t-2 border-primary/20 shadow-strong">
          {/* Swipe Indicator */}
          <div className="flex justify-center pt-2 pb-1">
            <div className="w-12 h-1 rounded-full bg-muted-foreground/30" />
          </div>
          
          <nav role="navigation" aria-label="Główna nawigacja dolna" className="flex items-center justify-around px-2 pb-3 pb-safe">
            {navigation.map((item, index) => {
                if (item.name === 'Więcej') {
                  return (
                    <MoreSheet key={item.name} data-tour={item.dataTour} style={{ animationDelay: `${index * 50}ms` }} />
                  );
                }
                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    data-tour={item.dataTour}
                    onClick={handleNavClick}
                    className={({ isActive }) =>
                      cn(
                        "flex flex-col items-center space-y-1 px-3 py-2.5 rounded-2xl min-w-[44px] min-h-[44px]",
                        "transition-all duration-300 active-press",
                        "animate-slide-up-fade",
                        isActive
                          ? "bg-gradient-primary text-primary-foreground shadow-glow scale-105 aria-current='page'"
                          : "text-muted-foreground hover:text-foreground hover:bg-primary/5"
                      )
                    }
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                <item.icon className="h-5 w-5 transition-transform group-hover:scale-110" />
                <span className="text-[10px] font-medium">{item.name}</span>
              </NavLink>
            ))}
            
            <div 
              className="flex flex-col items-center space-y-1 px-2 py-2" 
              data-tour="theme-toggle"
            >
              <ThemeToggle />
            </div>
          </nav>
        </div>
      </div>

      {/* Enhanced FAB with Sub-actions */}
      <div className="fixed bottom-24 right-6 z-40 md:hidden">
        <div className="relative">
          {/* Sub-buttons with staggered animation */}
          {showFAB && (
            <div className="absolute bottom-20 right-0 space-y-3">
              {[
                { icon: Briefcase, label: 'Zlecenie', path: '/jobs', delay: 0 },
                { icon: Clock, label: 'Czas', path: '/time-tracking', delay: 100 },
              ].map((action) => (
                <div
                  key={action.label}
                  className="relative group animate-slide-in-right"
                  style={{ animationDelay: `${action.delay}ms` }}
                >
                  <Button
                    size="lg"
                    className="w-14 h-14 rounded-full glass-premium hover-lift hover-glow transition-glass active-press"
                    onClick={() => handleNavigate(action.path)}
                    aria-label={action.label}
                  >
                    <action.icon className="h-6 w-6" />
                  </Button>
                  {/* Tooltip */}
                  <span className="absolute right-16 top-1/2 -translate-y-1/2 glass-card text-foreground text-xs px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all pointer-events-none shadow-medium">
                    {action.label}
                  </span>
                </div>
              ))}
            </div>
          )}
          
          {/* Main FAB */}
          <Button
            size="lg"
            onClick={toggleFAB}
            className={cn(
              "w-16 h-16 rounded-full bg-gradient-primary shadow-glow transition-all duration-500 active-press",
              "hover:shadow-strong hover:scale-110",
              showFAB && "rotate-45 scale-110"
            )}
            aria-label={showFAB ? "Zamknij menu" : "Otwórz menu szybkich akcji"}
          >
            <Plus className="h-7 w-7 text-primary-foreground" />
          </Button>
        </div>
      </div>

      {/* Bottom padding for content */}
      <div className="h-20 md:hidden" />
    </>
  );
}
