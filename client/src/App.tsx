import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { DevRoleSwitcher } from "@/components/dev-role-switcher";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import UserDashboard from "@/pages/user-dashboard";
import VendorDashboard from "@/pages/vendor-dashboard";
import AdminDashboard from "@/pages/admin-dashboard";

function Router() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // In development, always show content with role-based routing
  if (process.env.NODE_ENV === 'development') {
    return (
      <>
        <DevRoleSwitcher />
        <Switch>
          <Route path="/" component={user?.role === 'admin' ? AdminDashboard : user?.role === 'vendor' ? VendorDashboard : UserDashboard} />
          <Route path="/dashboard" component={UserDashboard} />
          <Route path="/vendor" component={VendorDashboard} />
          <Route path="/admin" component={AdminDashboard} />
          <Route path="/home" component={Home} />
          <Route component={NotFound} />
        </Switch>
      </>
    );
  }

  return (
    <Switch>
      {!user ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/dashboard" component={UserDashboard} />
          <Route path="/vendor" component={VendorDashboard} />
          <Route path="/admin" component={AdminDashboard} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="dark min-h-screen bg-background text-foreground">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
