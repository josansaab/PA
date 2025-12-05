import { AppLayout } from "@/components/layout/app-layout";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Download, Palette, Camera, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { useTheme } from "next-themes";
import { useQuery } from "@tanstack/react-query";
import { getUnifiStatus } from "@/lib/api";
import { QRCodeSVG } from "qrcode.react";

export default function Settings() {
  const { theme, setTheme } = useTheme();

  const { data: unifiStatus, refetch: refetchUnifi, isLoading: isLoadingUnifi } = useQuery({
    queryKey: ["unifi-status"],
    queryFn: getUnifiStatus,
    staleTime: 30000,
  });

  const unifiLoginUrl = unifiStatus?.host ? `https://${unifiStatus.host}` : null;

  return (
    <AppLayout>
      <div className="space-y-8 max-w-2xl">
        <h1 className="text-3xl font-display font-bold text-slate-800 dark:text-slate-100">Settings</h1>

        {/* Unifi Protect */}
        <div className="glass-card p-6 rounded-2xl space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-medium text-slate-900 dark:text-white flex items-center gap-2">
                <Camera className="h-4 w-4 text-cyan-500" /> Unifi Protect
              </h3>
              <p className="text-sm text-slate-500">
                Security camera integration
              </p>
            </div>
            <div className="flex items-center gap-2">
              {isLoadingUnifi ? (
                <RefreshCw className="h-4 w-4 animate-spin text-slate-400" />
              ) : unifiStatus?.connected ? (
                <span className="flex items-center gap-1 text-sm text-emerald-600">
                  <CheckCircle className="h-4 w-4" /> Connected
                </span>
              ) : unifiStatus?.configured ? (
                <span className="flex items-center gap-1 text-sm text-amber-600">
                  <XCircle className="h-4 w-4" /> Disconnected
                </span>
              ) : (
                <span className="flex items-center gap-1 text-sm text-slate-500">
                  Not configured
                </span>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => refetchUnifi()}
                className="h-8 w-8 p-0"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {unifiStatus?.configured && unifiLoginUrl && (
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <QRCodeSVG 
                  value={unifiLoginUrl} 
                  size={180}
                  level="M"
                  includeMargin={false}
                />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Scan to access Unifi Protect
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {unifiLoginUrl}
                </p>
              </div>
            </div>
          )}

          {!unifiStatus?.configured && (
            <div className="text-center py-4 text-slate-500 text-sm">
              <p>Add your Unifi Protect credentials as secrets:</p>
              <code className="block mt-2 text-xs bg-slate-100 dark:bg-slate-800 p-2 rounded">
                UNIFI_PROTECT_HOST, UNIFI_PROTECT_USERNAME, UNIFI_PROTECT_PASSWORD
              </code>
            </div>
          )}
        </div>

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
