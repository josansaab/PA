import { AppLayout } from "@/components/layout/app-layout";
import { PenLine } from "lucide-react";

export default function Notes() {
  return (
    <AppLayout>
      <div className="h-[calc(100vh-140px)] flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-display font-bold text-slate-800 dark:text-slate-100">Notes</h1>
          <div className="text-sm text-slate-500">
            Auto-saved
          </div>
        </div>

        <div className="flex-1 glass-card rounded-2xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 text-slate-400">
             <PenLine className="h-4 w-4" />
             <span className="text-sm">Rich Text Editor</span>
          </div>
          <textarea 
            className="flex-1 w-full h-full bg-transparent p-6 resize-none focus:outline-none text-slate-700 dark:text-slate-300 leading-relaxed"
            placeholder="Start typing your thoughts..."
            defaultValue="Ideas for the new project:
- Use glassmorphism
- Focus on typography
- Add voice input

Groceries:
- Milk
- Eggs
- Bread"
          />
        </div>
      </div>
    </AppLayout>
  );
}
