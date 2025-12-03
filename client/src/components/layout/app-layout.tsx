import { Sidebar } from "./sidebar";
import { Header } from "./header";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex font-sans text-slate-900 dark:text-slate-100 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-400/10 blur-[120px]" />
        <div className="absolute top-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-purple-400/10 blur-[120px]" />
      </div>
      
      <Sidebar />
      
      <main className="flex-1 flex flex-col relative z-10 h-screen overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="container max-w-6xl mx-auto">
            <Header />
            <div className="px-6 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
