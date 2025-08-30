import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Header from "@/components/layout/header";
import RestaurantCard from "@/components/user/restaurant-card";
import CartOverlay from "@/components/user/cart-overlay";
import LoadingSpinner from "@/components/common/loading-spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function UserDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItems, setCartItems] = useState<any[]>([]);

  const { data: vendors, isLoading: vendorsLoading } = useQuery({
    queryKey: ["/api/vendors"],
  });

  const { data: userOrders } = useQuery({
    queryKey: ["/api/orders"],
  });

  if (authLoading || vendorsLoading) {
    return <LoadingSpinner />;
  }

  if (!user || user.role !== 'user') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-destructive">Access denied. User role required.</p>
      </div>
    );
  }

  const addToCart = (item: any) => {
    setCartItems(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const categories = [
    { icon: "fas fa-pizza-slice", name: "Pizza", color: "text-primary" },
    { icon: "fas fa-hamburger", name: "Burgers", color: "text-primary" },
    { icon: "fas fa-ice-cream", name: "Desserts", color: "text-primary" },
    { icon: "fas fa-coffee", name: "Beverages", color: "text-primary" },
    { icon: "fas fa-seedling", name: "Healthy", color: "text-primary" },
    { icon: "fas fa-pepper-hot", name: "Spicy", color: "text-primary" },
  ];

  const currentOrder = userOrders && userOrders.length > 0 ? userOrders[0] : null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-primary to-orange-600 rounded-2xl p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-2">Hungry? We've got you covered!</h2>
              <p className="text-lg opacity-90 mb-4">Order from your favorite campus eateries</p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-white/20 rounded-lg px-3 py-2">
                  <i className="fas fa-clock text-sm"></i>
                  <span className="text-sm">15-30 min delivery</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 rounded-lg px-3 py-2">
                  <i className="fas fa-map-marker-alt text-sm"></i>
                  <span className="text-sm">BITS Goa Campus</span>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
              <i className="fas fa-pizza-slice text-9xl"></i>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"></i>
              <Input
                type="search"
                placeholder="Search restaurants, cuisines, dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" data-testid="button-filters">
                <i className="fas fa-filter mr-2"></i>
                Filters
              </Button>
              <Button variant="outline" data-testid="button-sort">
                <i className="fas fa-sort mr-2"></i>
                Sort
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Categories */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Quick Picks</h3>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-xl p-4 text-center hover:bg-accent cursor-pointer transition-colors"
                data-testid={`category-${category.name.toLowerCase()}`}
              >
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <i className={`${category.icon} ${category.color} text-xl`}></i>
                </div>
                <span className="text-sm font-medium">{category.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Current Order */}
        {currentOrder && (
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">Your Current Order</h3>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                      <i className="fas fa-receipt text-primary"></i>
                    </div>
                    <div>
                      <h4 className="font-medium" data-testid="text-order-restaurant">
                        Order #{currentOrder.id.slice(-8).toUpperCase()}
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        Estimated delivery: {currentOrder.estimatedDeliveryTime ? 
                          new Date(currentOrder.estimatedDeliveryTime).toLocaleTimeString() : 
                          "TBD"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`status-${currentOrder.status}`}>
                        <i className="fas fa-circle text-xs"></i>
                        {currentOrder.status.charAt(0).toUpperCase() + currentOrder.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {currentOrder.status === 'preparing' ? '15 min remaining' : 
                       currentOrder.status === 'ready' ? 'Ready for pickup' : 
                       'Processing'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold" data-testid="text-order-total">
                    ₹{parseFloat(currentOrder.totalAmount).toFixed(2)}
                  </span>
                  <Button variant="outline" size="sm" data-testid="button-track-order">
                    Track Order <i className="fas fa-arrow-right ml-1"></i>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Campus Restaurants */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">Campus Restaurants</h3>
            <Button variant="ghost" className="text-primary hover:text-primary/80" data-testid="button-view-all">
              View All
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vendors?.map((vendor: any) => (
              <RestaurantCard
                key={vendor.id}
                vendor={vendor}
                onAddToCart={addToCart}
              />
            )) || (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground">No restaurants available at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cart Overlay */}
      <CartOverlay
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateItems={setCartItems}
      />

      {/* Floating Cart Button */}
      <Button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg bg-primary hover:bg-primary/90"
        data-testid="button-cart"
      >
        <i className="fas fa-shopping-cart"></i>
        {cartItems.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground w-6 h-6 rounded-full text-xs flex items-center justify-center">
            {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
          </span>
        )}
      </Button>
    </div>
  );
}
