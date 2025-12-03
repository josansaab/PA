import { 
  type User, type InsertUser,
  type Task, type InsertTask,
  type Bill, type InsertBill,
  type Subscription, type InsertSubscription,
  type CarService, type InsertCarService,
  type Note, type InsertNote,
  users, tasks, bills, subscriptions, carServices, notes
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";
import { db } from "./db";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Task methods
  getTasks(): Promise<Task[]>;
  getTask(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, task: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: number): Promise<void>;

  // Bill methods
  getBills(): Promise<Bill[]>;
  getBill(id: number): Promise<Bill | undefined>;
  createBill(bill: InsertBill): Promise<Bill>;
  updateBill(id: number, bill: Partial<InsertBill>): Promise<Bill | undefined>;
  deleteBill(id: number): Promise<void>;

  // Subscription methods
  getSubscriptions(): Promise<Subscription[]>;
  getSubscription(id: number): Promise<Subscription | undefined>;
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  updateSubscription(id: number, subscription: Partial<InsertSubscription>): Promise<Subscription | undefined>;
  deleteSubscription(id: number): Promise<void>;

  // Car Service methods
  getCarServices(): Promise<CarService[]>;
  getCarService(id: number): Promise<CarService | undefined>;
  createCarService(carService: InsertCarService): Promise<CarService>;
  updateCarService(id: number, carService: Partial<InsertCarService>): Promise<CarService | undefined>;
  deleteCarService(id: number): Promise<void>;

  // Note methods
  getNote(): Promise<Note | undefined>;
  updateNote(content: string): Promise<Note>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Task methods
  async getTasks(): Promise<Task[]> {
    return db.select().from(tasks).orderBy(desc(tasks.createdAt));
  }

  async getTask(id: number): Promise<Task | undefined> {
    const result = await db.select().from(tasks).where(eq(tasks.id, id));
    return result[0];
  }

  async createTask(task: InsertTask): Promise<Task> {
    const result = await db.insert(tasks).values(task).returning();
    return result[0];
  }

  async updateTask(id: number, task: Partial<InsertTask>): Promise<Task | undefined> {
    const result = await db.update(tasks).set(task).where(eq(tasks.id, id)).returning();
    return result[0];
  }

  async deleteTask(id: number): Promise<void> {
    await db.delete(tasks).where(eq(tasks.id, id));
  }

  // Bill methods
  async getBills(): Promise<Bill[]> {
    return db.select().from(bills).orderBy(desc(bills.createdAt));
  }

  async getBill(id: number): Promise<Bill | undefined> {
    const result = await db.select().from(bills).where(eq(bills.id, id));
    return result[0];
  }

  async createBill(bill: InsertBill): Promise<Bill> {
    const result = await db.insert(bills).values(bill).returning();
    return result[0];
  }

  async updateBill(id: number, bill: Partial<InsertBill>): Promise<Bill | undefined> {
    const result = await db.update(bills).set(bill).where(eq(bills.id, id)).returning();
    return result[0];
  }

  async deleteBill(id: number): Promise<void> {
    await db.delete(bills).where(eq(bills.id, id));
  }

  // Subscription methods
  async getSubscriptions(): Promise<Subscription[]> {
    return db.select().from(subscriptions).orderBy(desc(subscriptions.createdAt));
  }

  async getSubscription(id: number): Promise<Subscription | undefined> {
    const result = await db.select().from(subscriptions).where(eq(subscriptions.id, id));
    return result[0];
  }

  async createSubscription(subscription: InsertSubscription): Promise<Subscription> {
    const result = await db.insert(subscriptions).values(subscription).returning();
    return result[0];
  }

  async updateSubscription(id: number, subscription: Partial<InsertSubscription>): Promise<Subscription | undefined> {
    const result = await db.update(subscriptions).set(subscription).where(eq(subscriptions.id, id)).returning();
    return result[0];
  }

  async deleteSubscription(id: number): Promise<void> {
    await db.delete(subscriptions).where(eq(subscriptions.id, id));
  }

  // Car Service methods
  async getCarServices(): Promise<CarService[]> {
    return db.select().from(carServices).orderBy(desc(carServices.createdAt));
  }

  async getCarService(id: number): Promise<CarService | undefined> {
    const result = await db.select().from(carServices).where(eq(carServices.id, id));
    return result[0];
  }

  async createCarService(carService: InsertCarService): Promise<CarService> {
    const result = await db.insert(carServices).values(carService).returning();
    return result[0];
  }

  async updateCarService(id: number, carService: Partial<InsertCarService>): Promise<CarService | undefined> {
    const result = await db.update(carServices).set(carService).where(eq(carServices.id, id)).returning();
    return result[0];
  }

  async deleteCarService(id: number): Promise<void> {
    await db.delete(carServices).where(eq(carServices.id, id));
  }

  // Note methods
  async getNote(): Promise<Note | undefined> {
    const result = await db.select().from(notes).limit(1);
    if (result.length === 0) {
      const created = await db.insert(notes).values({ content: "" }).returning();
      return created[0];
    }
    return result[0];
  }

  async updateNote(content: string): Promise<Note> {
    const existing = await this.getNote();
    if (!existing) {
      const created = await db.insert(notes).values({ content }).returning();
      return created[0];
    }
    const result = await db.update(notes).set({ content, updatedAt: new Date() }).where(eq(notes.id, existing.id)).returning();
    return result[0];
  }
}

export const storage = new DatabaseStorage();
