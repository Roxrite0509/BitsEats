import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

interface MenuItemProps {
  item: {
    id: string;
    name: string;
    price: string;
    imageUrl?: string;
    isAvailable: boolean;
    description?: string;
  };
  showFullControls?: boolean;
}

export default function MenuItem({ item, showFullControls = false }: MenuItemProps) {
  const [isAvailable, setIsAvailable] = useState(item.isAvailable);

  const defaultImages = [
    "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?ixlib=rb-4.0.3&w=60&h=60&fit=crop",
    "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?ixlib=rb-4.0.3&w=48&h=48&fit=crop",
  ];

  const imageUrl = item.imageUrl || defaultImages[Math.floor(Math.random() * defaultImages.length)];

  const handleAvailabilityToggle = (checked: boolean) => {
    setIsAvailable(checked);
    // TODO: Update item availability via API
  };

  return (
    <div 
      className={`flex items-center justify-between p-3 border border-border rounded-lg ${
        !isAvailable ? 'opacity-60' : ''
      }`}
      data-testid={`menu-item-${item.id}`}
    >
      <div className="flex items-center space-x-3">
        <img 
          src={imageUrl}
          alt={item.name}
          className="w-12 h-12 rounded-lg object-cover"
        />
        <div>
          <h5 className="font-medium" data-testid={`text-item-name-${item.id}`}>
            {item.name}
          </h5>
          <p className="text-muted-foreground text-sm" data-testid={`text-item-price-${item.id}`}>
            ₹{parseFloat(item.price).toFixed(2)}
          </p>
          {showFullControls && item.description && (
            <p className="text-muted-foreground text-xs mt-1">
              {item.description}
            </p>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          checked={isAvailable}
          onCheckedChange={handleAvailabilityToggle}
          data-testid={`switch-availability-${item.id}`}
        />
        <Button 
          variant="ghost" 
          size="sm"
          data-testid={`button-edit-${item.id}`}
        >
          <i className="fas fa-edit text-muted-foreground hover:text-foreground"></i>
        </Button>
      </div>
    </div>
  );
}
