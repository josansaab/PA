import { addDays, format } from "date-fns";

export type Task = {
  id: string;
  title: string;
  category: "Work" | "Home" | "Business" | "Bills" | "Car" | "Personal";
  dueDate: string;
  completed: boolean;
  priority: "Low" | "Medium" | "High";
};

export type Bill = {
  id: string;
  provider: string;
  amount: number;
  dueDate: string;
  status: "Paid" | "Due" | "Overdue";
  lastPaid?: string;
};

export type Subscription = {
  id: string;
  name: string;
  cost: number;
  cycle: "Monthly" | "Yearly";
  renewalDate: string;
  logo?: string;
};

export type CarService = {
  id: string;
  type: "Service" | "Tyres" | "Registration" | "Insurance";
  date?: string;
  km?: number;
  notes?: string;
  status: "Upcoming" | "Completed" | "Overdue";
};

export const MOCK_TASKS: Task[] = [
  {
    id: "1",
    title: "Review quarterly budget",
    category: "Work",
    dueDate: format(new Date(), "yyyy-MM-dd"),
    completed: false,
    priority: "High",
  },
  {
    id: "2",
    title: "Buy groceries for dinner",
    category: "Home",
    dueDate: format(new Date(), "yyyy-MM-dd"),
    completed: false,
    priority: "Medium",
  },
  {
    id: "3",
    title: "Call insurance company",
    category: "Car",
    dueDate: format(addDays(new Date(), 1), "yyyy-MM-dd"),
    completed: false,
    priority: "Medium",
  },
  {
    id: "4",
    title: "Cancel Netflix subscription",
    category: "Bills",
    dueDate: format(addDays(new Date(), 2), "yyyy-MM-dd"),
    completed: true,
    priority: "Low",
  },
  {
    id: "5",
    title: "Prepare presentation slides",
    category: "Business",
    dueDate: format(addDays(new Date(), 3), "yyyy-MM-dd"),
    completed: false,
    priority: "High",
  },
];

export const MOCK_BILLS: Bill[] = [
  {
    id: "1",
    provider: "Electric Company",
    amount: 145.50,
    dueDate: format(addDays(new Date(), 2), "yyyy-MM-dd"),
    status: "Due",
  },
  {
    id: "2",
    provider: "Water Corp",
    amount: 89.20,
    dueDate: format(addDays(new Date(), -2), "yyyy-MM-dd"),
    status: "Overdue",
  },
  {
    id: "3",
    provider: "Internet Provider",
    amount: 79.99,
    dueDate: format(addDays(new Date(), 15), "yyyy-MM-dd"),
    status: "Paid",
    lastPaid: format(addDays(new Date(), -15), "yyyy-MM-dd"),
  },
];

export const MOCK_SUBSCRIPTIONS: Subscription[] = [
  {
    id: "1",
    name: "Netflix",
    cost: 15.99,
    cycle: "Monthly",
    renewalDate: format(addDays(new Date(), 5), "yyyy-MM-dd"),
  },
  {
    id: "2",
    name: "Spotify",
    cost: 9.99,
    cycle: "Monthly",
    renewalDate: format(addDays(new Date(), 12), "yyyy-MM-dd"),
  },
  {
    id: "3",
    name: "Adobe Creative Cloud",
    cost: 54.99,
    cycle: "Monthly",
    renewalDate: format(addDays(new Date(), 20), "yyyy-MM-dd"),
  },
  {
    id: "4",
    name: "Amazon Prime",
    cost: 139.00,
    cycle: "Yearly",
    renewalDate: format(addDays(new Date(), 120), "yyyy-MM-dd"),
  },
];

export const MOCK_CAR_SERVICES: CarService[] = [
  {
    id: "1",
    type: "Service",
    km: 45000,
    notes: "Standard annual service",
    status: "Upcoming",
    date: format(addDays(new Date(), 30), "yyyy-MM-dd"),
  },
  {
    id: "2",
    type: "Tyres",
    notes: "Check tyre pressure and tread",
    status: "Completed",
    date: format(addDays(new Date(), -60), "yyyy-MM-dd"),
  },
  {
    id: "3",
    type: "Registration",
    date: format(addDays(new Date(), 15), "yyyy-MM-dd"),
    status: "Upcoming",
  },
];
