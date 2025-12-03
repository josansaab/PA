import { AppLayout } from "@/components/layout/app-layout";
import { Calendar, Plus, Pencil, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSubscriptions, createSubscription, updateSubscription, deleteSubscription } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import type { Subscription, InsertSubscription } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function Subscriptions() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<Subscription | null>(null);
  const [formData, setFormData] = useState<InsertSubscription>({
    name: "",
    cost: "0",
    cycle: "Monthly",
    renewalDate: "",
    logo: null,
  });

  const { data: subscriptions = [] } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: getSubscriptions,
  });

  const createMutation = useMutation({
    mutationFn: createSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["upcoming-payments"] });
      toast({ title: "Subscription added" });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<InsertSubscription> }) =>
      updateSubscription(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["upcoming-payments"] });
      toast({ title: "Subscription updated" });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["upcoming-payments"] });
      toast({ title: "Subscription deleted" });
    },
  });

  const resetForm = () => {
    setFormData({ name: "", cost: "0", cycle: "Monthly", renewalDate: "", logo: null });
    setEditingSub(null);
    setIsOpen(false);
  };

  const handleEdit = (sub: Subscription) => {
    setEditingSub(sub);
    setFormData({
      name: sub.name,
      cost: sub.cost,
      cycle: sub.cycle,
      renewalDate: sub.renewalDate,
      logo: sub.logo,
    });
    setIsOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSub) {
      updateMutation.mutate({ id: editingSub.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-display font-bold text-slate-800 dark:text-slate-100">Subscriptions</h1>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditingSub(null); setFormData({ name: "", cost: "0", cycle: "Monthly", renewalDate: "", logo: null }); }}>
                <Plus className="mr-2 h-4 w-4" /> Add Subscription
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingSub ? "Edit Subscription" : "Add Subscription"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Netflix, Spotify..."
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Cost</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.cost}
                      onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Cycle</Label>
                    <Select value={formData.cycle} onValueChange={(v) => setFormData({ ...formData, cycle: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Monthly">Monthly</SelectItem>
                        <SelectItem value="Yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Renewal Date</Label>
                  <Input
                    type="date"
                    value={formData.renewalDate}
                    onChange={(e) => setFormData({ ...formData, renewalDate: e.target.value })}
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                    {editingSub ? "Update" : "Add"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {subscriptions.map((sub) => (
            <div
              key={sub.id}
              className="glass-card p-6 rounded-3xl flex flex-col items-center text-center space-y-4 relative group"
            >
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => handleEdit(sub)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(sub.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
              
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 text-2xl font-bold shadow-inner">
                {sub.name[0]}
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{sub.name}</h3>
                <p className="text-sm text-slate-500">{sub.cycle} Plan</p>
              </div>

              <div className="text-3xl font-bold text-slate-900 dark:text-white">
                ${Number(sub.cost).toFixed(2)}
              </div>

              <div className="w-full pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Renewal
                </span>
                <span className="font-medium text-slate-700 dark:text-slate-300">{sub.renewalDate}</span>
              </div>
            </div>
          ))}
          {subscriptions.length === 0 && (
            <div className="col-span-full text-center text-slate-500 py-12">
              No subscriptions found. Add your first subscription!
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
