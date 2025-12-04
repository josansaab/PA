import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckSquare, Receipt, CreditCard, School, ShoppingCart, Plus, X, Check } from "lucide-react";
import { VoiceInput } from "@/components/voice-input";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { formatDisplayDate } from "@/lib/date-utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTasks, getBills, getSubscriptions, getUpcomingPayments, getKidsEvents, getGroceries, createGrocery, updateGrocery, deleteGrocery, type UpcomingPayment } from "@/lib/api";
import type { Bill, Subscription } from "@shared/schema";
import { useState } from "react";

export default function Dashboard() {
  const queryClient = useQueryClient();
  const [newGroceryItem, setNewGroceryItem] = useState("");

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

  const handleAddGrocery = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGroceryItem.trim()) {
      createGroceryMutation.mutate({ name: newGroceryItem.trim() });
    }
  };

  const handleVoiceCommand = (text: string) => {
    const lowerText = text.toLowerCase().trim();
    
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
              
              return (
                <div key={`${payment.type}-${item.id}`} className="glass-card p-4 rounded-xl flex items-center justify-between">
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
                      isBill ? "bg-rose-100 text-rose-700" : "bg-purple-100 text-purple-700"
                    )}>
                      {isBill ? "Bill" : "Subscription"}
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
      </div>
    </AppLayout>
  );
}
