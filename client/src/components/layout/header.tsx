import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const { user } = useAuth();

  const handleLogout = () => {
    window.location.href = '/api/logout';
  };

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 glass-effect">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <i className="fas fa-utensils text-primary-foreground text-sm"></i>
              </div>
              <h1 className="text-xl font-bold">BITS Eats</h1>
            </div>
            <span className="text-xs bg-secondary px-2 py-1 rounded-full text-secondary-foreground">
              Campus Only
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2" data-testid="button-user-menu">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.profileImageUrl || undefined} />
                      <AvatarFallback>
                        {user.firstName?.[0] || user.email?.[0] || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium" data-testid="text-user-name">
                      {user.firstName || user.email}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem data-testid="menu-profile">
                    <i className="fas fa-user mr-2"></i>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem data-testid="menu-settings">
                    <i className="fas fa-cog mr-2"></i>
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} data-testid="menu-logout">
                    <i className="fas fa-sign-out-alt mr-2"></i>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
