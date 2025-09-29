import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash2, FileText, Calendar } from "lucide-react";
import { format } from "date-fns";

interface Client {
  id: string;
  name: string;
}

interface EstimateItem {
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

interface Estimate {
  id: string;
  client_id: string | null;
  title: string;
  description: string | null;
  items: EstimateItem[];
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total_amount: number;
  status: string;
  valid_until: string | null;
  created_at: string;
}

export default function Estimates() {
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    client_id: "",
    title: "",
    description: "",
    tax_rate: 23,
    valid_until: "",
    items: [{ description: "", quantity: 1, unit_price: 0 }]
  });

  useEffect(() => {
    fetchEstimates();
    fetchClients();
  }, []);

  const fetchEstimates = async () => {
    const { data, error } = await supabase
      .from("cost_estimates")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error", description: "Failed to load estimates", variant: "destructive" });
    } else {
      setEstimates((data || []).map(item => ({
        ...item,
        items: Array.isArray(item.items) ? item.items as unknown as EstimateItem[] : []
      })));
    }
  };

  const fetchClients = async () => {
    const { data, error } = await supabase.from("clients").select("id, name");
    if (!error) setClients(data || []);
  };

  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => 
      sum + (item.quantity * item.unit_price), 0
    );
    const tax_amount = (subtotal * formData.tax_rate) / 100;
    const total_amount = subtotal + tax_amount;
    return { subtotal, tax_amount, total_amount };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { subtotal, tax_amount, total_amount } = calculateTotals();

    const estimateData = {
      client_id: formData.client_id || null,
      title: formData.title,
      description: formData.description,
      items: formData.items,
      subtotal,
      tax_rate: formData.tax_rate,
      tax_amount,
      total_amount,
      valid_until: formData.valid_until || null,
      status: "draft"
    };

    const { error } = await supabase.from("cost_estimates").insert([estimateData]);

    if (error) {
      toast({ title: "Error", description: "Failed to create estimate", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Estimate created successfully" });
      fetchEstimates();
      closeDialog();
    }
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("cost_estimates")
      .update({ status })
      .eq("id", id);

    if (error) {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Status updated" });
      fetchEstimates();
    }
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: "", quantity: 1, unit_price: 0 }]
    });
  };

  const removeItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index)
    });
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setFormData({
      client_id: "",
      title: "",
      description: "",
      tax_rate: 23,
      valid_until: "",
      items: [{ description: "", quantity: 1, unit_price: 0 }]
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: any = {
      draft: "secondary",
      sent: "default",
      accepted: "default",
      rejected: "destructive"
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 pb-24">
      <div className="container mx-auto p-4 md:p-6 space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Kosztorysy
            </h1>
            <p className="text-muted-foreground mt-1">Twórz i zarządzaj kosztorysami</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Nowy kosztorys
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-effect max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Nowy kosztorys</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Tytuł *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client">Klient</Label>
                    <Select value={formData.client_id} onValueChange={(value) => setFormData({ ...formData, client_id: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Wybierz klienta" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tax_rate">VAT (%)</Label>
                    <Input
                      id="tax_rate"
                      type="number"
                      value={formData.tax_rate}
                      onChange={(e) => setFormData({ ...formData, tax_rate: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="valid_until">Ważny do</Label>
                    <Input
                      id="valid_until"
                      type="date"
                      value={formData.valid_until}
                      onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Opis</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={2}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Pozycje</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addItem}>
                      <Plus className="h-4 w-4 mr-2" />
                      Dodaj pozycję
                    </Button>
                  </div>
                  {formData.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-end p-3 bg-secondary/20 rounded-lg">
                      <div className="col-span-5">
                        <Label className="text-xs">Opis</Label>
                        <Input
                          value={item.description}
                          onChange={(e) => updateItem(index, "description", e.target.value)}
                          required
                        />
                      </div>
                      <div className="col-span-2">
                        <Label className="text-xs">Ilość</Label>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, "quantity", parseFloat(e.target.value))}
                          required
                        />
                      </div>
                      <div className="col-span-2">
                        <Label className="text-xs">Cena jedn.</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={item.unit_price}
                          onChange={(e) => updateItem(index, "unit_price", parseFloat(e.target.value))}
                          required
                        />
                      </div>
                      <div className="col-span-2">
                        <Label className="text-xs">Suma</Label>
                        <Input
                          value={(item.quantity * item.unit_price).toFixed(2)}
                          disabled
                        />
                      </div>
                      <div className="col-span-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(index)}
                          disabled={formData.items.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-secondary/20 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span>Netto:</span>
                    <span className="font-semibold">{calculateTotals().subtotal.toFixed(2)} zł</span>
                  </div>
                  <div className="flex justify-between">
                    <span>VAT ({formData.tax_rate}%):</span>
                    <span className="font-semibold">{calculateTotals().tax_amount.toFixed(2)} zł</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Brutto:</span>
                    <span>{calculateTotals().total_amount.toFixed(2)} zł</span>
                  </div>
                </div>

                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={closeDialog}>
                    Anuluj
                  </Button>
                  <Button type="submit">Zapisz kosztorys</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4">
          {estimates.map((estimate) => (
            <Card key={estimate.id} className="glass-effect">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      {estimate.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {estimate.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(estimate.status)}
                    <Select
                      value={estimate.status}
                      onValueChange={(value) => updateStatus(estimate.id, value)}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="sent">Sent</SelectItem>
                        <SelectItem value="accepted">Accepted</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Kwota netto</div>
                    <div className="text-2xl font-bold">{estimate.subtotal.toFixed(2)} zł</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Kwota brutto</div>
                    <div className="text-2xl font-bold text-primary">
                      {estimate.total_amount.toFixed(2)} zł
                    </div>
                  </div>
                </div>
                {estimate.valid_until && (
                  <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Ważny do: {format(new Date(estimate.valid_until), "dd.MM.yyyy")}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {estimates.length === 0 && (
          <Card className="glass-effect">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground">Brak kosztorysów. Utwórz pierwszy!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
