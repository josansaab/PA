import { db } from "./db";
import { tasks, bills, subscriptions, carServices } from "@shared/schema";
import { format, addDays } from "date-fns";

async function seed() {
  console.log("Seeding database...");

  // Seed tasks
  await db.insert(tasks).values([
    {
      title: "Review quarterly budget",
      category: "Work",
      dueDate: format(new Date(), "yyyy-MM-dd"),
      completed: false,
      priority: "High",
    },
    {
      title: "Buy groceries for dinner",
      category: "Home",
      dueDate: format(new Date(), "yyyy-MM-dd"),
      completed: false,
      priority: "Medium",
    },
    {
      title: "Call insurance company",
      category: "Car",
      dueDate: format(addDays(new Date(), 1), "yyyy-MM-dd"),
      completed: false,
      priority: "Medium",
    },
    {
      title: "Cancel Netflix subscription",
      category: "Bills",
      dueDate: format(addDays(new Date(), 2), "yyyy-MM-dd"),
      completed: true,
      priority: "Low",
    },
    {
      title: "Prepare presentation slides",
      category: "Business",
      dueDate: format(addDays(new Date(), 3), "yyyy-MM-dd"),
      completed: false,
      priority: "High",
    },
  ]);

  // Seed bills
  await db.insert(bills).values([
    {
      provider: "Electric Company",
      amount: "145.50",
      dueDate: format(addDays(new Date(), 2), "yyyy-MM-dd"),
      status: "Due",
    },
    {
      provider: "Water Corp",
      amount: "89.20",
      dueDate: format(addDays(new Date(), -2), "yyyy-MM-dd"),
      status: "Overdue",
    },
    {
      provider: "Internet Provider",
      amount: "79.99",
      dueDate: format(addDays(new Date(), 15), "yyyy-MM-dd"),
      status: "Paid",
      lastPaid: format(addDays(new Date(), -15), "yyyy-MM-dd"),
    },
  ]);

  // Seed subscriptions
  await db.insert(subscriptions).values([
    {
      name: "Netflix",
      cost: "15.99",
      cycle: "Monthly",
      renewalDate: format(addDays(new Date(), 5), "yyyy-MM-dd"),
    },
    {
      name: "Spotify",
      cost: "9.99",
      cycle: "Monthly",
      renewalDate: format(addDays(new Date(), 12), "yyyy-MM-dd"),
    },
    {
      name: "Adobe Creative Cloud",
      cost: "54.99",
      cycle: "Monthly",
      renewalDate: format(addDays(new Date(), 20), "yyyy-MM-dd"),
    },
    {
      name: "Amazon Prime",
      cost: "139.00",
      cycle: "Yearly",
      renewalDate: format(addDays(new Date(), 120), "yyyy-MM-dd"),
    },
  ]);

  // Seed car services
  await db.insert(carServices).values([
    {
      type: "Service",
      km: 45000,
      notes: "Standard annual service",
      status: "Upcoming",
      date: format(addDays(new Date(), 30), "yyyy-MM-dd"),
    },
    {
      type: "Tyres",
      notes: "Check tyre pressure and tread",
      status: "Completed",
      date: format(addDays(new Date(), -60), "yyyy-MM-dd"),
    },
    {
      type: "Registration",
      date: format(addDays(new Date(), 15), "yyyy-MM-dd"),
      status: "Upcoming",
    },
  ]);

  console.log("Database seeded successfully!");
}

seed()
  .catch((error) => {
    console.error("Error seeding database:", error);
    process.exit(1);
  })
  .then(() => {
    process.exit(0);
  });
