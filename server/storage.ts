import {
  users,
  vendors,
  menuCategories,
  menuItems,
  orders,
  orderItems,
  type User,
  type UpsertUser,
  type Vendor,
  type InsertVendor,
  type MenuCategory,
  type InsertMenuCategory,
  type MenuItem,
  type InsertMenuItem,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, avg, count, sum, sql, gte, like } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Vendor operations
  getVendors(): Promise<Vendor[]>;
  getVendor(id: string): Promise<Vendor | undefined>;
  getVendorByUserId(userId: string): Promise<Vendor | undefined>;
  createVendor(vendor: InsertVendor): Promise<Vendor>;
  updateVendor(id: string, vendor: Partial<InsertVendor>): Promise<Vendor>;
  
  // Menu operations
  getMenuCategories(vendorId: string): Promise<MenuCategory[]>;
  createMenuCategory(category: InsertMenuCategory): Promise<MenuCategory>;
  getMenuItems(vendorId: string): Promise<MenuItem[]>;
  getMenuItem(id: string): Promise<MenuItem | undefined>;
  createMenuItem(item: InsertMenuItem): Promise<MenuItem>;
  updateMenuItem(id: string, item: Partial<InsertMenuItem>): Promise<MenuItem>;
  searchMenuItems(query: string): Promise<MenuItem[]>;
  
  // Order operations
  getOrders(userId?: string, vendorId?: string): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: string, status: string): Promise<Order>;
  getOrderItems(orderId: string): Promise<OrderItem[]>;
  createOrderItem(item: InsertOrderItem): Promise<OrderItem>;
  
  // Review operations removed
  
  // Analytics operations
  getVendorStats(vendorId: string): Promise<any>;
  getAdminStats(): Promise<any>;
  getTopVendors(): Promise<any[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Vendor operations
  async getVendors(): Promise<Vendor[]> {
    return await db.select().from(vendors).where(eq(vendors.isActive, true)).orderBy(vendors.name);
  }

  async getVendor(id: string): Promise<Vendor | undefined> {
    const [vendor] = await db.select().from(vendors).where(eq(vendors.id, id));
    return vendor;
  }

  async getVendorByUserId(userId: string): Promise<Vendor | undefined> {
    const [vendor] = await db.select().from(vendors).where(eq(vendors.userId, userId));
    return vendor;
  }

  async createVendor(vendor: InsertVendor): Promise<Vendor> {
    const [newVendor] = await db.insert(vendors).values(vendor).returning();
    return newVendor;
  }

  async updateVendor(id: string, vendor: Partial<InsertVendor>): Promise<Vendor> {
    const [updatedVendor] = await db
      .update(vendors)
      .set({ ...vendor, updatedAt: new Date() })
      .where(eq(vendors.id, id))
      .returning();
    return updatedVendor;
  }

  // Menu operations
  async getMenuCategories(vendorId: string): Promise<MenuCategory[]> {
    return await db
      .select()
      .from(menuCategories)
      .where(and(eq(menuCategories.vendorId, vendorId), eq(menuCategories.isActive, true)))
      .orderBy(menuCategories.displayOrder);
  }

  async createMenuCategory(category: InsertMenuCategory): Promise<MenuCategory> {
    const [newCategory] = await db.insert(menuCategories).values(category).returning();
    return newCategory;
  }

  async getMenuItems(vendorId: string): Promise<MenuItem[]> {
    return await db
      .select()
      .from(menuItems)
      .where(eq(menuItems.vendorId, vendorId))
      .orderBy(menuItems.displayOrder);
  }

  async getMenuItem(id: string): Promise<MenuItem | undefined> {
    const [item] = await db.select().from(menuItems).where(eq(menuItems.id, id));
    return item;
  }

  async createMenuItem(item: InsertMenuItem): Promise<MenuItem> {
    const [newItem] = await db.insert(menuItems).values(item).returning();
    return newItem;
  }

  async updateMenuItem(id: string, item: Partial<InsertMenuItem>): Promise<MenuItem> {
    const [updatedItem] = await db
      .update(menuItems)
      .set({ ...item, updatedAt: new Date() })
      .where(eq(menuItems.id, id))
      .returning();
    return updatedItem;
  }

  async searchMenuItems(query: string): Promise<MenuItem[]> {
    return await db
      .select()
      .from(menuItems)
      .where(
        and(
          eq(menuItems.isAvailable, true),
          like(menuItems.name, `%${query}%`)
        )
      )
      .limit(20);
  }

  // Order operations
  async getOrders(userId?: string, vendorId?: string): Promise<Order[]> {
    if (userId) {
      return await db.select().from(orders)
        .where(eq(orders.userId, userId))
        .orderBy(desc(orders.createdAt));
    } else if (vendorId) {
      return await db.select().from(orders)
        .where(eq(orders.vendorId, vendorId))
        .orderBy(desc(orders.createdAt));
    }
    
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db.insert(orders).values(order).returning();
    return newOrder;
  }

  async updateOrderStatus(id: string, status: string): Promise<Order> {
    const [updatedOrder] = await db
      .update(orders)
      .set({ status: status as any, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();
    return updatedOrder;
  }

  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }

  async createOrderItem(item: InsertOrderItem): Promise<OrderItem> {
    const [newItem] = await db.insert(orderItems).values(item).returning();
    return newItem;
  }

  // Review operations removed

  // Analytics operations
  async getVendorStats(vendorId: string): Promise<any> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [todayOrders] = await db
      .select({ count: count() })
      .from(orders)
      .where(and(
        eq(orders.vendorId, vendorId),
        gte(orders.createdAt, today)
      ));

    const [todayRevenue] = await db
      .select({ sum: sum(orders.totalAmount) })
      .from(orders)
      .where(and(
        eq(orders.vendorId, vendorId),
        gte(orders.createdAt, today),
        eq(orders.paymentStatus, "completed")
      ));

    const [pendingOrders] = await db
      .select({ count: count() })
      .from(orders)
      .where(and(
        eq(orders.vendorId, vendorId),
        sql`${orders.status} IN ('pending', 'confirmed', 'preparing')`
      ));

    // Average rating calculation removed - no reviews system

    return {
      todayOrders: todayOrders.count || 0,
      todayRevenue: parseFloat(todayRevenue.sum || "0"),
      pendingOrders: pendingOrders.count || 0,
      avgRating: 0, // No rating system
    };
  }

  async getAdminStats(): Promise<any> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [todayOrders] = await db
      .select({ count: count() })
      .from(orders)
      .where(gte(orders.createdAt, today));

    const [todayRevenue] = await db
      .select({ sum: sum(orders.totalAmount) })
      .from(orders)
      .where(and(
        gte(orders.createdAt, today),
        eq(orders.paymentStatus, "completed")
      ));

    const [activeVendors] = await db
      .select({ count: count() })
      .from(vendors)
      .where(eq(vendors.isActive, true));

    const [totalUsers] = await db
      .select({ count: count() })
      .from(users);

    return {
      todayOrders: todayOrders.count || 0,
      todayRevenue: parseFloat(todayRevenue.sum || "0"),
      activeVendors: activeVendors.count || 0,
      totalUsers: totalUsers.count || 0,
    };
  }

  async getTopVendors(): Promise<any[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return await db
      .select({
        id: vendors.id,
        name: vendors.name,
        orders: count(orders.id),
        revenue: sum(orders.totalAmount),
        // rating: vendors.rating, // Rating removed
      })
      .from(vendors)
      .leftJoin(orders, and(
        eq(orders.vendorId, vendors.id),
        gte(orders.createdAt, today),
        eq(orders.paymentStatus, "completed")
      ))
      .where(eq(vendors.isActive, true))
      .groupBy(vendors.id, vendors.name)
      .orderBy(desc(count(orders.id)))
      .limit(10);
  }
}

export const storage = new DatabaseStorage();
