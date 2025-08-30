import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface RestaurantCardProps {
  vendor: {
    id: string;
    name: string;
    description?: string;
    location: string;
    imageUrl?: string;
    rating: string;
    deliveryFee: string;
    minimumOrderAmount: string;
    preparationTime: number;
    cuisineType?: string;
  };
  onAddToCart: (item: any) => void;
}

export default function RestaurantCard({ vendor, onAddToCart }: RestaurantCardProps) {
  const defaultImages = [
    "https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&w=400&h=200&fit=crop",
    "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&w=400&h=200&fit=crop",
    "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?ixlib=rb-4.0.3&w=400&h=200&fit=crop",
  ];

  const imageUrl = vendor.imageUrl || defaultImages[Math.floor(Math.random() * defaultImages.length)];

  return (
    <Card className="overflow-hidden card-hover food-card" data-testid={`card-restaurant-${vendor.id}`}>
      <img 
        src={imageUrl}
        alt={`${vendor.name} food`} 
        className="w-full h-48 object-cover"
      />
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h4 className="font-bold text-lg" data-testid={`text-restaurant-name-${vendor.id}`}>
              {vendor.name}
            </h4>
            <p className="text-muted-foreground text-sm">
              {vendor.cuisineType || 'Various'} • {vendor.description || 'Delicious food'}
            </p>
          </div>
          <Badge variant="secondary" className="bg-green-600/20 text-green-400">
            <i className="fas fa-star mr-1 text-xs"></i>
            {parseFloat(vendor.rating).toFixed(1)}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
          <span data-testid={`text-delivery-time-${vendor.id}`}>
            {vendor.preparationTime}-{vendor.preparationTime + 10} min
          </span>
          <span data-testid={`text-location-${vendor.id}`}>
            {vendor.location}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-sm">
            <span className="text-muted-foreground">Free delivery on orders above </span>
            <span className="text-primary font-medium">
              ₹{parseFloat(vendor.minimumOrderAmount).toFixed(0)}
            </span>
          </div>
          <Button 
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            data-testid={`button-order-${vendor.id}`}
          >
            Order Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
