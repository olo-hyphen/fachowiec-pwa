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
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { KeyboardShortcutsInfo } from '@/components/KeyboardShortcutsInfo';
import { useAuth } from '@/contexts/AuthContext';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Zlecenia', href: '/jobs', icon: Briefcase },
  { name: 'Klienci', href: '/clients', icon: Users },
  { name: 'Kosztorysy', href: '/estimates', icon: FileText },
  { name: 'Kalendarz', href: '/calendar', icon: CalendarIcon },
  { name: 'Czas pracy', href: '/time-tracking', icon: Clock },
  { name: 'Zdjęcia', href: '/photos', icon: Camera },
  { name: 'Raporty', href: '/reports', icon: BarChart3 },
];

export default function Navbar() {
  const location = useLocation();
  const { signOut } = useAuth();

  const NavLinks = () => (
    <>
      {navigation.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.href;
        
        return (
          <Link
            key={item.name}
            to={item.href}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-300 hover:scale-105 font-inter',
              isActive
                ? 'bg-gradient-primary text-primary-foreground shadow-glow'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:shadow-soft'
            )}
          >
            <Icon className="h-5 w-5" />
            {item.name}
          </Link>
        );
      })}
    </>
  );

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:flex glass-card border-none shadow-glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link 
                to="/" 
                className="flex items-center gap-3 text-xl font-bold text-foreground font-poppins hover:scale-105 transition-transform duration-300"
              >
                <div className="p-2 bg-gradient-primary rounded-2xl text-primary-foreground shadow-glow">
                  <Briefcase className="h-6 w-6" />
                </div>
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  FachowiecApp
                </span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-2">
              <NavLinks />
              <KeyboardShortcutsInfo />
              <ThemeToggle />
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={signOut}
                className="flex items-center gap-2 hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="h-4 w-4" />
                Wyloguj
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <div className="md:hidden glass-card border-none shadow-glass sticky top-0 z-50">
        <div className="flex justify-between items-center px-4 h-16">
          <Link 
            to="/" 
            className="flex items-center gap-3 text-lg font-bold text-foreground font-poppins hover:scale-105 transition-transform duration-300"
          >
            <div className="p-2 bg-gradient-primary rounded-xl text-primary-foreground shadow-glow">
              <Briefcase className="h-5 w-5" />
            </div>
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              FachowiecApp
            </span>
          </Link>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="hover:bg-muted/50 hover:scale-110 transition-all duration-300">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64 glass-card border-none">
                <div className="flex flex-col gap-3 pt-8">
                  <NavLinks />
                  <Button 
                    variant="ghost" 
                    onClick={signOut}
                    className="flex items-center gap-2 hover:bg-destructive/10 hover:text-destructive justify-start"
                  >
                    <LogOut className="h-5 w-5" />
                    Wyloguj
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </>
  );
}