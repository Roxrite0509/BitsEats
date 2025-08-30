import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface OrderCardProps {
  order: {
    id: string;
    userId: string;
    status: string;
    totalAmount: string;
    deliveryAddress: string;
    specialInstructions?: string;
    createdAt: string;
  };
  onUpdateStatus: (orderId: string, status: string) => void;
}

export default function OrderCard({ order, onUpdateStatus }: OrderCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'confirmed': return 'bg-blue-500/20 text-blue-400';
      case 'preparing': return 'bg-orange-500/20 text-orange-400';
      case 'ready': return 'bg-green-500/20 text-green-400';
      case 'delivered': return 'bg-green-600/20 text-green-400';
      case 'cancelled': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getNextAction = (status: string) => {
    switch (status) {
      case 'pending': return { action: 'confirmed', label: 'Confirm Order', color: 'bg-blue-600' };
      case 'confirmed': return { action: 'preparing', label: 'Start Preparing', color: 'bg-orange-600' };
      case 'preparing': return { action: 'ready', label: 'Mark Ready', color: 'bg-green-600' };
      case 'ready': return { action: 'delivered', label: 'Mark Delivered', color: 'bg-green-700' };
      default: return null;
    }
  };

  const nextAction = getNextAction(order.status);

  return (
    <Card className="border border-border" data-testid={`card-order-${order.id}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h5 className="font-medium" data-testid={`text-order-id-${order.id}`}>
              Order #{order.id.slice(-8).toUpperCase()}
            </h5>
            <p className="text-muted-foreground text-sm">
              Customer ID: {order.userId.slice(-8).toUpperCase()}
            </p>
          </div>
          <div className="text-right">
            <Badge className={getStatusColor(order.status)}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
            <p className="text-muted-foreground text-sm mt-1">
              {new Date(order.createdAt).toLocaleTimeString()}
            </p>
          </div>
        </div>
        
        <div className="space-y-1 mb-3">
          <p className="text-sm">
            <strong>Delivery:</strong> {order.deliveryAddress}
          </p>
          {order.specialInstructions && (
            <p className="text-sm text-muted-foreground">
              <strong>Notes:</strong> {order.specialInstructions}
            </p>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <span className="font-bold" data-testid={`text-order-amount-${order.id}`}>
            ₹{parseFloat(order.totalAmount).toFixed(2)}
          </span>
          <div className="space-x-2">
            {nextAction && (
              <Button
                size="sm"
                className={`${nextAction.color} hover:opacity-90 text-white`}
                onClick={() => onUpdateStatus(order.id, nextAction.action)}
                data-testid={`button-update-status-${order.id}`}
              >
                {nextAction.label}
              </Button>
            )}
            {order.status !== 'delivered' && order.status !== 'cancelled' && (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onUpdateStatus(order.id, 'cancelled')}
                data-testid={`button-cancel-${order.id}`}
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
