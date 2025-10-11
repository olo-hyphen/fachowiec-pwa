import { useState, useEffect } from "react";
import { getClients, saveClient, deleteClient } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Mail, Phone, MapPin, Star, Trash2, Edit } from "lucide-react";

interface Client {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  notes: string | null;
  rating: number | null;
  created_at: string;
}

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
    rating: 5
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const data = await getClients();
      setClients(data);
      setIsLoading(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load clients",
        variant: "destructive"
      });
      setIsLoading(false);
    }
        title: "Error",
        description: "Failed to load clients",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingClient) {
        await saveClient({ ...formData, id: editingClient.id });
        toast({ title: "Success", description: "Client updated successfully" });
      } else {
        await saveClient(formData);
        toast({ title: "Success", description: "Client created successfully" });
      }
      fetchClients();
      closeDialog();
    } catch (error) {
      toast({
        title: "Error",
        description: editingClient ? "Failed to update client" : "Failed to create client",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this client?")) return;

    try {
      await deleteClient(id);
      toast({ title: "Success", description: "Client deleted successfully" });
      fetchClients();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete client",
        variant: "destructive"
      });
    }
  };

  const openEditDialog = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      email: client.email || "",
      phone: client.phone || "",
      address: client.address || "",
      notes: client.notes || "",
      rating: client.rating || 5
    });
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingClient(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      notes: "",
      rating: 5
    });
  };

  return (
    <div className="min-h-screen mesh-bg pb-24">
      <div className="container mx-auto p-4 md:p-8 space-y-8 animate-fade-in">
        <div className="flex items-center justify-between animate-slide-up-fade">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-hero bg-clip-text text-transparent font-poppins">
              Klienci
            </h1>
            <p className="text-muted-foreground mt-2 font-inter text-sm md:text-base">Zarządzaj bazą klientów</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-gradient-primary hover:shadow-glow transition-glass active-press shadow-medium">
                <Plus className="h-4 w-4" />
                Dodaj klienta
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-premium max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingClient ? "Edytuj klienta" : "Nowy klient"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nazwa / Imię i nazwisko *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefon</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rating">Ocena</Label>
                    <Input
                      id="rating"
                      type="number"
                      min="1"
                      max="5"
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Adres</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notatki</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={closeDialog}>
                    Anuluj
                  </Button>
                  <Button type="submit">
                    {editingClient ? "Zapisz zmiany" : "Dodaj klienta"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="glass-subtle rounded-lg shadow-soft min-h-[200px]">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <Skeleton className="h-5 w-48 animate-shimmer rounded" />
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-8 rounded animate-shimmer" />
                      <Skeleton className="h-8 w-8 rounded animate-shimmer" />
                    </div>
                  </div>
                  <div className="flex gap-1 mt-2">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Skeleton key={j} className="h-4 w-4 rounded-full animate-shimmer" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 pt-0">
                  <Skeleton className="h-4 w-3/4 animate-shimmer rounded" />
                  <Skeleton className="h-4 w-full animate-shimmer rounded" />
                  <Skeleton className="h-4 w-2/3 animate-shimmer rounded" />
                  <Skeleton className="h-4 w-full animate-shimmer rounded" />
                </CardContent>
              </Card>
            ))
          ) : (
            clients.map((client, index) => (
              <Card key={client.id} className="glass-effect hover-scale">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{client.name}</CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(client)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(client.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {client.rating && (
                    <div data-tour={index === 0 ? 'client-rating' : undefined} className="flex gap-1">
                      {Array.from({ length: client.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-2">
                  {client.email && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span className="truncate">{client.email}</span>
                    </div>
                  )}
                  {client.phone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{client.phone}</span>
                    </div>
                  )}
                  {client.address && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span className="line-clamp-2">{client.address}</span>
                    </div>
                  )}
                  {client.notes && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                      {client.notes}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))

          ))}
        </div>

        {(!isLoading && clients.length === 0) && (
          <Card className="glass-effect">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground">Brak klientów. Dodaj pierwszego!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
