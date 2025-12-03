import { 
  type User, type InsertUser,
  type Task, type InsertTask,
  type Bill, type InsertBill,
  type Subscription, type InsertSubscription,
  type Car, type InsertCar,
  type CarService, type InsertCarService,
  type KidsEvent, type InsertKidsEvent,
  type Note, type InsertNote,
  users, tasks, bills, subscriptions, cars, carServices, kidsEvents, notes
} from "@shared/schema";
import { eq, desc, gte, lte, and, sql } from "drizzle-orm";
import { db } from "./db";
import { addDays, format } from "date-fns";

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

  // Car methods
  getCars(): Promise<Car[]>;
  getCar(id: number): Promise<Car | undefined>;
  createCar(car: InsertCar): Promise<Car>;
  updateCar(id: number, car: Partial<InsertCar>): Promise<Car | undefined>;
  deleteCar(id: number): Promise<void>;

  // Car Service methods
  getCarServices(): Promise<CarService[]>;
  getCarService(id: number): Promise<CarService | undefined>;
  createCarService(carService: InsertCarService): Promise<CarService>;
  updateCarService(id: number, carService: Partial<InsertCarService>): Promise<CarService | undefined>;
  deleteCarService(id: number): Promise<void>;

  // Kids Events methods
  getKidsEvents(): Promise<KidsEvent[]>;
  getKidsEvent(id: number): Promise<KidsEvent | undefined>;
  createKidsEvent(event: InsertKidsEvent): Promise<KidsEvent>;
  updateKidsEvent(id: number, event: Partial<InsertKidsEvent>): Promise<KidsEvent | undefined>;
  deleteKidsEvent(id: number): Promise<void>;

  // Note methods
  getNote(): Promise<Note | undefined>;
  updateNote(content: string): Promise<Note>;

  // Dashboard methods
  getUpcomingPayments(days: number): Promise<{ type: 'bill' | 'subscription'; item: Bill | Subscription }[]>;
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

  // Car methods
  async getCars(): Promise<Car[]> {
    return db.select().from(cars).orderBy(desc(cars.createdAt));
  }

  async getCar(id: number): Promise<Car | undefined> {
    const result = await db.select().from(cars).where(eq(cars.id, id));
    return result[0];
  }

  async createCar(car: InsertCar): Promise<Car> {
    const result = await db.insert(cars).values(car).returning();
    return result[0];
  }

  async updateCar(id: number, car: Partial<InsertCar>): Promise<Car | undefined> {
    const result = await db.update(cars).set(car).where(eq(cars.id, id)).returning();
    return result[0];
  }

  async deleteCar(id: number): Promise<void> {
    await db.delete(cars).where(eq(cars.id, id));
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

  // Kids Events methods
  async getKidsEvents(): Promise<KidsEvent[]> {
    return db.select().from(kidsEvents).orderBy(desc(kidsEvents.eventDate));
  }

  async getKidsEvent(id: number): Promise<KidsEvent | undefined> {
    const result = await db.select().from(kidsEvents).where(eq(kidsEvents.id, id));
    return result[0];
  }

  async createKidsEvent(event: InsertKidsEvent): Promise<KidsEvent> {
    const result = await db.insert(kidsEvents).values(event).returning();
    return result[0];
  }

  async updateKidsEvent(id: number, event: Partial<InsertKidsEvent>): Promise<KidsEvent | undefined> {
    const result = await db.update(kidsEvents).set(event).where(eq(kidsEvents.id, id)).returning();
    return result[0];
  }

  async deleteKidsEvent(id: number): Promise<void> {
    await db.delete(kidsEvents).where(eq(kidsEvents.id, id));
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

  // Dashboard methods
  async getUpcomingPayments(days: number = 14): Promise<{ type: 'bill' | 'subscription'; item: Bill | Subscription }[]> {
    const today = format(new Date(), "yyyy-MM-dd");
    const futureDate = format(addDays(new Date(), days), "yyyy-MM-dd");

    const upcomingBills = await db.select().from(bills)
      .where(
        and(
          gte(bills.dueDate, today),
          lte(bills.dueDate, futureDate)
        )
      )
      .orderBy(bills.dueDate);

    const upcomingSubs = await db.select().from(subscriptions)
      .where(
        and(
          gte(subscriptions.renewalDate, today),
          lte(subscriptions.renewalDate, futureDate)
        )
      )
      .orderBy(subscriptions.renewalDate);

    const combined: { type: 'bill' | 'subscription'; item: Bill | Subscription; date: string }[] = [
      ...upcomingBills.map(b => ({ type: 'bill' as const, item: b, date: b.dueDate })),
      ...upcomingSubs.map(s => ({ type: 'subscription' as const, item: s, date: s.renewalDate })),
    ];

    combined.sort((a, b) => a.date.localeCompare(b.date));

    return combined.map(({ type, item }) => ({ type, item }));
  }
}

export const storage = new DatabaseStorage();
