import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import UrlBuilder from "@/pages/UrlBuilder";

function Router() {
  return (
    <Switch>
      {/* handle / and /index.html explicitly */}
      <Route path="/" component={UrlBuilder} />
      <Route path="/index.html" component={UrlBuilder} />
      {/* catch-all: any other path -> UrlBuilder */}
      <Route component={UrlBuilder} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
