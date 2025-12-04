import { AppLayout } from "@/components/layout/app-layout";
import { cn } from "@/lib/utils";
import { formatDisplayDate } from "@/lib/date-utils";
import { Receipt, Plus, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBills, createBill, updateBill, deleteBill } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import type { Bill, InsertBill } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function Bills() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [editingBill, setEditingBill] = useState<Bill | null>(null);
  const [formData, setFormData] = useState<InsertBill>({
    provider: "",
    amount: "0",
    dueDate: "",
    status: "Due",
    lastPaid: null,
    attachmentUrl: null,
    source: "manual",
  });

  const { data: bills = [] } = useQuery({
    queryKey: ["bills"],
    queryFn: getBills,
  });

  const createMutation = useMutation({
    mutationFn: createBill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bills"] });
      queryClient.invalidateQueries({ queryKey: ["upcoming-payments"] });
      toast({ title: "Bill added" });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<InsertBill> }) =>
      updateBill(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bills"] });
      queryClient.invalidateQueries({ queryKey: ["upcoming-payments"] });
      toast({ title: "Bill updated" });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bills"] });
      queryClient.invalidateQueries({ queryKey: ["upcoming-payments"] });
      toast({ title: "Bill deleted" });
    },
  });

  const resetForm = () => {
    setFormData({ provider: "", amount: "0", dueDate: "", status: "Due", lastPaid: null, attachmentUrl: null, source: "manual" });
    setEditingBill(null);
    setIsOpen(false);
  };

  const handleEdit = (bill: Bill) => {
    setEditingBill(bill);
    setFormData({
      provider: bill.provider,
      amount: bill.amount,
      dueDate: bill.dueDate,
      status: bill.status,
      lastPaid: bill.lastPaid,
      attachmentUrl: bill.attachmentUrl,
      source: bill.source,
    });
    setIsOpen(true);
  };

  const handleMarkPaid = (bill: Bill) => {
    updateMutation.mutate({ 
      id: bill.id, 
      data: { 
        status: "Paid", 
        lastPaid: new Date().toISOString().split('T')[0] 
      } 
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBill) {
      updateMutation.mutate({ id: editingBill.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-display font-bold text-slate-800 dark:text-slate-100">Bills & Utilities</h1>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditingBill(null); setFormData({ provider: "", amount: "0", dueDate: "", status: "Due", lastPaid: null, attachmentUrl: null, source: "manual" }); }}>
                <Plus className="mr-2 h-4 w-4" /> Add Bill
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingBill ? "Edit Bill" : "Add Bill"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Provider</Label>
                  <Input
                    value={formData.provider}
                    onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                    placeholder="Electric Company, Water..."
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Amount</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Due">Due</SelectItem>
                        <SelectItem value="Paid">Paid</SelectItem>
                        <SelectItem value="Overdue">Overdue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                    {editingBill ? "Update" : "Add"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6">
          {bills.map((bill) => (
            <div
              key={bill.id}
              className="relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-white/40 dark:border-white/5 shadow-sm hover:shadow-md transition-all group"
            >
              <div className={cn(
                "absolute left-0 top-0 bottom-0 w-1.5",
                bill.status === "Overdue" ? "bg-rose-500" : bill.status === "Due" ? "bg-amber-500" : "bg-green-500"
              )} />

              <div className="flex items-start gap-4 pl-4">
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  <Receipt className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{bill.provider}</h3>
                  <p className="text-sm text-slate-500">Due: {formatDisplayDate(bill.dueDate)}</p>
                </div>
              </div>

              <div className="mt-4 sm:mt-0 pl-4 flex items-center gap-4">
                <div className="text-right">
                  <div className="text-xl font-bold text-slate-800 dark:text-slate-100">${Number(bill.amount).toFixed(2)}</div>
                  <Badge 
                    variant={bill.status === "Paid" ? "default" : "destructive"}
                    className={cn(
                      "mt-1",
                      bill.status === "Paid" ? "bg-green-100 text-green-700 hover:bg-green-200" : 
                      bill.status === "Due" ? "bg-amber-100 text-amber-700 hover:bg-amber-200" : 
                      "bg-rose-100 text-rose-700 hover:bg-rose-200"
                    )}
                  >
                    {bill.status}
                  </Badge>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  {bill.status !== "Paid" && (
                    <Button variant="outline" size="sm" onClick={() => handleMarkPaid(bill)}>
                      Mark Paid
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(bill)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(bill.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {bills.length === 0 && (
            <p className="text-center text-slate-500 py-12">No bills found. Add your first bill!</p>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
