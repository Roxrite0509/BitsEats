import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertVendorSchema, 
  insertMenuCategorySchema, 
  insertMenuItemSchema, 
  insertOrderSchema, 
  insertOrderItemSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Development authentication
  app.post('/api/auth/login', async (req: any, res) => {
    const { email, password } = req.body;
    
    // Simple credential check for development
    const credentials = {
      'admin@bitsgoa.ac.in': { password: 'admin123', userId: 'admin-001' },
      'vendor@bitsgoa.ac.in': { password: 'vendor123', userId: 'vendor-001' },
      'student@bitsgoa.ac.in': { password: 'user123', userId: 'user-001' }
    };
    
    const userCred = credentials[email as keyof typeof credentials];
    if (!userCred || userCred.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    // Store user in session
    req.session.currentUserId = userCred.userId;
    
    const user = await storage.getUser(userCred.userId);
    res.json(user);
  });

  app.post('/api/auth/logout', (req: any, res) => {
    req.session.currentUserId = null;
    res.json({ message: "Logged out successfully" });
  });

  // Development role switcher
  app.post('/api/dev/switch-role', async (req: any, res) => {
    const { userId } = req.body;
    const validUserIds = ['user-001', 'vendor-001', 'admin-001'];
    
    if (!validUserIds.includes(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    // Store current user in session
    req.session.currentUserId = userId;
    
    const user = await storage.getUser(userId);
    res.json(user);
  });

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // User role check middleware
  const requireRole = (roles: string[]) => {
    return async (req: any, res: any, next: any) => {
      // In development, skip role checks - allow all access
      if (process.env.NODE_ENV === 'development') {
        const userId = req.session?.currentUserId || 'admin-001';
        const user = await storage.getUser(userId);
        req.currentUser = user;
        return next();
      }
      
      try {
        const userId = req.user.claims.sub;
        const user = await storage.getUser(userId);
        
        if (!user || !roles.includes(user.role || "user")) {
          return res.status(403).json({ message: "Insufficient permissions" });
        }
        
        req.currentUser = user;
        next();
      } catch (error) {
        res.status(500).json({ message: "Error checking permissions" });
      }
    };
  };

  // Middleware to populate currentUser for all authenticated routes
  const populateCurrentUser = async (req: any, res: any, next: any) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      req.currentUser = user;
      next();
    } catch (error) {
      res.status(500).json({ message: "Error fetching user data" });
    }
  };

  // Vendor routes
  app.get('/api/vendors', async (req, res) => {
    try {
      const vendors = await storage.getVendors();
      res.json(vendors);
    } catch (error) {
      console.error("Error fetching vendors:", error);
      res.status(500).json({ message: "Failed to fetch vendors" });
    }
  });

  app.get('/api/vendors/:id', async (req, res) => {
    try {
      const vendor = await storage.getVendor(req.params.id);
      if (!vendor) {
        return res.status(404).json({ message: "Vendor not found" });
      }
      res.json(vendor);
    } catch (error) {
      console.error("Error fetching vendor:", error);
      res.status(500).json({ message: "Failed to fetch vendor" });
    }
  });

  app.post('/api/vendors', isAuthenticated, requireRole(['admin']), async (req: any, res) => {
    try {
      const validatedData = insertVendorSchema.parse(req.body);
      const vendor = await storage.createVendor(validatedData);
      res.status(201).json(vendor);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid vendor data", errors: error.errors });
      }
      console.error("Error creating vendor:", error);
      res.status(500).json({ message: "Failed to create vendor" });
    }
  });

  app.get('/api/vendors/:id/menu', async (req, res) => {
    try {
      const menuItems = await storage.getMenuItems(req.params.id);
      res.json(menuItems);
    } catch (error) {
      console.error("Error fetching menu items:", error);
      res.status(500).json({ message: "Failed to fetch menu items" });
    }
  });

  app.post('/api/vendors/:id/menu-categories', isAuthenticated, requireRole(['vendor', 'admin']), async (req: any, res) => {
    try {
      const validatedData = insertMenuCategorySchema.parse({
        ...req.body,
        vendorId: req.params.id
      });
      
      // Check if user owns this vendor or is admin
      if (req.currentUser.role !== 'admin') {
        const vendor = await storage.getVendorByUserId(req.currentUser.id);
        if (!vendor || vendor.id !== req.params.id) {
          return res.status(403).json({ message: "Access denied" });
        }
      }
      
      const category = await storage.createMenuCategory(validatedData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid category data", errors: error.errors });
      }
      console.error("Error creating menu category:", error);
      res.status(500).json({ message: "Failed to create menu category" });
    }
  });

  app.post('/api/vendors/:id/menu-items', isAuthenticated, requireRole(['vendor', 'admin']), async (req: any, res) => {
    try {
      const validatedData = insertMenuItemSchema.parse({
        ...req.body,
        vendorId: req.params.id
      });
      
      // Check if user owns this vendor or is admin
      if (req.currentUser.role !== 'admin') {
        const vendor = await storage.getVendorByUserId(req.currentUser.id);
        if (!vendor || vendor.id !== req.params.id) {
          return res.status(403).json({ message: "Access denied" });
        }
      }
      
      const menuItem = await storage.createMenuItem(validatedData);
      res.status(201).json(menuItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid menu item data", errors: error.errors });
      }
      console.error("Error creating menu item:", error);
      res.status(500).json({ message: "Failed to create menu item" });
    }
  });

  app.patch('/api/menu-items/:id', isAuthenticated, requireRole(['vendor', 'admin']), async (req: any, res) => {
    try {
      const menuItem = await storage.getMenuItem(req.params.id);
      if (!menuItem) {
        return res.status(404).json({ message: "Menu item not found" });
      }

      // Check if user owns this vendor or is admin
      if (req.currentUser.role !== 'admin') {
        const vendor = await storage.getVendorByUserId(req.currentUser.id);
        if (!vendor || vendor.id !== menuItem.vendorId) {
          return res.status(403).json({ message: "Access denied" });
        }
      }

      const updatedItem = await storage.updateMenuItem(req.params.id, req.body);
      res.json(updatedItem);
    } catch (error) {
      console.error("Error updating menu item:", error);
      res.status(500).json({ message: "Failed to update menu item" });
    }
  });

  // Order routes
  app.get('/api/orders', isAuthenticated, populateCurrentUser, async (req: any, res) => {
    try {
      const user = req.currentUser;
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      let orders;

      if (user.role === 'admin') {
        orders = await storage.getOrders();
      } else if (user.role === 'vendor') {
        const vendor = await storage.getVendorByUserId(user.id);
        if (!vendor) {
          return res.status(404).json({ message: "Vendor profile not found" });
        }
        orders = await storage.getOrders(undefined, vendor.id);
      } else {
        orders = await storage.getOrders(user.id);
      }

      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.post('/api/orders', isAuthenticated, requireRole(['user']), async (req: any, res) => {
    try {
      const orderData = insertOrderSchema.parse({
        ...req.body,
        userId: req.currentUser.id
      });
      
      const order = await storage.createOrder(orderData);
      
      // Create order items
      const orderItemsData = req.body.items || [];
      for (const item of orderItemsData) {
        const orderItemData = insertOrderItemSchema.parse({
          ...item,
          orderId: order.id
        });
        await storage.createOrderItem(orderItemData);
      }

      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid order data", errors: error.errors });
      }
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  app.patch('/api/orders/:id/status', isAuthenticated, requireRole(['vendor', 'admin']), async (req: any, res) => {
    try {
      const { status } = req.body;
      const order = await storage.getOrder(req.params.id);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Check if user owns this vendor or is admin
      if (req.currentUser.role !== 'admin') {
        const vendor = await storage.getVendorByUserId(req.currentUser.id);
        if (!vendor || vendor.id !== order.vendorId) {
          return res.status(403).json({ message: "Access denied" });
        }
      }

      const updatedOrder = await storage.updateOrderStatus(req.params.id, status);
      res.json(updatedOrder);
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({ message: "Failed to update order status" });
    }
  });

  app.get('/api/orders/:id/items', async (req, res) => {
    try {
      const orderItems = await storage.getOrderItems(req.params.id);
      res.json(orderItems);
    } catch (error) {
      console.error("Error fetching order items:", error);
      res.status(500).json({ message: "Failed to fetch order items" });
    }
  });

  // Review routes removed

  // Analytics routes
  app.get('/api/vendor-stats', isAuthenticated, requireRole(['vendor']), async (req: any, res) => {
    try {
      const vendor = await storage.getVendorByUserId(req.currentUser.id);
      if (!vendor) {
        return res.status(404).json({ message: "Vendor profile not found" });
      }
      
      const stats = await storage.getVendorStats(vendor.id);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching vendor stats:", error);
      res.status(500).json({ message: "Failed to fetch vendor stats" });
    }
  });

  app.get('/api/admin-stats', isAuthenticated, requireRole(['admin']), async (req: any, res) => {
    try {
      const stats = await storage.getAdminStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ message: "Failed to fetch admin stats" });
    }
  });

  app.get('/api/top-vendors', isAuthenticated, requireRole(['admin']), async (req: any, res) => {
    try {
      const topVendors = await storage.getTopVendors();
      res.json(topVendors);
    } catch (error) {
      console.error("Error fetching top vendors:", error);
      res.status(500).json({ message: "Failed to fetch top vendors" });
    }
  });

  // Search routes
  app.get('/api/search', async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== 'string') {
        return res.status(400).json({ message: "Search query required" });
      }
      
      const menuItems = await storage.searchMenuItems(q);
      res.json(menuItems);
    } catch (error) {
      console.error("Error searching menu items:", error);
      res.status(500).json({ message: "Failed to search menu items" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
