import { AppLayout } from "@/components/layout/app-layout";
import { MOCK_CAR_SERVICES } from "@/lib/mock-data";
import { Car, Gavel, FileText, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CarMaintenance() {
  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <h1 className="text-3xl font-display font-bold text-slate-800 dark:text-slate-100">My Vehicle</h1>
          <div className="flex gap-3">
             <Button variant="outline" className="rounded-full">
                Upload Docs
             </Button>
             <Button className="rounded-full bg-primary">
                Add Service Log
             </Button>
          </div>
        </div>

        {/* Car Hero Card */}
        <div className="glass-card p-8 rounded-3xl relative overflow-hidden">
          <div className="absolute -right-20 -top-20 h-64 w-64 bg-blue-500/10 rounded-full blur-3xl" />
          
          <div className="flex flex-col md:flex-row gap-8 relative z-10">
            <div className="h-32 w-32 rounded-2xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
              <Car className="h-12 w-12 text-slate-400" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Tesla Model 3</h2>
              <p className="text-slate-500">License: ABC-123 • VIN: 5YJ3...</p>
              <div className="flex items-center gap-4 mt-4">
                 <div className="px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium">
                    Registration Active
                 </div>
                 <div className="px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                    Insurance Valid
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Service Timeline */}
        <div className="space-y-4">
           <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Service History</h3>
           <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 space-y-8 pb-4">
              {MOCK_CAR_SERVICES.map((service) => (
                <div key={service.id} className="relative pl-8">
                   <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-white border-4 border-blue-500" />
                   <div className="glass-card p-5 rounded-xl">
                      <div className="flex justify-between items-start">
                         <div className="flex items-center gap-3">
                            <Wrench className="h-5 w-5 text-slate-400" />
                            <span className="font-semibold text-slate-800 dark:text-slate-100">{service.type}</span>
                         </div>
                         <span className="text-sm text-slate-500">{service.date}</span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{service.notes}</p>
                      {service.km && (
                        <p className="text-xs text-slate-400 mt-1">Odometer: {service.km.toLocaleString()} km</p>
                      )}
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </AppLayout>
  );
}
