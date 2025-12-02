import { Switch, Route, Router } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import UrlBuilder from "@/pages/UrlBuilder";
import { useHashLocation } from "@/lib/use-hash-location";

function AppRouter() {
  return (
    <Switch>
      {/* 
        For a Chrome Extension popup, we want to be very permissive.
        We default to UrlBuilder for the root path "/" 
        AND as a fallback for any other path to prevent 404s.
      */}
      <Route path="/" component={UrlBuilder} />
      
      {/* Fallback route - acts as a catch-all */}
      <Route component={UrlBuilder} />
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
