import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import NotFound from "@/pages/not-found";

import Dashboard from "@/pages/dashboard";
import Tasks from "@/pages/tasks";
import Bills from "@/pages/bills";
import Subscriptions from "@/pages/subscriptions";
import CarMaintenance from "@/pages/car";
import Notes from "@/pages/notes";
import Settings from "@/pages/settings";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/tasks" component={Tasks} />
      <Route path="/bills" component={Bills} />
      <Route path="/subscriptions" component={Subscriptions} />
      <Route path="/car" component={CarMaintenance} />
      <Route path="/notes" component={Notes} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
