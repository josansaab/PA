import { AppLayout } from "@/components/layout/app-layout";
import { cn } from "@/lib/utils";
import { Receipt } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { getBills } from "@/lib/api";

export default function Bills() {
  const { data: bills = [] } = useQuery({
    queryKey: ["bills"],
    queryFn: getBills,
  });

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-display font-bold text-slate-800 dark:text-slate-100">Bills & Utilities</h1>
        </div>

        <div className="grid gap-6">
          {bills.map((bill) => (
            <div
              key={bill.id}
              className="relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-white/40 dark:border-white/5 shadow-sm hover:shadow-md transition-all"
            >
              {/* Status Color Strip */}
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
                  <p className="text-sm text-slate-500">Due: {bill.dueDate}</p>
                </div>
              </div>

              <div className="mt-4 sm:mt-0 pl-4 flex items-center gap-6">
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
