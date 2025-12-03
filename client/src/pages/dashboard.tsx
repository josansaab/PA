import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckSquare, Receipt, CreditCard, Car, ArrowUpRight, TrendingUp } from "lucide-react";
import { VoiceInput } from "@/components/voice-input";
import { MOCK_TASKS, MOCK_BILLS, MOCK_SUBSCRIPTIONS } from "@/lib/mock-data";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const tasksDueToday = MOCK_TASKS.filter(t => t.dueDate === format(new Date(), "yyyy-MM-dd")).length;
  const billsDue = MOCK_BILLS.filter(b => b.status === "Due").length;
  const upcomingSubs = MOCK_SUBSCRIPTIONS.length; // Simplified

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
                {MOCK_TASKS.filter(t => t.priority === "High").length} High Priority
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
                Total: ${MOCK_BILLS.reduce((acc, b) => b.status === "Due" ? acc + b.amount : acc, 0).toFixed(2)}
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
              <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">{upcomingSubs}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Next: Netflix (In 5 days)
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card border-l-4 border-l-emerald-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Car Health
              </CardTitle>
              <Car className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">Good</div>
              <p className="text-xs text-muted-foreground mt-1">
                Service in 30 days
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Recent Tasks */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Today's Schedule</h3>
            <div className="space-y-3">
              {MOCK_TASKS.slice(0, 3).map((task) => (
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
                      <p className="text-xs text-slate-500">{task.category} • {task.dueDate}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    Edit
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions / Voice */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Quick Add</h3>
            <Card className="glass-card h-[200px] flex flex-col items-center justify-center text-center p-6 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 group-hover:scale-110 transition-transform duration-500" />
              <VoiceInput onTranscript={(text) => console.log("Transcript:", text)} />
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
