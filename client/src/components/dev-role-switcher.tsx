import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DevRoleSwitcher() {
  const { user, switchRole, isSwitching } = useAuth();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const roles = [
    { id: 'admin-001', label: 'Admin Dashboard', role: 'admin' },
    { id: 'vendor-001', label: 'Vendor Dashboard', role: 'vendor' },
    { id: 'user-001', label: 'User Dashboard', role: 'user' },
  ];

  return (
    <Card className="fixed top-4 right-4 z-50 w-64">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Development Mode</CardTitle>
        <p className="text-xs text-muted-foreground">
          Current: {user?.firstName} {user?.lastName} ({user?.role})
        </p>
      </CardHeader>
      <CardContent className="space-y-2">
        {roles.map(({ id, label, role }) => (
          <Button
            key={id}
            variant={user?.id === id ? "default" : "outline"}
            size="sm"
            className="w-full justify-start"
            onClick={() => switchRole(id)}
            disabled={isSwitching}
            data-testid={`button-switch-${role}`}
          >
            {label}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}