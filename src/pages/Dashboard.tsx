import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/ui/stat-card';
import { getJobs, getTimeEntries, initializeSampleData } from '@/lib/storage';
import { Job, TimeEntry, KPI } from '@/types';
import { 
  Briefcase, 
  Euro, 
  Clock, 
  Star, 
  Activity,
  TrendingUp,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

/**
 * Enhanced Dashboard with mesh background, better visual hierarchy,
 * and staggered animations
 */
export default function Dashboard() {
  const navigate = useNavigate();
  const [kpi, setKpi] = useState<KPI>({
    completedJobs: 0,
    totalRevenue: 0,
    averageJobDuration: 0,
    averageRating: 4.8,
    activeJobs: 0,
    profitMargin: 0
  });

  const [recentJobs, setRecentJobs] = useState<Job[]>([]);

  useEffect(() => {
    // Calculate KPIs
    const fetchData = async () => {
      const jobs = await getJobs();
      const timeEntries = await getTimeEntries();
      
      const completedJobs = jobs.filter(job => job.status === 'completed');
      const activeJobs = jobs.filter(job => job.status === 'in-progress');
      const totalRevenue = completedJobs.reduce((sum, job) => sum + (job.actual_cost || 0), 0);
      
      // Calculate average job duration from time entries
      const avgDuration = timeEntries.length > 0 
        ? timeEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0) / timeEntries.length / 60 // convert to hours
        : 0;

      setKpi({
        completedJobs: completedJobs.length,
        totalRevenue,
        averageJobDuration: Math.round(avgDuration * 10) / 10,
        averageRating: 4.8,
        activeJobs: activeJobs.length,
        profitMargin: 85
      });

      // Set recent jobs (last 5)
      const sortedJobs = jobs
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
        .slice(0, 5);
      setRecentJobs(sortedJobs as any);
    };
    
    fetchData();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'in-progress':
        return <Activity className="h-4 w-4 text-info" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-warning" />;
      case 'cancelled':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Zakończone';
      case 'in-progress':
        return 'W trakcie';
      case 'pending':
        return 'Oczekujące';
      case 'cancelled':
        return 'Anulowane';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen mesh-bg">
      <div className="container mx-auto p-4 md:p-8 space-y-8 md:space-y-10">
        {/* Header with Gradient and Animation */}
        <div className="space-y-3 animate-slide-up-fade">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-hero bg-clip-text text-transparent font-poppins">
            Dashboard
          </h1>
          <p className="text-muted-foreground font-inter text-sm md:text-base">
            Przegląd Twojej działalności
          </p>
        </div>

        {/* KPI Cards with Staggered Animation and Better Spacing */}
        <div 
          data-tour="kpi-cards" 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          <div className="animate-slide-up-fade delay-100">
            <StatCard
              title="Zakończone zlecenia"
              value={kpi.completedJobs}
              change={{ value: 12, label: 'w tym miesiącu' }}
              icon={CheckCircle}
              variant="premium"
            />
          </div>
          <div className="animate-slide-up-fade delay-200">
            <StatCard
              title="Łączne przychody"
              value={`${kpi.totalRevenue.toLocaleString('pl-PL')} zł`}
              change={{ value: 8, label: 'vs poprzedni miesiąc' }}
              icon={Euro}
              variant="elevated"
            />
          </div>
          <div className="animate-slide-up-fade delay-300">
            <StatCard
              title="Średni czas zlecenia"
              value={`${kpi.averageJobDuration}h`}
              change={{ value: -5, label: 'efektywność' }}
              icon={Clock}
              variant="default"
            />
          </div>
          <div className="animate-slide-up-fade delay-400">
            <StatCard
              title="Średnia ocena"
              value={kpi.averageRating}
              change={{ value: 2, label: 'zadowolenie klientów' }}
              icon={Star}
              variant="default"
            />
          </div>
          <div className="animate-slide-up-fade delay-500">
            <StatCard
              title="Aktywne zlecenia"
              value={kpi.activeJobs}
              icon={Activity}
              variant="elevated"
            />
          </div>
          <div className="animate-slide-up-fade delay-600">
            <StatCard
              title="Marża zysku"
              value={`${kpi.profitMargin}%`}
              change={{ value: 3, label: 'rentowność' }}
              icon={TrendingUp}
              variant="default"
            />
          </div>
        </div>

        {/* Recent Jobs with Better Separation */}
        <div className="space-y-6 animate-slide-up-fade delay-500">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl md:text-3xl font-bold font-poppins text-foreground">
              Ostatnie zlecenia
            </h2>
            <Button 
              variant="outline" 
              className="glass-card border-primary/30 hover-glow transition-glass active-press"
              onClick={() => navigate('/jobs')}
            >
              Zobacz wszystkie
            </Button>
          </div>

          <Card 
            data-tour="recent-jobs" 
            className="glass-premium border-none shadow-strong overflow-hidden"
          >
            <CardContent className="p-6 md:p-8">
              <div className="space-y-4">
                {recentJobs.length > 0 ? (
                  recentJobs.map((job, index) => (
                    <div 
                      key={job.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 md:p-5 rounded-xl glass-subtle hover-lift transition-glass cursor-pointer gap-3 animate-slide-up-fade"
                      style={{ animationDelay: `${600 + index * 100}ms` }}
                      onClick={() => navigate(`/jobs`)}
                    >
                      <div className="flex items-center gap-4 w-full sm:w-auto flex-1">
                        <div className="flex-shrink-0 transition-transform hover:scale-110">
                          {getStatusIcon(job.status)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-foreground font-inter mb-1 hover:text-primary transition-colors">
                            {job.title}
                          </h3>
                          <p className="text-sm text-muted-foreground truncate">
                            {job.clientName} • {job.address}
                          </p>
                        </div>
                      </div>
                      <div className="text-left sm:text-right w-full sm:w-auto flex-shrink-0">
                        <p className="font-bold text-foreground font-poppins text-base md:text-lg bg-gradient-primary bg-clip-text text-transparent">
                          {job.totalCost.toLocaleString('pl-PL')} zł
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {getStatusText(job.status)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground font-inter">
                      Brak ostatnich zleceń
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
