import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect } from "react";
import Header from "@/components/layout/header";

export default function Home() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && user) {
      // Redirect based on user role
      switch (user.role) {
        case 'vendor':
          setLocation('/vendor');
          break;
        case 'admin':
          setLocation('/admin');
          break;
        default:
          setLocation('/dashboard');
          break;
      }
    }
  }, [user, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Welcome to BITS Eats!</h1>
          <p className="text-muted-foreground">Redirecting to your dashboard...</p>
        </div>
      </div>
    </div>
  );
}
