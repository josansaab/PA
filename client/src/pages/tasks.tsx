import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MOCK_TASKS, Task } from "@/lib/mock-data";
import { Plus, Filter, Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [filter, setFilter] = useState("All");

  const categories = ["All", "Work", "Home", "Business", "Bills", "Car"];

  const filteredTasks = filter === "All" 
    ? tasks 
    : tasks.filter(t => t.category === filter);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-3xl font-display font-bold text-slate-800 dark:text-slate-100">Tasks</h1>
          <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
            <Plus className="mr-2 h-4 w-4" /> New Task
          </Button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                filter === cat
                  ? "bg-slate-800 text-white shadow-md dark:bg-white dark:text-slate-900"
                  : "bg-white/50 text-slate-600 hover:bg-white hover:text-slate-900 dark:bg-slate-800/50 dark:text-slate-400 dark:hover:bg-slate-800"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Task List */}
        <div className="grid gap-4">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="group flex items-center gap-4 p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-white/40 dark:border-white/5 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex-shrink-0">
                <div className={cn(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer transition-colors",
                  task.completed 
                    ? "bg-green-500 border-green-500" 
                    : "border-slate-300 hover:border-green-500 dark:border-slate-600"
                )}>
                  {task.completed && <div className="w-3 h-3 bg-white rounded-full" />}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className={cn(
                  "text-base font-medium text-slate-800 dark:text-slate-200 truncate",
                  task.completed && "line-through text-slate-400"
                )}>
                  {task.title}
                </h4>
                <div className="flex items-center gap-3 mt-1">
                  <Badge variant="secondary" className="text-xs font-normal bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                    {task.category}
                  </Badge>
                  <span className="flex items-center text-xs text-slate-400">
                    <CalendarIcon className="mr-1 h-3 w-3" />
                    {task.dueDate}
                  </span>
                </div>
              </div>

              <div className={cn(
                "h-2 w-2 rounded-full",
                task.priority === "High" ? "bg-rose-500" : task.priority === "Medium" ? "bg-amber-500" : "bg-blue-400"
              )} />
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
