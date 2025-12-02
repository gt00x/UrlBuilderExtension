import { Switch, Route, Router } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import UrlBuilder from "@/pages/UrlBuilder";
import NotFound from "@/pages/not-found";
import { useHashLocation } from "@/lib/use-hash-location";

function AppRouter() {
  return (
    <Switch>
      {/* 
        Chrome Extensions load index.html. 
        Hash routing treats empty hash as "/" which matches this.
      */}
      <Route path="/" component={UrlBuilder} />
      <Route path="/index.html" component={UrlBuilder} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        {/* Use Hash Routing for Chrome Extension compatibility */}
        <Router hook={useHashLocation}>
          <AppRouter />
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
