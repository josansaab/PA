import type { Task, Bill, Subscription, CarService, Note, InsertTask, InsertBill, InsertSubscription, InsertCarService } from "@shared/schema";

const API_BASE = "/api";

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
