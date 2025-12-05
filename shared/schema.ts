import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Tasks table
export const tasks = pgTable("tasks", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  dueDate: text("due_date").notNull(),
  completed: boolean("completed").default(false).notNull(),
  priority: text("priority").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTaskSchema = createInsertSchema(tasks, {
  completed: z.boolean().default(false),
}).omit({
  id: true,
  createdAt: true,
});
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;

// Bills table
export const bills = pgTable("bills", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  provider: text("provider").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  dueDate: text("due_date").notNull(),
  status: text("status").notNull(),
  lastPaid: text("last_paid"),
  attachmentUrl: text("attachment_url"),
  source: text("source").default("manual"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertBillSchema = createInsertSchema(bills).omit({
  id: true,
  createdAt: true,
});
export type InsertBill = z.infer<typeof insertBillSchema>;
export type Bill = typeof bills.$inferSelect;

// Subscriptions table
export const subscriptions = pgTable("subscriptions", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  cost: decimal("cost", { precision: 10, scale: 2 }).notNull(),
  cycle: text("cycle").notNull(),
  renewalDate: text("renewal_date").notNull(),
  logo: text("logo"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
  createdAt: true,
});
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type Subscription = typeof subscriptions.$inferSelect;

// Cars table
export const cars = pgTable("cars", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  make: text("make"),
  model: text("model"),
  year: integer("year"),
  licensePlate: text("license_plate"),
  vin: text("vin"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCarSchema = createInsertSchema(cars).omit({
  id: true,
  createdAt: true,
});
export type InsertCar = z.infer<typeof insertCarSchema>;
export type Car = typeof cars.$inferSelect;

// Car Services table
export const carServices = pgTable("car_services", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  carId: integer("car_id"),
  type: text("type").notNull(),
  date: text("date"),
  km: integer("km"),
  notes: text("notes"),
  status: text("status").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCarServiceSchema = createInsertSchema(carServices).omit({
  id: true,
  createdAt: true,
});
export type InsertCarService = z.infer<typeof insertCarServiceSchema>;
export type CarService = typeof carServices.$inferSelect;

// Kids Events table (from Gmail sync)
export const kidsEvents = pgTable("kids_events", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: text("title").notNull(),
  eventDate: text("event_date").notNull(),
  eventTime: text("event_time"),
  childName: text("child_name"),
  location: text("location"),
  description: text("description"),
  source: text("source").default("manual"),
  sourceId: text("source_id"),
  reminderEnabled: boolean("reminder_enabled").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertKidsEventSchema = createInsertSchema(kidsEvents, {
  reminderEnabled: z.boolean().default(true),
}).omit({
  id: true,
  createdAt: true,
});
export type InsertKidsEvent = z.infer<typeof insertKidsEventSchema>;
export type KidsEvent = typeof kidsEvents.$inferSelect;

// Notes table
export const notes = pgTable("notes", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  content: text("content").notNull().default(""),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertNoteSchema = createInsertSchema(notes).omit({
  id: true,
});
export type InsertNote = z.infer<typeof insertNoteSchema>;
export type Note = typeof notes.$inferSelect;

// Groceries table
export const groceries = pgTable("groceries", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  checked: boolean("checked").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertGrocerySchema = createInsertSchema(groceries, {
  checked: z.boolean().default(false),
}).omit({
  id: true,
  createdAt: true,
});
export type InsertGrocery = z.infer<typeof insertGrocerySchema>;
export type Grocery = typeof groceries.$inferSelect;

// Camera type for frontend (from Unifi Protect API)
export interface UnifiCamera {
  id: string;
  name: string;
  type: string;
  state: string;
  isConnected: boolean;
}
