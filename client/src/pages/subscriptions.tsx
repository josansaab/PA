import { AppLayout } from "@/components/layout/app-layout";
import { MOCK_SUBSCRIPTIONS } from "@/lib/mock-data";
import { CreditCard, Calendar } from "lucide-react";

export default function Subscriptions() {
  return (
    <AppLayout>
      <div className="space-y-8">
        <h1 className="text-3xl font-display font-bold text-slate-800 dark:text-slate-100">Subscriptions</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_SUBSCRIPTIONS.map((sub) => (
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
                ${sub.cost}
              </div>

              <div className="w-full pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Renewal
                </span>
                <span className="font-medium text-slate-700 dark:text-slate-300">{sub.renewalDate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
