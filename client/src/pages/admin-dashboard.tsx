import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/header";
import StatsCard from "@/components/admin/stats-card";
import VendorTable from "@/components/admin/vendor-table";
import LoadingSpinner from "@/components/common/loading-spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  const { data: adminStats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/admin-stats"],
    retry: false,
  });

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ["/api/orders"],
    retry: false,
  });

  const { data: topVendors, isLoading: vendorsLoading } = useQuery({
    queryKey: ["/api/top-vendors"],
    retry: false,
  });

  const { data: allVendors } = useQuery({
    queryKey: ["/api/vendors"],
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

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-destructive">Access denied. Admin role required.</p>
      </div>
    );
  }

  const liveOrders = orders?.filter((order: any) => 
    ['pending', 'confirmed', 'preparing', 'ready'].includes(order.status)
  )?.slice(0, 5) || [];

  const sidebarItems = [
    { id: "overview", icon: "fas fa-chart-line", label: "Overview" },
    { id: "vendors", icon: "fas fa-store", label: "Vendors" },
    { id: "users", icon: "fas fa-users", label: "Users" },
    { id: "orders", icon: "fas fa-receipt", label: "All Orders" },
    { id: "analytics", icon: "fas fa-chart-bar", label: "Analytics" },
    { id: "payments", icon: "fas fa-credit-card", label: "Payments" },
    { id: "settings", icon: "fas fa-cog", label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        {/* Admin Sidebar */}
        <div className="w-64 bg-card border-r border-border min-h-screen">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <i className="fas fa-shield-alt text-primary-foreground"></i>
              </div>
              <div>
                <h3 className="font-bold">Admin Panel</h3>
                <p className="text-muted-foreground text-sm">System Overview</p>
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

        {/* Admin Main Content */}
        <div className="flex-1 p-6">
          {activeTab === "overview" && (
            <>
              {/* Platform Overview Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <StatsCard
                  title="Total Orders Today"
                  value={adminStats?.todayOrders || 0}
                  icon="fas fa-shopping-cart"
                  trend="+23%"
                  trendDirection="up"
                />
                <StatsCard
                  title="Platform Revenue"
                  value={`₹${adminStats?.todayRevenue || 0}`}
                  icon="fas fa-rupee-sign"
                  trend="+18%"
                  trendDirection="up"
                  iconColor="text-green-400"
                />
                <StatsCard
                  title="Active Vendors"
                  value={adminStats?.activeVendors || 0}
                  icon="fas fa-store"
                  subtitle="2 pending approval"
                  iconColor="text-blue-400"
                />
                <StatsCard
                  title="Active Users"
                  value={adminStats?.totalUsers || 0}
                  icon="fas fa-users"
                  subtitle="89 new this week"
                  iconColor="text-purple-400"
                />
              </div>

              {/* Real-time Order Monitoring */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-bold">Live Order Tracking</h4>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse-slow"></div>
                          <span>Live Updates</span>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        {liveOrders.length > 0 ? (
                          liveOrders.map((order: any) => (
                            <div key={order.id} className="border border-border rounded-lg p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                                    <i className="fas fa-receipt text-primary text-sm"></i>
                                  </div>
                                  <div>
                                    <h5 className="font-medium" data-testid={`text-live-order-${order.id}`}>
                                      Order #{order.id.slice(-8).toUpperCase()}
                                    </h5>
                                    <p className="text-muted-foreground text-sm">
                                      Vendor → Customer
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <span className={`status-${order.status} font-medium`}>
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                  </span>
                                  <p className="text-muted-foreground text-sm">
                                    {new Date(order.createdAt).toLocaleTimeString()}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm">Order details</span>
                                <span className="font-bold">₹{parseFloat(order.totalAmount).toFixed(2)}</span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-muted-foreground text-center py-8">
                            No active orders at the moment
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Top Performing Vendors */}
                <Card>
                  <CardContent className="p-6">
                    <h4 className="text-lg font-bold mb-4">Top Vendors Today</h4>
                    <div className="space-y-4">
                      {topVendors?.map((vendor: any, index: number) => (
                        <div key={vendor.id} className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                            <span className="text-primary font-bold text-sm">{index + 1}</span>
                          </div>
                          <div className="flex-1">
                            <h5 className="font-medium" data-testid={`text-top-vendor-${index}`}>
                              {vendor.name}
                            </h5>
                            <p className="text-muted-foreground text-sm">
                              {vendor.orders || 0} orders
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-sm">
                              ₹{parseFloat(vendor.revenue || 0).toFixed(0)}
                            </p>
                            <p className="text-green-400 text-xs">+12%</p>
                          </div>
                        </div>
                      )) || (
                        <p className="text-muted-foreground text-center py-4">
                          No vendor data available
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Campus Activity Map Placeholder */}
              <Card className="mb-8">
                <CardContent className="p-6">
                  <h4 className="text-lg font-bold mb-4">Campus Delivery Activity</h4>
                  <div className="bg-muted/20 rounded-lg h-64 flex items-center justify-center border border-border">
                    <div className="text-center">
                      <i className="fas fa-map-marker-alt text-4xl text-primary mb-2"></i>
                      <p className="text-muted-foreground">Live Delivery Map</p>
                      <p className="text-xs text-muted-foreground">Shows active deliveries across campus</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {activeTab === "vendors" && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold">Vendor Management</h4>
                  <Button data-testid="button-add-vendor">
                    <i className="fas fa-plus mr-2"></i>Add Vendor
                  </Button>
                </div>
                
                <VendorTable vendors={allVendors || []} />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
