import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

export default function Dashboard() {
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
    // Initialize sample data on first load
    initializeSampleData();
    
    // Calculate KPIs
    const jobs = getJobs();
    const timeEntries = getTimeEntries();
    
    const completedJobs = jobs.filter(job => job.status === 'completed');
    const activeJobs = jobs.filter(job => job.status === 'in-progress');
    const totalRevenue = completedJobs.reduce((sum, job) => sum + job.totalCost, 0);
    
    // Calculate average job duration from time entries
    const avgDuration = timeEntries.length > 0 
      ? timeEntries.reduce((sum, entry) => sum + entry.duration, 0) / timeEntries.length / 60 // convert to hours
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
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5);
    setRecentJobs(sortedJobs);
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
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Przegląd Twoich zleceń i wyników biznesowych
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Zakończone zlecenia"
            value={kpi.completedJobs}
            change={{ value: 12, label: 'w tym miesiącu' }}
            icon={CheckCircle}
          />
          <StatCard
            title="Łączne przychody"
            value={`${kpi.totalRevenue.toLocaleString('pl-PL')} zł`}
            change={{ value: 8, label: 'vs poprzedni miesiąc' }}
            icon={Euro}
          />
          <StatCard
            title="Średni czas zlecenia"
            value={`${kpi.averageJobDuration}h`}
            change={{ value: -5, label: 'efektywność' }}
            icon={Clock}
          />
          <StatCard
            title="Średnia ocena"
            value={kpi.averageRating}
            change={{ value: 2, label: 'zadowolenie klientów' }}
            icon={Star}
          />
          <StatCard
            title="Aktywne zlecenia"
            value={kpi.activeJobs}
            icon={Activity}
          />
          <StatCard
            title="Marża zysku"
            value={`${kpi.profitMargin}%`}
            change={{ value: 3, label: 'rentowność' }}
            icon={TrendingUp}
          />
        </div>

        {/* Recent Jobs */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Ostatnie zlecenia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentJobs.map((job) => (
                <div
                  key={job.id}
                  className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg hover:bg-secondary/70 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {getStatusIcon(job.status)}
                    <div>
                      <h3 className="font-medium text-foreground">{job.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {job.clientName} • {job.address}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">
                      {job.totalCost.toLocaleString('pl-PL')} zł
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {getStatusText(job.status)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}