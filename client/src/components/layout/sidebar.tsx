import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  CheckSquare,
  Receipt,
  CreditCard,
  Car,
  School,
  StickyNote,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { label: "Tasks", icon: CheckSquare, href: "/tasks" },
  { label: "Bills", icon: Receipt, href: "/bills" },
  { label: "Subscriptions", icon: CreditCard, href: "/subscriptions" },
  { label: "Car", icon: Car, href: "/car" },
  { label: "Kids Events", icon: School, href: "/kids-events" },
  { label: "Notes", icon: StickyNote, href: "/notes" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

export function Sidebar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white/80 backdrop-blur-md border-white/20 shadow-sm"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-white/70 backdrop-blur-xl border-r border-white/20 shadow-xl transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen lg:shadow-none dark:bg-slate-900/70 dark:border-white/5",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="h-8 w-8 rounded-lg bg-primary gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">
              S
            </div>
            <h1 className="text-xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300">
              SmartDash
            </h1>
          </div>

          <nav className="flex-1 space-y-2">
            {NAV_ITEMS.map((item) => {
              const isActive = location === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group cursor-pointer",
                      isActive
                        ? "bg-white shadow-md text-primary font-medium dark:bg-slate-800 dark:text-white"
                        : "text-slate-500 hover:bg-white/50 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-5 w-5 transition-colors",
                        isActive
                          ? "text-primary dark:text-blue-400"
                          : "text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300"
                      )}
                    />
                    <span>{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-6 border-t border-slate-200/50 dark:border-white/5">
            <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-slate-100/50 dark:bg-slate-800/50">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400" />
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium truncate">User Name</p>
                <p className="text-xs text-slate-500 truncate">Pro Plan</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
