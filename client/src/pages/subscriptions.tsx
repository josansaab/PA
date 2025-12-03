import { AppLayout } from "@/components/layout/app-layout";
import { Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getSubscriptions } from "@/lib/api";

export default function Subscriptions() {
  const { data: subscriptions = [] } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: getSubscriptions,
  });

  return (
    <AppLayout>
      <div className="space-y-8">
        <h1 className="text-3xl font-display font-bold text-slate-800 dark:text-slate-100">Subscriptions</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {subscriptions.map((sub) => (
            <div
              key={sub.id}
              className="glass-card p-6 rounded-3xl flex flex-col items-center text-center space-y-4 relative group"
            >
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
