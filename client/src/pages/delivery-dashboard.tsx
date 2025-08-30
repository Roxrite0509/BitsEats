import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import Header from "@/components/layout/header";
import LoadingSpinner from "@/components/common/loading-spinner";
import StatsCard from "@/components/admin/stats-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DeliveryDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");

  const { data: availableOrders, isLoading: ordersLoading } = useQuery({
    queryKey: ["/api/delivery/available-orders"],
    retry: false,
  });

  const { data: myDeliveries } = useQuery({
    queryKey: ["/api/delivery/my-deliveries"],
    retry: false,
  });

  const { data: deliveryStats } = useQuery({
    queryKey: ["/api/delivery/stats"],
    retry: false,
  });

  const acceptOrderMutation = useMutation({
    mutationFn: async (orderId: string) => {
      await apiRequest("POST", `/api/delivery/accept-order/${orderId}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/delivery/available-orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/delivery/my-deliveries"] });
      toast({
        title: "Order accepted!",
        description: "You can now start the delivery",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to accept order",
        variant: "destructive",
      });
    },
  });

  const updateDeliveryStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      await apiRequest("PATCH", `/api/delivery/update-status/${orderId}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/delivery/my-deliveries"] });
      toast({
        title: "Status updated",
        description: "Delivery status has been updated",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update status",
        variant: "destructive",
      });
    },
  });

  if (authLoading || ordersLoading) {
    return <LoadingSpinner />;
  }

  const sidebarItems = [
    { id: "dashboard", icon: "fas fa-chart-line", label: "Dashboard" },
    { id: "available", icon: "fas fa-motorcycle", label: "Available Orders" },
    { id: "my-deliveries", icon: "fas fa-box", label: "My Deliveries" },
    { id: "earnings", icon: "fas fa-rupee-sign", label: "Earnings" },
    { id: "profile", icon: "fas fa-user", label: "Profile" },
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
                <i className="fas fa-motorcycle text-primary-foreground"></i>
              </div>
              <div>
                <h3 className="font-bold" data-testid="text-delivery-name">
                  {user?.firstName ? `${user.firstName}'s Delivery` : 'Delivery Partner'}
                </h3>
                <p className="text-muted-foreground text-sm">Delivery Dashboard</p>
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
                  title="Today's Deliveries"
                  value={(deliveryStats as any)?.todayDeliveries || 0}
                  icon="fas fa-motorcycle"
                  trend="+5%"
                  trendDirection="up"
                />
                <StatsCard
                  title="Today's Earnings"
                  value={`₹${(deliveryStats as any)?.todayEarnings || 0}`}
                  icon="fas fa-rupee-sign"
                  trend="+12%"
                  trendDirection="up"
                  iconColor="text-green-400"
                />
                <StatsCard
                  title="Active Deliveries"
                  value={(deliveryStats as any)?.activeDeliveries || 0}
                  icon="fas fa-box"
                  subtitle="In progress"
                  iconColor="text-blue-400"
                />
                <StatsCard
                  title="Completion Rate"
                  value={`${(deliveryStats as any)?.completionRate || 100}%`}
                  icon="fas fa-check-circle"
                  subtitle="This week"
                  iconColor="text-green-400"
                />
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <h4 className="text-lg font-bold mb-4">Available Orders</h4>
                    <div className="space-y-4">
                      {Array.isArray(availableOrders) && availableOrders.length > 0 ? (
                        availableOrders.slice(0, 3).map((order: any) => (
                          <div key={order.id} className="border border-border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">Order #{order.id.slice(-8).toUpperCase()}</span>
                              <Badge variant="secondary">{order.status}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              Pickup: {order.vendorName} → Delivery: {order.deliveryAddress}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="font-bold">₹{parseFloat(order.totalAmount).toFixed(2)}</span>
                              <Button 
                                size="sm"
                                onClick={() => acceptOrderMutation.mutate(order.id)}
                                disabled={acceptOrderMutation.isPending}
                                data-testid={`button-accept-${order.id}`}
                              >
                                Accept
                              </Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground text-center py-4">
                          No orders available at the moment
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h4 className="text-lg font-bold mb-4">My Active Deliveries</h4>
                    <div className="space-y-4">
                      {Array.isArray(myDeliveries) && myDeliveries.length > 0 ? (
                        myDeliveries.map((delivery: any) => (
                          <div key={delivery.id} className="border border-border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">Order #{delivery.id.slice(-8).toUpperCase()}</span>
                              <Badge variant={delivery.status === 'out_for_delivery' ? 'default' : 'secondary'}>
                                {delivery.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              Delivering to: {delivery.deliveryAddress}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="font-bold">₹{parseFloat(delivery.totalAmount).toFixed(2)}</span>
                              {delivery.status === 'ready' && (
                                <Button 
                                  size="sm"
                                  onClick={() => updateDeliveryStatusMutation.mutate({
                                    orderId: delivery.id,
                                    status: 'out_for_delivery'
                                  })}
                                  data-testid={`button-pickup-${delivery.id}`}
                                >
                                  Mark Picked Up
                                </Button>
                              )}
                              {delivery.status === 'out_for_delivery' && (
                                <Button 
                                  size="sm"
                                  onClick={() => updateDeliveryStatusMutation.mutate({
                                    orderId: delivery.id,
                                    status: 'delivered'
                                  })}
                                  data-testid={`button-delivered-${delivery.id}`}
                                >
                                  Mark Delivered
                                </Button>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground text-center py-4">
                          No active deliveries
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {activeTab === "available" && (
            <Card>
              <CardContent className="p-6">
                <h4 className="text-lg font-bold mb-4">Available Orders</h4>
                <div className="grid gap-4">
                  {Array.isArray(availableOrders) ? availableOrders.map((order: any) => (
                    <div key={order.id} className="border border-border rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h5 className="font-medium text-lg">Order #{order.id.slice(-8).toUpperCase()}</h5>
                          <p className="text-muted-foreground">From: {order.vendorName}</p>
                        </div>
                        <Badge variant="outline">{order.status}</Badge>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <p className="text-sm"><strong>Delivery Address:</strong> {order.deliveryAddress}</p>
                        <p className="text-sm"><strong>Order Total:</strong> ₹{parseFloat(order.totalAmount).toFixed(2)}</p>
                        <p className="text-sm"><strong>Estimated Time:</strong> 15-30 mins</p>
                      </div>
                      
                      <Button 
                        onClick={() => acceptOrderMutation.mutate(order.id)}
                        disabled={acceptOrderMutation.isPending}
                        className="w-full"
                        data-testid={`button-accept-full-${order.id}`}
                      >
                        Accept Delivery
                      </Button>
                    </div>
                  )) : (
                    <p className="text-muted-foreground text-center py-8">
                      No orders available for delivery
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "my-deliveries" && (
            <Card>
              <CardContent className="p-6">
                <h4 className="text-lg font-bold mb-4">My Deliveries</h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 text-sm font-medium text-muted-foreground">Order ID</th>
                        <th className="text-left py-3 text-sm font-medium text-muted-foreground">Restaurant</th>
                        <th className="text-left py-3 text-sm font-medium text-muted-foreground">Amount</th>
                        <th className="text-left py-3 text-sm font-medium text-muted-foreground">Status</th>
                        <th className="text-left py-3 text-sm font-medium text-muted-foreground">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(myDeliveries) ? myDeliveries.map((delivery: any) => (
                        <tr key={delivery.id} className="border-b border-border">
                          <td className="py-3 text-sm font-medium">
                            #{delivery.id.slice(-8).toUpperCase()}
                          </td>
                          <td className="py-3 text-sm">{delivery.vendorName}</td>
                          <td className="py-3 text-sm font-medium">
                            ₹{parseFloat(delivery.totalAmount).toFixed(2)}
                          </td>
                          <td className="py-3">
                            <Badge variant={delivery.status === 'delivered' ? 'default' : 'secondary'}>
                              {delivery.status.replace('_', ' ')}
                            </Badge>
                          </td>
                          <td className="py-3">
                            {delivery.status === 'ready' && (
                              <Button 
                                size="sm"
                                onClick={() => updateDeliveryStatusMutation.mutate({
                                  orderId: delivery.id,
                                  status: 'out_for_delivery'
                                })}
                              >
                                Pickup
                              </Button>
                            )}
                            {delivery.status === 'out_for_delivery' && (
                              <Button 
                                size="sm"
                                onClick={() => updateDeliveryStatusMutation.mutate({
                                  orderId: delivery.id,
                                  status: 'delivered'
                                })}
                              >
                                Delivered
                              </Button>
                            )}
                            {delivery.status === 'delivered' && (
                              <span className="text-green-400 text-sm">Completed</span>
                            )}
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={5} className="text-center py-8 text-muted-foreground">
                            No deliveries assigned yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}