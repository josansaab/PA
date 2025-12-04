import type { Task, Bill, Subscription, Car, CarService, KidsEvent, Note, Grocery, InsertTask, InsertBill, InsertSubscription, InsertCar, InsertCarService, InsertKidsEvent, InsertGrocery } from "@shared/schema";

const API_BASE = "/api";

// Dashboard API
export type UpcomingPayment = { type: 'bill' | 'subscription'; item: Bill | Subscription };

export async function getUpcomingPayments(days: number = 14): Promise<UpcomingPayment[]> {
  const res = await fetch(`${API_BASE}/dashboard/upcoming-payments?days=${days}`);
  if (!res.ok) throw new Error("Failed to fetch upcoming payments");
  return res.json();
}

// Tasks API
export async function getTasks(): Promise<Task[]> {
  const res = await fetch(`${API_BASE}/tasks`);
  if (!res.ok) throw new Error("Failed to fetch tasks");
  return res.json();
}

export async function createTask(task: InsertTask): Promise<Task> {
  const res = await fetch(`${API_BASE}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  if (!res.ok) throw new Error("Failed to create task");
  return res.json();
}

export async function updateTask(id: number, task: Partial<InsertTask>): Promise<Task> {
  const res = await fetch(`${API_BASE}/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  if (!res.ok) throw new Error("Failed to update task");
  return res.json();
}

export async function deleteTask(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/tasks/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete task");
}

// Bills API
export async function getBills(): Promise<Bill[]> {
  const res = await fetch(`${API_BASE}/bills`);
  if (!res.ok) throw new Error("Failed to fetch bills");
  return res.json();
}

export async function createBill(bill: InsertBill): Promise<Bill> {
  const res = await fetch(`${API_BASE}/bills`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bill),
  });
  if (!res.ok) throw new Error("Failed to create bill");
  return res.json();
}

export async function updateBill(id: number, bill: Partial<InsertBill>): Promise<Bill> {
  const res = await fetch(`${API_BASE}/bills/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bill),
  });
  if (!res.ok) throw new Error("Failed to update bill");
  return res.json();
}

export async function deleteBill(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/bills/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete bill");
}

// Subscriptions API
export async function getSubscriptions(): Promise<Subscription[]> {
  const res = await fetch(`${API_BASE}/subscriptions`);
  if (!res.ok) throw new Error("Failed to fetch subscriptions");
  return res.json();
}

export async function createSubscription(subscription: InsertSubscription): Promise<Subscription> {
  const res = await fetch(`${API_BASE}/subscriptions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subscription),
  });
  if (!res.ok) throw new Error("Failed to create subscription");
  return res.json();
}

export async function updateSubscription(id: number, subscription: Partial<InsertSubscription>): Promise<Subscription> {
  const res = await fetch(`${API_BASE}/subscriptions/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subscription),
  });
  if (!res.ok) throw new Error("Failed to update subscription");
  return res.json();
}

export async function deleteSubscription(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/subscriptions/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete subscription");
}

// Cars API
export async function getCars(): Promise<Car[]> {
  const res = await fetch(`${API_BASE}/cars`);
  if (!res.ok) throw new Error("Failed to fetch cars");
  return res.json();
}

export async function createCar(car: InsertCar): Promise<Car> {
  const res = await fetch(`${API_BASE}/cars`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(car),
  });
  if (!res.ok) throw new Error("Failed to create car");
  return res.json();
}

export async function updateCar(id: number, car: Partial<InsertCar>): Promise<Car> {
  const res = await fetch(`${API_BASE}/cars/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(car),
  });
  if (!res.ok) throw new Error("Failed to update car");
  return res.json();
}

export async function deleteCar(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/cars/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete car");
}

// Car Services API
export async function getCarServices(): Promise<CarService[]> {
  const res = await fetch(`${API_BASE}/car-services`);
  if (!res.ok) throw new Error("Failed to fetch car services");
  return res.json();
}

export async function createCarService(service: InsertCarService): Promise<CarService> {
  const res = await fetch(`${API_BASE}/car-services`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(service),
  });
  if (!res.ok) throw new Error("Failed to create car service");
  return res.json();
}

export async function updateCarService(id: number, service: Partial<InsertCarService>): Promise<CarService> {
  const res = await fetch(`${API_BASE}/car-services/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(service),
  });
  if (!res.ok) throw new Error("Failed to update car service");
  return res.json();
}

export async function deleteCarService(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/car-services/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete car service");
}

// Kids Events API
export async function getKidsEvents(): Promise<KidsEvent[]> {
  const res = await fetch(`${API_BASE}/kids-events`);
  if (!res.ok) throw new Error("Failed to fetch kids events");
  return res.json();
}

export async function createKidsEvent(event: InsertKidsEvent): Promise<KidsEvent> {
  const res = await fetch(`${API_BASE}/kids-events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event),
  });
  if (!res.ok) throw new Error("Failed to create kids event");
  return res.json();
}

export async function updateKidsEvent(id: number, event: Partial<InsertKidsEvent>): Promise<KidsEvent> {
  const res = await fetch(`${API_BASE}/kids-events/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event),
  });
  if (!res.ok) throw new Error("Failed to update kids event");
  return res.json();
}

export async function deleteKidsEvent(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/kids-events/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete kids event");
}

// Notes API
export async function getNote(): Promise<Note> {
  const res = await fetch(`${API_BASE}/note`);
  if (!res.ok) throw new Error("Failed to fetch note");
  return res.json();
}

export async function updateNote(content: string): Promise<Note> {
  const res = await fetch(`${API_BASE}/note`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
  if (!res.ok) throw new Error("Failed to update note");
  return res.json();
}

// Groceries API
export async function getGroceries(): Promise<Grocery[]> {
  const res = await fetch(`${API_BASE}/groceries`);
  if (!res.ok) throw new Error("Failed to fetch groceries");
  return res.json();
}

export async function createGrocery(item: InsertGrocery): Promise<Grocery> {
  const res = await fetch(`${API_BASE}/groceries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });
  if (!res.ok) throw new Error("Failed to create grocery item");
  return res.json();
}

export async function updateGrocery(id: number, item: Partial<InsertGrocery>): Promise<Grocery> {
  const res = await fetch(`${API_BASE}/groceries/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });
  if (!res.ok) throw new Error("Failed to update grocery item");
  return res.json();
}

export async function deleteGrocery(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/groceries/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete grocery item");
}
