import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface CartItem {
  id: string;
  name: string;
  price: string;
  quantity: number;
  restaurant?: string;
  imageUrl?: string;
}

interface CartOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateItems: (items: CartItem[]) => void;
}

export default function CartOverlay({ isOpen, onClose, items, onUpdateItems }: CartOverlayProps) {
  const updateQuantity = (id: string, delta: number) => {
    const updatedItems = items.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(0, item.quantity + delta);
        return newQuantity === 0 ? null : { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(Boolean) as CartItem[];
    
    onUpdateItems(updatedItems);
  };

  const removeItem = (id: string) => {
    const updatedItems = items.filter(item => item.id !== id);
    onUpdateItems(updatedItems);
  };

  const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
  const deliveryFee = subtotal > 200 ? 0 : 20;
  const tax = subtotal * 0.1;
  const total = subtotal + deliveryFee + tax;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        className="flex-1 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Cart Panel */}
      <div className="w-96 bg-card border-l border-border h-full overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">Your Order</h3>
            <Button variant="ghost" size="sm" onClick={onClose} data-testid="button-close-cart">
              <i className="fas fa-times"></i>
            </Button>
          </div>
          
          {items.length === 0 ? (
            <div className="text-center py-8">
              <i className="fas fa-shopping-cart text-4xl text-muted-foreground mb-4"></i>
              <p className="text-muted-foreground">Your cart is empty</p>
              <p className="text-sm text-muted-foreground">Add some delicious items to get started!</p>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <Card key={item.id} className="p-3" data-testid={`cart-item-${item.id}`}>
                    <div className="flex items-center space-x-3">
                      <img 
                        src={item.imageUrl || "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?ixlib=rb-4.0.3&w=60&h=60&fit=crop"}
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h5 className="font-medium" data-testid={`text-cart-item-name-${item.id}`}>
                          {item.name}
                        </h5>
                        <p className="text-muted-foreground text-sm">
                          {item.restaurant || 'Restaurant'}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-6 h-6 p-0"
                            onClick={() => updateQuantity(item.id, -1)}
                            data-testid={`button-decrease-${item.id}`}
                          >
                            <i className="fas fa-minus text-xs"></i>
                          </Button>
                          <span className="text-sm font-medium" data-testid={`text-quantity-${item.id}`}>
                            {item.quantity}
                          </span>
                          <Button
                            size="sm"
                            className="w-6 h-6 p-0"
                            onClick={() => updateQuantity(item.id, 1)}
                            data-testid={`button-increase-${item.id}`}
                          >
                            <i className="fas fa-plus text-primary-foreground text-xs"></i>
                          </Button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium" data-testid={`text-item-total-${item.id}`}>
                          ₹{(parseFloat(item.price) * item.quantity).toFixed(2)}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-destructive hover:text-destructive/80"
                          data-testid={`button-remove-${item.id}`}
                        >
                          <i className="fas fa-trash text-xs"></i>
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span data-testid="text-subtotal">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Delivery Fee</span>
                  <span data-testid="text-delivery-fee">₹{deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span data-testid="text-tax">₹{tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span data-testid="text-total">₹{total.toFixed(2)}</span>
                </div>
              </div>

              <Button 
                className="w-full mt-6 bg-primary hover:bg-primary/90"
                data-testid="button-checkout"
              >
                Proceed to Checkout
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
