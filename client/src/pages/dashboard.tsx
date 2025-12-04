import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckSquare, Receipt, CreditCard, School, ShoppingCart, Plus, X, Check, CheckCircle } from "lucide-react";
import { VoiceInput } from "@/components/voice-input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { formatDisplayDate } from "@/lib/date-utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTasks, getBills, getSubscriptions, getUpcomingPayments, getKidsEvents, getGroceries, createGrocery, updateGrocery, deleteGrocery, updateBill, type UpcomingPayment } from "@/lib/api";
import type { Bill, Subscription } from "@shared/schema";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [newGroceryItem, setNewGroceryItem] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<{ type: 'bill' | 'subscription'; item: Bill | Subscription } | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const { data: tasks = [] } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  const { data: bills = [] } = useQuery({
    queryKey: ["bills"],
    queryFn: getBills,
  });

  const { data: subscriptions = [] } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: getSubscriptions,
  });

  const { data: upcomingPayments = [] } = useQuery({
    queryKey: ["upcoming-payments"],
    queryFn: () => getUpcomingPayments(14),
  });

  const { data: kidsEvents = [] } = useQuery({
    queryKey: ["kids-events"],
    queryFn: getKidsEvents,
  });

  const { data: groceries = [] } = useQuery({
    queryKey: ["groceries"],
    queryFn: getGroceries,
  });

  const createGroceryMutation = useMutation({
    mutationFn: createGrocery,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groceries"] });
      setNewGroceryItem("");
    },
  });

  const updateGroceryMutation = useMutation({
    mutationFn: ({ id, checked }: { id: number; checked: boolean }) =>
      updateGrocery(id, { checked }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groceries"] });
    },
  });

  const deleteGroceryMutation = useMutation({
    mutationFn: deleteGrocery,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groceries"] });
    },
  });

  const updateBillMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Bill> }) =>
      updateBill(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bills"] });
      queryClient.invalidateQueries({ queryKey: ["upcoming-payments"] });
      toast({ title: "Bill updated" });
      setEditDialogOpen(false);
      setSelectedPayment(null);
    },
  });

  const handlePaymentClick = (payment: UpcomingPayment) => {
    setSelectedPayment({ type: payment.type, item: payment.item });
    setEditDialogOpen(true);
  };

  const handleMarkPaid = () => {
    if (selectedPayment?.type === 'bill') {
      const bill = selectedPayment.item as Bill;
      updateBillMutation.mutate({
        id: bill.id,
        data: { status: "Paid", lastPaid: format(new Date(), "yyyy-MM-dd") }
      });
    }
  };

  const handleStatusChange = (status: string) => {
    if (selectedPayment?.type === 'bill') {
      const bill = selectedPayment.item as Bill;
      updateBillMutation.mutate({
        id: bill.id,
        data: { status }
      });
    }
  };

  const handleAddGrocery = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGroceryItem.trim()) {
      createGroceryMutation.mutate({ name: newGroceryItem.trim() });
    }
  };

  const formatDateForSpeech = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'long' });
    const year = date.getFullYear();
    const currentYear = new Date().getFullYear();
    
    const ordinal = (n: number) => {
      if (n > 3 && n < 21) return n + 'th';
      switch (n % 10) {
        case 1: return n + 'st';
        case 2: return n + 'nd';
        case 3: return n + 'rd';
        default: return n + 'th';
      }
    };
    
    if (year === currentYear) {
      return `${ordinal(day)} of ${month}`;
    }
    return `${ordinal(day)} of ${month} ${year}`;
  };

  const speak = (message: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      // Try to find a natural sounding voice
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => 
        v.name.includes('Samantha') || 
        v.name.includes('Karen') || 
        v.name.includes('Daniel') ||
        v.name.includes('Google') ||
        (v.lang.startsWith('en') && v.localService)
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleVoiceCommand = (text: string) => {
    const lowerText = text.toLowerCase().trim();
    
    // Check for queries about subscriptions/bills
    const queryPatterns = [
      /when (?:is|does) (?:the )?(.+?) (?:due|renew|renewal)/i,
      /(?:what|when) (?:is|are) (?:the )?(.+?) (?:due|renewal|renew)/i,
      /(.+?) (?:due|renewal) date/i,
      /tell me (?:about |when )?(?:the )?(.+?) (?:is )?(?:due|renews?)/i,
    ];
    
    for (const pattern of queryPatterns) {
      const match = lowerText.match(pattern);
      if (match && match[1]) {
        const searchTerm = match[1].trim();
        
        // Search in subscriptions
        const sub = subscriptions.find(s => 
          s.name.toLowerCase().includes(searchTerm)
        );
        if (sub) {
          const spokenDate = formatDateForSpeech(sub.renewalDate);
          speak(`${sub.name} renews on the ${spokenDate}. The cost is $${Number(sub.cost).toFixed(2)} ${sub.cycle.toLowerCase()}.`);
          return;
        }
        
        // Search in bills
        const bill = bills.find(b => 
          b.provider.toLowerCase().includes(searchTerm)
        );
        if (bill) {
          const spokenDate = formatDateForSpeech(bill.dueDate);
          speak(`${bill.provider} is due on the ${spokenDate}. The amount is $${Number(bill.amount).toFixed(2)}. Status: ${bill.status}.`);
          return;
        }
        
        speak(`Sorry, I couldn't find ${searchTerm} in your subscriptions or bills.`);
        return;
      }
    }
    
    // Check for grocery add commands
    const groceryPatterns = [
      /add (.+) to (?:the )?grocer(?:y|ies)(?: list)?/i,
      /add (.+) to (?:the )?shopping(?: list)?/i,
      /(?:put|get) (.+) (?:on|to) (?:the )?(?:grocery|shopping)(?: list)?/i,
      /(?:i need|we need|buy) (.+)/i,
      /add (.+)/i,
    ];
    
    for (const pattern of groceryPatterns) {
      const match = lowerText.match(pattern);
      if (match && match[1]) {
        const itemsText = match[1].trim();
        const items = itemsText
          .split(/,|\band\b/)
          .map(item => item.trim())
          .filter(item => item.length > 0);
        
        items.forEach(item => {
          createGroceryMutation.mutate({ name: item });
        });
        
        if (items.length === 1) {
          speak(`Added ${items[0]} to your grocery list.`);
        } else {
          speak(`Added ${items.length} items to your grocery list.`);
        }
        return;
      }
    }
  };

  const tasksDueToday = tasks.filter(t => t.dueDate === format(new Date(), "yyyy-MM-dd")).length;
  const billsDue = bills.filter(b => b.status === "Due").length;
  const highPriorityTasks = tasks.filter(t => t.priority === "High").length;

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Overview Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="glass-card border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Tasks Due Today
              </CardTitle>
              <CheckSquare className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">{tasksDueToday}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {highPriorityTasks} High Priority
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card border-l-4 border-l-rose-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Bills Pending
              </CardTitle>
              <Receipt className="h-4 w-4 text-rose-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">{billsDue}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Total: ${bills.filter(b => b.status === "Due").reduce((acc, b) => acc + Number(b.amount), 0).toFixed(2)}
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Subs
              </CardTitle>
              <CreditCard className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">{subscriptions.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {subscriptions.length > 0 ? subscriptions[0].name : "No subscriptions"}
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card border-l-4 border-l-emerald-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                School Events
              </CardTitle>
              <School className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">{kidsEvents.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Upcoming reminders
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Payments - 2 Weeks */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Upcoming Payments (Next 2 Weeks)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingPayments.map((payment) => {
              const isBill = payment.type === 'bill';
              const item = payment.item;
              const name = isBill ? (item as Bill).provider : (item as Subscription).name;
              const amount = Number(isBill ? (item as Bill).amount : (item as Subscription).cost);
              const date = isBill ? (item as Bill).dueDate : (item as Subscription).renewalDate;
              const status = isBill ? (item as Bill).status : null;
              
              return (
                <div 
                  key={`${payment.type}-${item.id}`} 
                  className="glass-card p-4 rounded-xl flex items-center justify-between cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all"
                  onClick={() => handlePaymentClick(payment)}
                  data-testid={`payment-card-${payment.type}-${item.id}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-2 rounded-lg",
                      isBill ? "bg-rose-100 text-rose-600" : "bg-purple-100 text-purple-600"
                    )}>
                      {isBill ? <Receipt className="h-4 w-4" /> : <CreditCard className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800 dark:text-slate-200">{name}</p>
                      <p className="text-xs text-slate-500">{formatDisplayDate(date)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-800 dark:text-slate-100">${amount.toFixed(2)}</p>
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full",
                      isBill && status === "Paid" ? "bg-green-100 text-green-700" :
                      isBill && status === "Overdue" ? "bg-rose-100 text-rose-700" :
                      isBill ? "bg-amber-100 text-amber-700" : "bg-purple-100 text-purple-700"
                    )}>
                      {isBill ? status : "Subscription"}
                    </span>
                  </div>
                </div>
              );
            })}
            {upcomingPayments.length === 0 && (
              <p className="text-slate-500 col-span-full text-center py-6">No upcoming payments in the next 2 weeks</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Recent Tasks */}
          <div className="md:col-span-1 space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Today's Schedule</h3>
            <div className="space-y-3">
              {tasks.slice(0, 3).map((task) => (
                <div key={task.id} className="group flex items-center justify-between p-4 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-white/40 dark:border-white/5 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "h-3 w-3 rounded-full",
                      task.priority === "High" ? "bg-rose-500" : task.priority === "Medium" ? "bg-amber-500" : "bg-blue-500"
                    )} />
                    <div>
                      <p className={cn("font-medium text-slate-800 dark:text-slate-200", task.completed && "line-through text-slate-400")}>
                        {task.title}
                      </p>
                      <p className="text-xs text-slate-500">{task.category} • {formatDisplayDate(task.dueDate)}</p>
                    </div>
                  </div>
                </div>
              ))}
              {tasks.length === 0 && (
                <p className="text-center text-slate-500 py-8">No tasks yet. Create your first task!</p>
              )}
            </div>
          </div>

          {/* Groceries Checklist */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-emerald-500" />
                Groceries
              </h3>
              <span className="text-xs text-slate-500">{groceries.filter(g => g.checked).length}/{groceries.length} done</span>
            </div>
            <Card className="glass-card">
              <CardContent className="p-4 space-y-3">
                <form onSubmit={handleAddGrocery} className="flex gap-2">
                  <Input
                    data-testid="input-grocery"
                    value={newGroceryItem}
                    onChange={(e) => setNewGroceryItem(e.target.value)}
                    placeholder="Add item..."
                    className="flex-1 h-9"
                  />
                  <Button data-testid="button-add-grocery" type="submit" size="sm" className="h-9 px-3">
                    <Plus className="h-4 w-4" />
                  </Button>
                </form>
                <div className="space-y-2 max-h-[250px] overflow-y-auto">
                  {groceries.map((item) => (
                    <div
                      key={item.id}
                      data-testid={`grocery-item-${item.id}`}
                      className="flex items-center justify-between p-2 rounded-lg bg-white/50 dark:bg-slate-800/50 group"
                    >
                      <div className="flex items-center gap-3">
                        <button
                          data-testid={`button-toggle-grocery-${item.id}`}
                          onClick={() => updateGroceryMutation.mutate({ id: item.id, checked: !item.checked })}
                          className={cn(
                            "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
                            item.checked
                              ? "bg-emerald-500 border-emerald-500 text-white"
                              : "border-slate-300 hover:border-emerald-500 dark:border-slate-600"
                          )}
                        >
                          {item.checked && <Check className="h-3 w-3" />}
                        </button>
                        <span className={cn(
                          "text-sm text-slate-700 dark:text-slate-300",
                          item.checked && "line-through text-slate-400"
                        )}>
                          {item.name}
                        </span>
                      </div>
                      <button
                        data-testid={`button-delete-grocery-${item.id}`}
                        onClick={() => deleteGroceryMutation.mutate(item.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-rose-100 rounded dark:hover:bg-rose-900/30"
                      >
                        <X className="h-4 w-4 text-rose-500" />
                      </button>
                    </div>
                  ))}
                  {groceries.length === 0 && (
                    <p className="text-center text-slate-500 text-sm py-4">No items yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions / Voice */}
          <div className="md:col-span-1 space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Quick Add</h3>
            <Card className="glass-card h-[200px] flex flex-col items-center justify-center text-center p-6 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 group-hover:scale-110 transition-transform duration-500" />
              <VoiceInput onTranscript={handleVoiceCommand} />
              <p className="mt-4 text-sm text-muted-foreground">
                Tap to add a task or reminder via voice
              </p>
            </Card>
          </div>
        </div>

        {/* Edit Payment Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {selectedPayment?.type === 'bill' ? 'Bill Details' : 'Subscription Details'}
              </DialogTitle>
            </DialogHeader>
            {selectedPayment && (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-lg">
                      {selectedPayment.type === 'bill' 
                        ? (selectedPayment.item as Bill).provider 
                        : (selectedPayment.item as Subscription).name}
                    </span>
                    <span className="text-xl font-bold">
                      ${Number(selectedPayment.type === 'bill' 
                        ? (selectedPayment.item as Bill).amount 
                        : (selectedPayment.item as Subscription).cost).toFixed(2)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">
                    {selectedPayment.type === 'bill' ? 'Due: ' : 'Renews: '}
                    {formatDisplayDate(selectedPayment.type === 'bill' 
                      ? (selectedPayment.item as Bill).dueDate 
                      : (selectedPayment.item as Subscription).renewalDate)}
                  </p>
                </div>

                {selectedPayment.type === 'bill' && (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select 
                        value={(selectedPayment.item as Bill).status} 
                        onValueChange={handleStatusChange}
                      >
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
                    
                    {(selectedPayment.item as Bill).status !== 'Paid' && (
                      <Button 
                        onClick={handleMarkPaid} 
                        className="w-full bg-green-600 hover:bg-green-700"
                        disabled={updateBillMutation.isPending}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark as Paid
                      </Button>
                    )}
                  </div>
                )}

                {selectedPayment.type === 'subscription' && (
                  <p className="text-sm text-slate-500 text-center">
                    {(selectedPayment.item as Subscription).cycle} subscription
                  </p>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
