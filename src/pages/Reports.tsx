import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getJobs, getTimeEntries, getClients, getEstimates } from "@/lib/storage";
import { Job, TimeEntry } from "@/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";
import {
  FileText,
  Calendar,
  DollarSign,
  TrendingUp,
  Users,
  Clock,
  Activity,
  Target
} from "lucide-react";

export default function Reports() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [estimates, setEstimates] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState("last30");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [jobsData, timeData, clientsData, estimatesData] = await Promise.all([
      getJobs(),
      getTimeEntries(),
      getClients(), 
      getEstimates()
    ]);
    
    setJobs(jobsData as Job[]);
    setTimeEntries(timeData as TimeEntry[]);
    setClients(clientsData);
    setEstimates(estimatesData);
  };

  // Calculate metrics
  const completedJobs = jobs.filter(job => job.status === 'completed');
  const activeJobs = jobs.filter(job => job.status === 'in-progress');
  const pendingJobs = jobs.filter(job => job.status === 'pending');
  
  const totalRevenue = completedJobs.reduce((sum, job) => sum + (job.actual_cost || job.totalCost), 0);
  const totalHoursLogged = timeEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0) / 60;
  const avgJobValue = completedJobs.length > 0 ? totalRevenue / completedJobs.length : 0;
  
  // Status distribution for pie chart
  const statusData = [
    { name: 'Zakończone', value: completedJobs.length, color: '#10b981' },
    { name: 'W trakcie', value: activeJobs.length, color: '#3b82f6' },
    { name: 'Oczekujące', value: pendingJobs.length, color: '#f59e0b' },
    { name: 'Anulowane', value: jobs.filter(j => j.status === 'cancelled').length, color: '#ef4444' }
  ].filter(item => item.value > 0);

  // Monthly revenue data
  const monthlyData = (() => {
    const months = ['Sty', 'Lut', 'Mar', 'Kwi', 'Maj', 'Cze', 'Lip', 'Sie', 'Wrz', 'Paź', 'Lis', 'Gru'];
    const data = months.map(month => ({ name: month, revenue: 0, jobs: 0 }));
    
    completedJobs.forEach(job => {
      if (job.completedAt) {
        const month = new Date(job.completedAt).getMonth();
        data[month].revenue += job.actual_cost || job.totalCost;
        data[month].jobs += 1;
      }
    });
    
    return data.filter(d => d.revenue > 0 || d.jobs > 0).slice(-6);
  })();

  // Category distribution
  const categoryData = (() => {
    const categories: Record<string, number> = {};
    jobs.forEach(job => {
      const category = job.category || 'Inne';
      categories[category] = (categories[category] || 0) + (job.actual_cost || job.totalCost);
    });
    
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  })();

  // Client value ranking
  const clientStats = (() => {
    const clientData: Record<string, { name: string, jobs: number, revenue: number }> = {};
    
    jobs.forEach(job => {
      const client = job.clientName;
      if (!clientData[client]) {
        clientData[client] = { name: client, jobs: 0, revenue: 0 };
      }
      clientData[client].jobs += 1;
      if (job.status === 'completed') {
        clientData[client].revenue += job.actual_cost || job.totalCost;
      }
    });
    
    return Object.values(clientData).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  })();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 pb-24">
      <div className="container mx-auto p-4 md:p-6 space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Raporty
              </h1>
              <p className="text-muted-foreground mt-1">Analiza działalności i statystyki</p>
            </div>
          </div>
          
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last7">Ostatnie 7 dni</SelectItem>
              <SelectItem value="last30">Ostatnie 30 dni</SelectItem>
              <SelectItem value="last90">Ostatnie 90 dni</SelectItem>
              <SelectItem value="thisYear">Ten rok</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Łączne przychody"
            value={`${totalRevenue.toLocaleString('pl-PL')} zł`}
            change={{ value: 12, label: 'vs poprzedni okres' }}
            icon={DollarSign}
          />
          <StatCard
            title="Zakończone zlecenia"
            value={completedJobs.length}
            change={{ value: 8, label: 'w tym okresie' }}
            icon={Target}
          />
          <StatCard
            title="Przepracowane godziny"
            value={`${Math.round(totalHoursLogged)}h`}
            change={{ value: -5, label: 'efektywność' }}
            icon={Clock}
          />
          <StatCard
            title="Śr. wartość zlecenia"
            value={`${Math.round(avgJobValue).toLocaleString('pl-PL')} zł`}
            change={{ value: 15, label: 'wzrost' }}
            icon={TrendingUp}
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status Distribution */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Status zleceń
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Monthly Revenue */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Przychody miesięczne
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${Number(value).toLocaleString('pl-PL')} zł`, 'Przychód']} />
                  <Bar dataKey="revenue" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Revenue */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5" />
                Przychody wg kategorii
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryData.map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{category.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 bg-secondary rounded-full w-24">
                        <div
                          className="h-2 bg-primary rounded-full"
                          style={{ width: `${(category.value / Math.max(...categoryData.map(c => c.value))) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {category.value.toLocaleString('pl-PL')} zł
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Clients */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Top klienci
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {clientStats.map((client, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        index === 0 ? 'bg-yellow-500 text-yellow-900' :
                        index === 1 ? 'bg-gray-400 text-gray-900' :
                        index === 2 ? 'bg-orange-500 text-orange-900' :
                        'bg-primary text-primary-foreground'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{client.name}</p>
                        <p className="text-sm text-muted-foreground">{client.jobs} zleceń</p>
                      </div>
                    </div>
                    <Badge variant="secondary">
                      {client.revenue.toLocaleString('pl-PL')} zł
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary */}
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Podsumowanie okresu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-success">Zakończone projekty</h3>
                <div className="space-y-2">
                  {completedJobs.slice(0, 3).map(job => (
                    <div key={job.id} className="flex justify-between items-center text-sm">
                      <span className="truncate">{job.title}</span>
                      <Badge variant="outline">{(job.actual_cost || job.totalCost).toLocaleString('pl-PL')} zł</Badge>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-info">Aktywne projekty</h3>
                <div className="space-y-2">
                  {activeJobs.slice(0, 3).map(job => (
                    <div key={job.id} className="flex justify-between items-center text-sm">
                      <span className="truncate">{job.title}</span>
                      <Badge variant="secondary">{job.totalCost.toLocaleString('pl-PL')} zł</Badge>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-warning">Nadchodzące</h3>
                <div className="space-y-2">
                  {pendingJobs.slice(0, 3).map(job => (
                    <div key={job.id} className="flex justify-between items-center text-sm">
                      <span className="truncate">{job.title}</span>
                      <Badge variant="outline">{job.totalCost.toLocaleString('pl-PL')} zł</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}