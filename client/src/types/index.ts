export interface User {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  role?: 'user' | 'vendor' | 'admin';
  phone?: string;
  hostelRoom?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Vendor {
  id: string;
  userId?: string;
  name: string;
  description?: string;
  location: string;
  imageUrl?: string;
  rating: string;
  totalOrders: number;
  isActive: boolean;
  deliveryFee: string;
  minimumOrderAmount: string;
  preparationTime: number;
  cuisineType?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MenuItem {
  id: string;
  vendorId: string;
  categoryId?: string;
  name: string;
  description?: string;
  price: string;
  imageUrl?: string;
  isAvailable: boolean;
  isVegetarian: boolean;
  isVegan: boolean;
  spiceLevel: number;
  preparationTime: number;
  ingredients?: string[];
  allergens?: string[];
  nutritionInfo?: any;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  userId: string;
  vendorId: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';
  totalAmount: string;
  deliveryFee: string;
  tax: string;
  deliveryAddress: string;
  specialInstructions?: string;
  estimatedDeliveryTime?: string;
  actualDeliveryTime?: string;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  menuItemId: string;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
  specialInstructions?: string;
}

export interface Review {
  id: string;
  userId: string;
  vendorId: string;
  orderId: string;
  rating: number;
  comment?: string;
  isAnonymous: boolean;
  createdAt: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
  restaurant?: string;
}

export interface VendorStats {
  todayOrders: number;
  todayRevenue: number;
  pendingOrders: number;
  avgRating: number;
}

export interface AdminStats {
  todayOrders: number;
  todayRevenue: number;
  activeVendors: number;
  totalUsers: number;
}
