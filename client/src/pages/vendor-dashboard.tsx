import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import Header from "@/components/layout/header";
import OrderCard from "@/components/vendor/order-card";
import MenuItem from "@/components/vendor/menu-item";
import StatsCard from "@/components/admin/stats-card";
import LoadingSpinner from "@/components/common/loading-spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function VendorDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");

  const { data: vendorStats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/vendor-stats"],
    retry: false,
  });

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ["/api/orders"],
    retry: false,
  });

  const { data: menuItems, isLoading: menuLoading } = useQuery({
    queryKey: ["/api/vendors", user?.id, "menu"],
    enabled: !!user,
    retry: false,
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      await apiRequest("PATCH", `/api/orders/${orderId}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({
        title: "Success",
        description: "Order status updated successfully",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    },
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [user, authLoading, toast]);

  if (authLoading || statsLoading) {
    return <LoadingSpinner />;
  }

  // Skip role check in development - allow access to all dashboards

  const activeOrders = Array.isArray(orders) ? orders.filter((order: any) => 
    ['pending', 'confirmed', 'preparing', 'ready'].includes(order.status)
  ) : [];

  const recentOrders = Array.isArray(orders) ? orders.slice(0, 10) : [];

  const sidebarItems = [
    { id: "dashboard", icon: "fas fa-chart-line", label: "Dashboard" },
    { id: "orders", icon: "fas fa-receipt", label: "Orders" },
    { id: "menu", icon: "fas fa-utensils", label: "Menu" },
    { id: "reviews", icon: "fas fa-star", label: "Reviews" },
    { id: "analytics", icon: "fas fa-chart-bar", label: "Analytics" },
    { id: "settings", icon: "fas fa-cog", label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-card border-r border-border min-h-screen">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <i className="fas fa-store text-primary-foreground"></i>
              </div>
              <div>
                <h3 className="font-bold" data-testid="text-vendor-name">
                  {user?.firstName ? `${user.firstName}'s Restaurant` : 'Your Restaurant'}
                </h3>
                <p className="text-muted-foreground text-sm">Vendor Dashboard</p>
              </div>
            </div>
            
            <nav className="space-y-2">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-left ${
                    activeTab === item.id
                      ? "bg-primary/20 text-primary"
                      : "hover:bg-accent"
                  }`}
                  data-testid={`nav-${item.id}`}
                >
                  <i className={item.icon}></i>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {activeTab === "dashboard" && (
            <>
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <StatsCard
                  title="Today's Orders"
                  value={(vendorStats as any)?.todayOrders || 0}
                  icon="fas fa-receipt"
                  trend="+12%"
                  trendDirection="up"
                />
                <StatsCard
                  title="Revenue"
                  value={`₹${(vendorStats as any)?.todayRevenue || 0}`}
                  icon="fas fa-rupee-sign"
                  trend="+8%"
                  trendDirection="up"
                  iconColor="text-green-400"
                />
                <StatsCard
                  title="Avg Rating"
                  value={(vendorStats as any)?.avgRating || "0.0"}
                  icon="fas fa-star"
                  subtitle="Based on reviews"
                  iconColor="text-yellow-400"
                />
                <StatsCard
                  title="Pending Orders"
                  value={(vendorStats as any)?.pendingOrders || 0}
                  icon="fas fa-clock"
                  subtitle="Needs attention"
                  iconColor="text-yellow-400"
                />
              </div>

              {/* Active Orders */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <h4 className="text-lg font-bold mb-4">Active Orders</h4>
                    <div className="space-y-4">
                      {activeOrders.length > 0 ? (
                        activeOrders.map((order: any) => (
                          <OrderCard
                            key={order.id}
                            order={order}
                            onUpdateStatus={(orderId, status) =>
                              updateOrderStatusMutation.mutate({ orderId, status })
                            }
                          />
                        ))
                      ) : (
                        <p className="text-muted-foreground text-center py-4">
                          No active orders at the moment
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-bold">Menu Quick Actions</h4>
                      <Button size="sm" data-testid="button-add-menu-item">
                        <i className="fas fa-plus mr-2"></i>Add Item
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      {Array.isArray(menuItems) ? menuItems.slice(0, 5).map((item: any) => (
                        <MenuItem key={item.id} item={item} />
                      )) : (
                        <p className="text-muted-foreground text-center py-4">
                          No menu items found
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {activeTab === "orders" && (
            <Card>
              <CardContent className="p-6">
                <h4 className="text-lg font-bold mb-4">All Orders</h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 text-sm font-medium text-muted-foreground">Order ID</th>
                        <th className="text-left py-3 text-sm font-medium text-muted-foreground">Customer</th>
                        <th className="text-left py-3 text-sm font-medium text-muted-foreground">Total</th>
                        <th className="text-left py-3 text-sm font-medium text-muted-foreground">Status</th>
                        <th className="text-left py-3 text-sm font-medium text-muted-foreground">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order: any) => (
                        <tr key={order.id} className="border-b border-border">
                          <td className="py-3 text-sm font-medium" data-testid={`text-order-id-${order.id}`}>
                            #{order.id.slice(-8).toUpperCase()}
                          </td>
                          <td className="py-3 text-sm">Customer</td>
                          <td className="py-3 text-sm font-medium">
                            ₹{parseFloat(order.totalAmount).toFixed(2)}
                          </td>
                          <td className="py-3">
                            <span className={`status-${order.status} bg-yellow-500/20 px-2 py-1 rounded-full text-xs font-medium`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </td>
                          <td className="py-3 text-sm text-muted-foreground">
                            {new Date(order.createdAt).toLocaleTimeString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "menu" && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-lg font-bold">Menu Management</h4>
                  <Button data-testid="button-add-menu-item-full">
                    <i className="fas fa-plus mr-2"></i>Add Item
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {Array.isArray(menuItems) ? menuItems.map((item: any) => (
                    <MenuItem key={item.id} item={item} showFullControls />
                  )) : (
                    <p className="text-muted-foreground text-center py-8">
                      No menu items found. Add your first item to get started.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Other tabs content can be added here */}
        </div>
      </div>
    </div>
  );
}
