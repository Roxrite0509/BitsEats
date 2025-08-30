import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const users = [
  {
    id: "admin-001",
    name: "Admin User",
    email: "admin@bitsgoa.ac.in",
    role: "admin",
    password: "admin123",
    dashboard: "/Admin"
  },
  {
    id: "vendor-001", 
    name: "Raj Cafe",
    email: "vendor@bitsgoa.ac.in",
    role: "vendor",
    password: "vendor123",
    dashboard: "/VendorDashboard"
  },
  {
    id: "user-001",
    name: "Alex Student", 
    email: "student@bitsgoa.ac.in",
    role: "user",
    password: "user123",
    dashboard: "/UserDashboard"
  }
];

export default function Login() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (user: typeof users[0]) => {
    setIsLoading(true);
    
    try {
      // Set the role in session
      const response = await fetch('/api/dev/switch-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });
      
      if (response.ok) {
        setLocation(user.dashboard);
      }
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">BITS Eats</h1>
          <p className="text-muted-foreground mt-2">Development Login</p>
        </div>
        
        <div className="space-y-4">
          {users.map((user) => (
            <Card key={user.id} className="cursor-pointer hover:bg-accent/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{user.name}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-xs text-muted-foreground mt-1">Password: {user.password}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant={user.role === 'admin' ? 'destructive' : user.role === 'vendor' ? 'default' : 'secondary'}>
                      {user.role}
                    </Badge>
                    <Button 
                      size="sm" 
                      onClick={() => handleLogin(user)}
                      disabled={isLoading}
                      data-testid={`button-login-${user.role}`}
                    >
                      Login as {user.role}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Card className="bg-muted/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Test Credentials</CardTitle>
          </CardHeader>
          <CardContent className="text-xs space-y-1">
            <p><strong>Admin:</strong> admin@bitsgoa.ac.in / admin123</p>
            <p><strong>Vendor:</strong> vendor@bitsgoa.ac.in / vendor123</p>
            <p><strong>User:</strong> student@bitsgoa.ac.in / user123</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}