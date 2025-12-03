import { AppLayout } from "@/components/layout/app-layout";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Download, Palette } from "lucide-react";
import { useTheme } from "next-themes";

export default function Settings() {
  const { theme, setTheme } = useTheme();

  return (
    <AppLayout>
      <div className="space-y-8 max-w-2xl">
        <h1 className="text-3xl font-display font-bold text-slate-800 dark:text-slate-100">Settings</h1>

        <div className="glass-card p-6 rounded-2xl space-y-8">
          {/* Theme */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-medium text-slate-900 dark:text-white flex items-center gap-2">
                <Palette className="h-4 w-4" /> Appearance
              </h3>
              <p className="text-sm text-slate-500">
                Customize how the dashboard looks
              </p>
            </div>
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-full">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme("light")}
                className={theme === "light" ? "bg-white shadow-sm" : ""}
              >
                <Sun className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme("dark")}
                className={theme === "dark" ? "bg-slate-700 shadow-sm text-white" : ""}
              >
                <Moon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="h-px bg-slate-100 dark:bg-slate-800" />

          {/* Data */}
          <div className="flex items-center justify-between">
             <div className="space-y-1">
              <h3 className="font-medium text-slate-900 dark:text-white flex items-center gap-2">
                <Download className="h-4 w-4" /> Data Export
              </h3>
              <p className="text-sm text-slate-500">
                Download all your data as JSON
              </p>
            </div>
            <Button variant="outline">
               Export Data
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
