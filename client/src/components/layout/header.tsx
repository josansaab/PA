import { format } from "date-fns";
import { Bell, Search, CloudSun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  const today = new Date();

  return (
    <header className="flex items-center justify-between py-6 px-8 mb-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-display font-semibold text-slate-800 dark:text-white">
          Good Morning, Alex
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
          {format(today, "EEEE, MMMM do, yyyy")}
        </p>
      </div>

      <div className="flex items-center gap-4">
        {/* Weather Widget Placeholder */}
        <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-full bg-white/50 dark:bg-slate-800/50 border border-white/20 dark:border-white/5 shadow-sm backdrop-blur-sm">
          <CloudSun className="h-5 w-5 text-amber-500" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
            22°C Sunny
          </span>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 transition-all duration-200"
        >
          <Search className="h-5 w-5 text-slate-600 dark:text-slate-400" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 transition-all duration-200 relative"
        >
          <Bell className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border-2 border-white dark:border-slate-800" />
        </Button>
      </div>
    </header>
  );
}
