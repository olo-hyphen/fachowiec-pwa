import { NavLink, useNavigate } from "react-router-dom";
import { Home, Briefcase, Users, FileText, Calendar, Plus, Clock } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Zlecenia", href: "/jobs", icon: Briefcase },
  { name: "Klienci", href: "/clients", icon: Users },
  { name: "Kosztorysy", href: "/estimates", icon: FileText },
  { name: "Kalendarz", href: "/calendar", icon: Calendar },
];

export default function MobileNavigation() {
  const [showFAB, setShowFAB] = useState(false);
  const navigate = useNavigate();

  const toggleFAB = () => setShowFAB(!showFAB);

  const handleNavigate = (path: string) => {
    navigate(path);
    setShowFAB(false);
  };

  return (
    <>
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <div className="glass-card rounded-t-3xl border-t shadow-strong">
          <nav className="flex items-center justify-around px-2 py-3">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `flex flex-col items-center space-y-1 px-3 py-2.5 rounded-2xl transition-all duration-300 min-w-[44px] min-h-[44px] ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-glow transform scale-105"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`
                }
              >
                <item.icon className="h-5 w-5" />
                <span className="text-[11px] font-medium">{item.name}</span>
              </NavLink>
            ))}
            <div className="flex flex-col items-center space-y-1 px-2 py-2">
              <ThemeToggle />
            </div>
          </nav>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-24 right-6 z-40 md:hidden">
        <div className="relative">
          {showFAB && (
            <div className="absolute bottom-20 right-0 space-y-3 animate-slide-up">
              <div className="relative group">
                <Button
                  size="lg"
                  className="w-14 h-14 rounded-full glass-card shadow-glass hover:shadow-glow transition-all duration-300 hover:scale-110"
                  onClick={() => handleNavigate("/jobs")}
                  aria-label="Nowe zlecenie"
                >
                  <Briefcase className="h-6 w-6" />
                </Button>
                <span className="absolute right-16 top-1/2 -translate-y-1/2 bg-foreground text-background text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  Zlecenie
                </span>
              </div>
              <div className="relative group">
                <Button
                  size="lg"
                  className="w-14 h-14 rounded-full glass-card shadow-glass hover:shadow-glow transition-all duration-300 hover:scale-110"
                  onClick={() => handleNavigate("/time-tracking")}
                  aria-label="Czas pracy"
                >
                  <Clock className="h-6 w-6" />
                </Button>
                <span className="absolute right-16 top-1/2 -translate-y-1/2 bg-foreground text-background text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  Czas pracy
                </span>
              </div>
            </div>
          )}
          
          <Button
            size="lg"
            onClick={toggleFAB}
            className="w-16 h-16 rounded-full bg-gradient-primary shadow-glow hover:shadow-strong transition-all duration-300 hover:scale-110 transform"
          >
            <Plus 
              className={`h-7 w-7 transition-transform duration-300 ${
                showFAB ? "rotate-45" : "rotate-0"
              }`} 
            />
          </Button>
        </div>
      </div>

      {/* Bottom padding for content */}
      <div className="h-20 md:hidden" />
    </>
  );
}