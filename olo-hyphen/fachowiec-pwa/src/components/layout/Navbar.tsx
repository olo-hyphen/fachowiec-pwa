import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Briefcase, 
  Clock, 
  Camera, 
  Users,
  FileText,
  Calendar as CalendarIcon,
  BarChart3,
  Menu,
  LogOut,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { KeyboardShortcutsInfo } from '@/components/KeyboardShortcutsInfo';
import { PWAStatus } from '@/components/PWAStatus';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home, dataTour: 'dashboard-link' },
  { name: 'Zlecenia', href: '/jobs', icon: Briefcase, dataTour: 'jobs-link' },
  { name: 'Klienci', href: '/clients', icon: Users, dataTour: 'clients-link' },
  { name: 'Kosztorysy', href: '/estimates', icon: FileText, dataTour: 'estimates-link' },
  { name: 'Kalendarz', href: '/calendar', icon: CalendarIcon, dataTour: 'calendar-link' },
  { name: 'Czas pracy', href: '/time-tracking', icon: Clock, dataTour: 'time-tracking-link' },
  { name: 'Zdjęcia', href: '/photos', icon: Camera, dataTour: 'photos-link' },
  { name: 'Raporty', href: '/reports', icon: BarChart3 },
  { name: 'Ustawienia', href: '/settings', icon: Settings },
];

/**
 * Enhanced Navbar with premium glassmorphism and better visual hierarchy
 */
export default function Navbar() {
  const location = useLocation();

  const NavLinks = () => (
    <>
      {navigation.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.href;
        
        return (
          <Link
            key={item.name}
            to={item.href}
            data-tour={item.dataTour}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-glass font-inter active-press',
              isActive
                ? 'bg-gradient-primary text-primary-foreground shadow-glow scale-105'
                : 'text-muted-foreground hover:text-foreground glass-subtle hover:scale-102 hover-glow'
            )}
          >
            <Icon className="h-5 w-5 transition-transform group-hover:scale-110" />
            {item.name}
          </Link>
        );
      })}
    </>
  );

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:flex glass-premium border-none shadow-strong sticky top-0 z-50 backdrop-blur-3xl">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link 
                to="/" 
                className="flex items-center gap-3 text-xl font-bold text-foreground font-poppins hover:scale-105 transition-all duration-300 active-press group"
              >
                <div className="p-2.5 bg-gradient-primary rounded-2xl text-primary-foreground shadow-glow group-hover:shadow-strong group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <Briefcase className="h-6 w-6" />
                </div>
                <span className="bg-gradient-hero bg-clip-text text-transparent">
                  FachowiecApp
                </span>
              </Link>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <NavLinks />
              </div>
              <div className="h-8 w-px bg-border mx-2" />
              <div data-tour="pwa-status">
                <PWAStatus />
              </div>
              <div data-tour="keyboard-shortcuts">
                <KeyboardShortcutsInfo />
              </div>
              <div data-tour="theme-toggle">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <div className="md:hidden glass-premium border-none shadow-strong sticky top-0 z-50 backdrop-blur-3xl">
        <div className="flex justify-between items-center px-4 h-16">
          <Link 
            to="/" 
            className="flex items-center gap-2.5 text-lg font-bold text-foreground font-poppins hover:scale-105 transition-all duration-300 active-press group"
          >
            <div className="p-2 bg-gradient-primary rounded-xl text-primary-foreground shadow-glow group-hover:shadow-strong group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
              <Briefcase className="h-5 w-5" />
            </div>
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              FachowiecApp
            </span>
          </Link>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="glass-subtle hover:scale-110 transition-glass active-press hover-glow min-w-[44px] min-h-[44px]"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 glass-premium border-l border-primary/20">
                <div className="flex flex-col gap-3 pt-8">
                  <div className="mb-4 pb-4 border-b border-border">
                    <h2 className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent font-poppins">
                      Menu
                    </h2>
                  </div>
                  <NavLinks />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </>
  );
}
