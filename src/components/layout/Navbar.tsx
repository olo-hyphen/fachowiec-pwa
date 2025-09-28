import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Briefcase, 
  Clock, 
  Camera, 
  Calculator,
  BarChart3,
  Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Zlecenia', href: '/jobs', icon: Briefcase },
  { name: 'Czas pracy', href: '/time-tracking', icon: Clock },
  { name: 'Zdjęcia', href: '/photos', icon: Camera },
  { name: 'Kosztorysy', href: '/estimates', icon: Calculator },
  { name: 'Raporty', href: '/reports', icon: BarChart3 },
];

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
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary text-primary-foreground shadow-soft'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
            )}
          >
            <Icon className="h-4 w-4" />
            {item.name}
          </Link>
        );
      })}
    </>
  );

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:flex bg-card border-b border-border shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link 
                to="/" 
                className="flex items-center gap-2 text-xl font-bold text-primary"
              >
                <div className="p-2 bg-gradient-primary rounded-lg text-primary-foreground">
                  <Briefcase className="h-6 w-6" />
                </div>
                FachowiecApp
              </Link>
            </div>
            
            <div className="flex items-center space-x-1">
              <NavLinks />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <div className="md:hidden bg-card border-b border-border shadow-soft">
        <div className="flex justify-between items-center px-4 h-16">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-lg font-bold text-primary"
          >
            <div className="p-2 bg-gradient-primary rounded-lg text-primary-foreground">
              <Briefcase className="h-5 w-5" />
            </div>
            FachowiecApp
          </Link>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="flex flex-col gap-4 pt-8">
                <NavLinks />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  );
}