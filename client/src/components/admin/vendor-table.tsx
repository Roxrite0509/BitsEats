import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface VendorTableProps {
  vendors: Array<{
    id: string;
    name: string;
    location: string;
    imageUrl?: string;
    isActive: boolean;
    rating: string;
    totalOrders: number;
  }>;
}

export default function VendorTable({ vendors }: VendorTableProps) {
  const defaultImages = [
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&w=40&h=40&fit=crop",
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&w=40&h=40&fit=crop",
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 text-sm font-medium text-muted-foreground">Vendor</th>
            <th className="text-left py-3 text-sm font-medium text-muted-foreground">Status</th>
            <th className="text-left py-3 text-sm font-medium text-muted-foreground">Total Orders</th>
            <th className="text-left py-3 text-sm font-medium text-muted-foreground">Rating</th>
            <th className="text-left py-3 text-sm font-medium text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody>
          {vendors.length > 0 ? (
            vendors.map((vendor, index) => (
              <tr key={vendor.id} className="border-b border-border" data-testid={`row-vendor-${vendor.id}`}>
                <td className="py-3">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={vendor.imageUrl || defaultImages[index % defaultImages.length]}
                      alt={vendor.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div>
                      <h5 className="font-medium" data-testid={`text-vendor-name-${vendor.id}`}>
                        {vendor.name}
                      </h5>
                      <p className="text-muted-foreground text-sm" data-testid={`text-vendor-location-${vendor.id}`}>
                        {vendor.location}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-3">
                  <Badge 
                    variant={vendor.isActive ? "default" : "secondary"}
                    className={vendor.isActive ? "bg-green-500/20 text-green-400" : ""}
                  >
                    {vendor.isActive ? "Active" : "Inactive"}
                  </Badge>
                </td>
                <td className="py-3 text-sm font-medium" data-testid={`text-vendor-orders-${vendor.id}`}>
                  {vendor.totalOrders}
                </td>
                <td className="py-3">
                  <div className="flex items-center space-x-1">
                    <i className="fas fa-star text-yellow-400 text-xs"></i>
                    <span className="text-sm font-medium" data-testid={`text-vendor-rating-${vendor.id}`}>
                      {parseFloat(vendor.rating).toFixed(1)}
                    </span>
                  </div>
                </td>
                <td className="py-3">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" data-testid={`button-view-vendor-${vendor.id}`}>
                      <i className="fas fa-eye text-primary"></i>
                    </Button>
                    <Button variant="ghost" size="sm" data-testid={`button-edit-vendor-${vendor.id}`}>
                      <i className="fas fa-edit text-muted-foreground"></i>
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="py-8 text-center text-muted-foreground">
                No vendors found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
