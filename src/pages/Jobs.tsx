import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { getJobs, saveJob, deleteJob } from '@/lib/storage';
import { Job, JobStatus, JobPriority } from '@/types';
import { 
  Plus, 
  Search, 
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  Activity,
  ArrowUpDown,
  Flag,
  Calendar,
  Tag
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date-desc');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    address: '',
    estimatedHours: '',
    hourlyRate: '',
    category: '',
    status: 'pending' as JobStatus,
    priority: 'medium' as JobPriority,
    tags: '',
    notes: ''
  });

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [jobs, searchTerm, statusFilter, priorityFilter, sortBy]);

  const loadJobs = async () => {
    const allJobs = await getJobs();
    setJobs(allJobs as any);
  };

  const filterJobs = () => {
    let filtered = jobs;

    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(job => job.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(job => job.priority === priorityFilter);
    }

    // Sortowanie
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'date-asc':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          return (priorityOrder[b.priority || 'medium'] || 0) - (priorityOrder[a.priority || 'medium'] || 0);
        case 'cost-desc':
          return b.totalCost - a.totalCost;
        case 'cost-asc':
          return a.totalCost - b.totalCost;
        case 'name':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    setFilteredJobs(filtered);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      clientName: '',
      clientPhone: '',
      clientEmail: '',
      address: '',
      estimatedHours: '',
      hourlyRate: '',
      category: '',
      status: 'pending',
      priority: 'medium',
      tags: '',
      notes: ''
    });
    setEditingJob(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const estimatedHours = parseInt(formData.estimatedHours);
    const hourlyRate = parseInt(formData.hourlyRate);
    
    if (!formData.title || !formData.clientName || !formData.address || !estimatedHours || !hourlyRate) {
      toast({
        title: "Błąd",
        description: "Wypełnij wszystkie wymagane pola",
        variant: "destructive"
      });
      return;
    }

    const jobData: Job = {
      id: editingJob?.id || Date.now().toString(),
      title: formData.title,
      description: formData.description,
      clientName: formData.clientName,
      clientPhone: formData.clientPhone,
      clientEmail: formData.clientEmail,
      address: formData.address,
      estimatedHours,
      hourlyRate,
      totalCost: estimatedHours * hourlyRate,
      status: formData.status,
      priority: formData.priority,
      category: formData.category,
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      notes: formData.notes,
      createdAt: editingJob?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...(formData.status === 'completed' && !editingJob?.completedAt && {
        completedAt: new Date().toISOString()
      })
    };

    saveJob(jobData);
    loadJobs();
    setIsDialogOpen(false);
    resetForm();
    
    toast({
      title: editingJob ? "Zlecenie zaktualizowane" : "Zlecenie utworzone",
      description: `Zlecenie "${jobData.title}" zostało ${editingJob ? 'zaktualizowane' : 'utworzone'}.`
    });
  };

  const handleEdit = (job: Job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      description: job.description,
      clientName: job.clientName,
      clientPhone: job.clientPhone || '',
      clientEmail: job.clientEmail || '',
      address: job.address,
      estimatedHours: job.estimatedHours.toString(),
      hourlyRate: job.hourlyRate.toString(),
      category: job.category || '',
      status: job.status,
      priority: job.priority || 'medium',
      tags: job.tags?.join(', ') || '',
      notes: job.notes || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (job: Job) => {
    if (confirm(`Czy na pewno chcesz usunąć zlecenie "${job.title}"?`)) {
      deleteJob(job.id);
      loadJobs();
      toast({
        title: "Zlecenie usunięte",
        description: `Zlecenie "${job.title}" zostało usunięte.`
      });
    }
  };

  const getStatusIcon = (status: JobStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'in-progress':
        return <Activity className="h-4 w-4 text-info" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-warning" />;
      case 'cancelled':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
    }
  };

  const getStatusText = (status: JobStatus) => {
    switch (status) {
      case 'completed':
        return 'Zakończone';
      case 'in-progress':
        return 'W trakcie';
      case 'pending':
        return 'Oczekujące';
      case 'cancelled':
        return 'Anulowane';
    }
  };

  const getStatusBadgeVariant = (status: JobStatus) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'in-progress':
        return 'secondary';
      case 'pending':
        return 'outline';
      case 'cancelled':
        return 'destructive';
    }
  };

  const getPriorityIcon = (priority?: JobPriority) => {
    switch (priority) {
      case 'urgent':
        return <Flag className="h-3 w-3 text-destructive fill-destructive" />;
      case 'high':
        return <Flag className="h-3 w-3 text-destructive" />;
      case 'medium':
        return <Flag className="h-3 w-3 text-warning" />;
      case 'low':
        return <Flag className="h-3 w-3 text-muted-foreground" />;
      default:
        return <Flag className="h-3 w-3 text-muted-foreground" />;
    }
  };

  const getPriorityText = (priority?: JobPriority) => {
    switch (priority) {
      case 'urgent':
        return 'Pilne';
      case 'high':
        return 'Wysoki';
      case 'medium':
        return 'Średni';
      case 'low':
        return 'Niski';
      default:
        return 'Średni';
    }
  };

  const handleQuickStatusChange = (job: Job, newStatus: JobStatus) => {
    const updatedJob = {
      ...job,
      status: newStatus,
      updatedAt: new Date().toISOString(),
      ...(newStatus === 'completed' && !job.completedAt && {
        completedAt: new Date().toISOString()
      })
    };
    saveJob(updatedJob);
    loadJobs();
    toast({
      title: "Status zaktualizowany",
      description: `Zlecenie "${job.title}" - ${getStatusText(newStatus)}`
    });
  };

  return (
    <div className="min-h-screen bg-background pb-safe">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Zlecenia</h1>
            <p className="text-base text-muted-foreground">
              Zarządzaj swoimi zleceniami i projektami
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={resetForm}
                className="bg-gradient-primary hover:bg-gradient-primary/90 shadow-soft w-full sm:w-auto"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nowe zlecenie
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] md:max-h-[85vh] overflow-y-auto">
              <DialogHeader className="sticky top-0 bg-background z-10 pb-4">
                <DialogTitle className="text-lg md:text-xl">
                  {editingJob ? 'Edytuj zlecenie' : 'Nowe zlecenie'}
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Tytuł zlecenia *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="np. Remont łazienki"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select 
                      value={formData.status} 
                      onValueChange={(value: JobStatus) => setFormData({ ...formData, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Oczekujące</SelectItem>
                        <SelectItem value="in-progress">W trakcie</SelectItem>
                        <SelectItem value="completed">Zakończone</SelectItem>
                        <SelectItem value="cancelled">Anulowane</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="priority">Priorytet</Label>
                    <Select 
                      value={formData.priority} 
                      onValueChange={(value: JobPriority) => setFormData({ ...formData, priority: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Niski</SelectItem>
                        <SelectItem value="medium">Średni</SelectItem>
                        <SelectItem value="high">Wysoki</SelectItem>
                        <SelectItem value="urgent">Pilne</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="category">Kategoria</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="np. Hydraulika"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Opis</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Szczegółowy opis prac do wykonania..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="clientName">Nazwa klienta *</Label>
                    <Input
                      id="clientName"
                      value={formData.clientName}
                      onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                      placeholder="Jan Kowalski"
                    />
                  </div>
                  <div>
                    <Label htmlFor="clientPhone">Telefon</Label>
                    <Input
                      id="clientPhone"
                      value={formData.clientPhone}
                      onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                      placeholder="+48 123 456 789"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="clientEmail">Email</Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    value={formData.clientEmail}
                    onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                    placeholder="jan@example.com"
                  />
                </div>

                <div>
                  <Label htmlFor="address">Adres *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="ul. Przykładowa 15, Warszawa"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="estimatedHours">Szacowane godziny *</Label>
                    <Input
                      id="estimatedHours"
                      type="number"
                      value={formData.estimatedHours}
                      onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value })}
                      placeholder="40"
                    />
                  </div>
                  <div>
                    <Label htmlFor="hourlyRate">Stawka godzinowa (zł) *</Label>
                    <Input
                      id="hourlyRate"
                      type="number"
                      value={formData.hourlyRate}
                      onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                      placeholder="80"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="tags">Tagi (oddziel przecinkami)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="np. remont, łazienka, pilne"
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Notatki</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Dodatkowe uwagi i notatki..."
                    rows={3}
                  />
                </div>

                {formData.estimatedHours && formData.hourlyRate && (
                  <div className="p-4 bg-secondary/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Szacowana wartość zlecenia:</p>
                    <p className="text-lg font-semibold text-foreground">
                      {(parseInt(formData.estimatedHours) * parseInt(formData.hourlyRate)).toLocaleString('pl-PL')} zł
                    </p>
                  </div>
                )}

                <div className="flex justify-end gap-2 sticky bottom-0 bg-background pt-4 pb-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                    className="flex-1 sm:flex-none"
                  >
                    Anuluj
                  </Button>
                  <Button type="submit" className="flex-1 sm:flex-none">
                    {editingJob ? 'Zaktualizuj' : 'Utwórz'} zlecenie
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card className="mb-6 shadow-soft">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3">
                <div className="w-full">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Szukaj zleceń..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Wszystkie</SelectItem>
                      <SelectItem value="pending">Oczekujące</SelectItem>
                      <SelectItem value="in-progress">W trakcie</SelectItem>
                      <SelectItem value="completed">Zakończone</SelectItem>
                      <SelectItem value="cancelled">Anulowane</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Priorytet" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Wszystkie</SelectItem>
                      <SelectItem value="urgent">Pilne</SelectItem>
                      <SelectItem value="high">Wysoki</SelectItem>
                      <SelectItem value="medium">Średni</SelectItem>
                      <SelectItem value="low">Niski</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full">
                      <ArrowUpDown className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Sortuj" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date-desc">Najnowsze</SelectItem>
                      <SelectItem value="date-asc">Najstarsze</SelectItem>
                      <SelectItem value="priority">Priorytet</SelectItem>
                      <SelectItem value="cost-desc">Wartość: malejąco</SelectItem>
                      <SelectItem value="cost-asc">Wartość: rosnąco</SelectItem>
                      <SelectItem value="name">Nazwa A-Z</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  Znaleziono: <span className="font-semibold text-foreground">{filteredJobs.length}</span>
                </span>
                {(statusFilter !== 'all' || priorityFilter !== 'all' || searchTerm) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('all');
                      setPriorityFilter('all');
                    }}
                  >
                    Wyczyść filtry
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Jobs List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="shadow-soft hover:shadow-medium transition-all hover-scale">
              <CardHeader className="pb-3 p-4 sm:p-6">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      {getPriorityIcon(job.priority)}
                      <CardTitle className="text-base sm:text-lg truncate">{job.title}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant={getStatusBadgeVariant(job.status)} className="flex items-center gap-1 text-xs">
                        {getStatusIcon(job.status)}
                        {getStatusText(job.status)}
                      </Badge>
                      {job.priority && job.priority !== 'medium' && (
                        <Badge variant="outline" className="text-xs">
                          {getPriorityText(job.priority)}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(job)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(job)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 p-4 sm:p-6 pt-0 sm:pt-0">
                <div>
                  <p className="text-sm text-foreground font-medium">{job.clientName}</p>
                  <p className="text-sm text-muted-foreground">{job.address}</p>
                </div>
                
                {job.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {job.description}
                  </p>
                )}

                {job.tags && job.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {job.tags.map((tag, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex justify-between items-end pt-2 border-t">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      {job.estimatedHours}h × {job.hourlyRate} zł/h
                    </p>
                    {job.category && (
                      <Badge variant="outline" className="text-xs">
                        {job.category}
                      </Badge>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Wartość</p>
                    <p className="text-lg font-bold text-foreground">
                      {job.totalCost.toLocaleString('pl-PL')} zł
                    </p>
                  </div>
                </div>

                {job.status !== 'completed' && job.status !== 'cancelled' && (
                  <div className="flex gap-2 pt-2">
                    {job.status === 'pending' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-xs"
                        onClick={() => handleQuickStatusChange(job, 'in-progress')}
                      >
                        <Activity className="h-3 w-3 mr-1" />
                        Rozpocznij
                      </Button>
                    )}
                    {job.status === 'in-progress' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-xs"
                        onClick={() => handleQuickStatusChange(job, 'completed')}
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Zakończ
                      </Button>
                    )}
                  </div>
                )}

                {job.notes && (
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      💡 {job.notes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <Card className="shadow-soft">
            <CardContent className="p-12 text-center">
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                Brak zleceń
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Nie znaleziono zleceń spełniających kryteria wyszukiwania.'
                  : 'Utwórz swoje pierwsze zlecenie, aby rozpocząć.'
                }
              </p>
              {(!searchTerm && statusFilter === 'all') && (
                <Button 
                  onClick={() => {
                    resetForm();
                    setIsDialogOpen(true);
                  }}
                  className="bg-gradient-primary hover:bg-gradient-primary/90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Utwórz zlecenie
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}