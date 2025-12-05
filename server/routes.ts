import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTaskSchema, insertBillSchema, insertSubscriptionSchema, insertCarSchema, insertCarServiceSchema, insertKidsEventSchema, insertGrocerySchema } from "@shared/schema";
import { fromError } from "zod-validation-error";
import https from "https";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Dashboard - Upcoming Payments
  app.get("/api/dashboard/upcoming-payments", async (req, res) => {
    try {
      const days = parseInt(req.query.days as string) || 14;
      const payments = await storage.getUpcomingPayments(days);
      res.json(payments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch upcoming payments" });
    }
  });

  // Tasks API
  app.get("/api/tasks", async (req, res) => {
    try {
      const tasks = await storage.getTasks();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  });

  app.post("/api/tasks", async (req, res) => {
    try {
      const result = insertTaskSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: fromError(result.error).toString() });
      }
      const task = await storage.createTask(result.data);
      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ error: "Failed to create task" });
    }
  });

  app.patch("/api/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const task = await storage.updateTask(id, req.body);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: "Failed to update task" });
    }
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteTask(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete task" });
    }
  });

  // Bills API
  app.get("/api/bills", async (req, res) => {
    try {
      const bills = await storage.getBills();
      res.json(bills);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch bills" });
    }
  });

  app.post("/api/bills", async (req, res) => {
    try {
      const result = insertBillSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: fromError(result.error).toString() });
      }
      const bill = await storage.createBill(result.data);
      res.status(201).json(bill);
    } catch (error) {
      res.status(500).json({ error: "Failed to create bill" });
    }
  });

  app.patch("/api/bills/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const bill = await storage.updateBill(id, req.body);
      if (!bill) {
        return res.status(404).json({ error: "Bill not found" });
      }
      res.json(bill);
    } catch (error) {
      res.status(500).json({ error: "Failed to update bill" });
    }
  });

  app.delete("/api/bills/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteBill(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete bill" });
    }
  });

  // Subscriptions API
  app.get("/api/subscriptions", async (req, res) => {
    try {
      const subscriptions = await storage.getSubscriptions();
      res.json(subscriptions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch subscriptions" });
    }
  });

  app.post("/api/subscriptions", async (req, res) => {
    try {
      const result = insertSubscriptionSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: fromError(result.error).toString() });
      }
      const subscription = await storage.createSubscription(result.data);
      res.status(201).json(subscription);
    } catch (error) {
      res.status(500).json({ error: "Failed to create subscription" });
    }
  });

  app.patch("/api/subscriptions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const subscription = await storage.updateSubscription(id, req.body);
      if (!subscription) {
        return res.status(404).json({ error: "Subscription not found" });
      }
      res.json(subscription);
    } catch (error) {
      res.status(500).json({ error: "Failed to update subscription" });
    }
  });

  app.delete("/api/subscriptions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteSubscription(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete subscription" });
    }
  });

  // Cars API
  app.get("/api/cars", async (req, res) => {
    try {
      const cars = await storage.getCars();
      res.json(cars);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cars" });
    }
  });

  app.post("/api/cars", async (req, res) => {
    try {
      const result = insertCarSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: fromError(result.error).toString() });
      }
      const car = await storage.createCar(result.data);
      res.status(201).json(car);
    } catch (error) {
      res.status(500).json({ error: "Failed to create car" });
    }
  });

  app.patch("/api/cars/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const car = await storage.updateCar(id, req.body);
      if (!car) {
        return res.status(404).json({ error: "Car not found" });
      }
      res.json(car);
    } catch (error) {
      res.status(500).json({ error: "Failed to update car" });
    }
  });

  app.delete("/api/cars/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteCar(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete car" });
    }
  });

  // Car Services API
  app.get("/api/car-services", async (req, res) => {
    try {
      const services = await storage.getCarServices();
      res.json(services);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch car services" });
    }
  });

  app.post("/api/car-services", async (req, res) => {
    try {
      const result = insertCarServiceSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: fromError(result.error).toString() });
      }
      const service = await storage.createCarService(result.data);
      res.status(201).json(service);
    } catch (error) {
      res.status(500).json({ error: "Failed to create car service" });
    }
  });

  app.patch("/api/car-services/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const service = await storage.updateCarService(id, req.body);
      if (!service) {
        return res.status(404).json({ error: "Car service not found" });
      }
      res.json(service);
    } catch (error) {
      res.status(500).json({ error: "Failed to update car service" });
    }
  });

  app.delete("/api/car-services/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteCarService(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete car service" });
    }
  });

  // Kids Events API
  app.get("/api/kids-events", async (req, res) => {
    try {
      const events = await storage.getKidsEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch kids events" });
    }
  });

  app.post("/api/kids-events", async (req, res) => {
    try {
      const result = insertKidsEventSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: fromError(result.error).toString() });
      }
      const event = await storage.createKidsEvent(result.data);
      res.status(201).json(event);
    } catch (error) {
      res.status(500).json({ error: "Failed to create kids event" });
    }
  });

  app.patch("/api/kids-events/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const event = await storage.updateKidsEvent(id, req.body);
      if (!event) {
        return res.status(404).json({ error: "Kids event not found" });
      }
      res.json(event);
    } catch (error) {
      res.status(500).json({ error: "Failed to update kids event" });
    }
  });

  app.delete("/api/kids-events/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteKidsEvent(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete kids event" });
    }
  });

  // Notes API
  app.get("/api/note", async (req, res) => {
    try {
      const note = await storage.getNote();
      res.json(note);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch note" });
    }
  });

  app.put("/api/note", async (req, res) => {
    try {
      const { content } = req.body;
      if (typeof content !== "string") {
        return res.status(400).json({ error: "Content must be a string" });
      }
      const note = await storage.updateNote(content);
      res.json(note);
    } catch (error) {
      res.status(500).json({ error: "Failed to update note" });
    }
  });

  // Groceries API
  app.get("/api/groceries", async (req, res) => {
    try {
      const groceries = await storage.getGroceries();
      res.json(groceries);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch groceries" });
    }
  });

  app.post("/api/groceries", async (req, res) => {
    try {
      const result = insertGrocerySchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: fromError(result.error).toString() });
      }
      const grocery = await storage.createGrocery(result.data);
      res.status(201).json(grocery);
    } catch (error) {
      res.status(500).json({ error: "Failed to create grocery item" });
    }
  });

  app.patch("/api/groceries/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const grocery = await storage.updateGrocery(id, req.body);
      if (!grocery) {
        return res.status(404).json({ error: "Grocery item not found" });
      }
      res.json(grocery);
    } catch (error) {
      res.status(500).json({ error: "Failed to update grocery item" });
    }
  });

  app.delete("/api/groceries/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteGrocery(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete grocery item" });
    }
  });

  // Unifi Protect API with API Key authentication
  const makeUnifiRequest = (path: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      const host = process.env.UNIFI_PROTECT_HOST;
      const apiKey = process.env.UNIFI_PROTECT_API_KEY;

      if (!host || !apiKey) {
        reject(new Error("Unifi Protect not configured"));
        return;
      }

      const options = {
        hostname: host,
        port: 443,
        path: path,
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/json'
        },
        rejectUnauthorized: false
      };

      const req = https.request(options, (response) => {
        let data = '';
        response.on('data', chunk => data += chunk);
        response.on('end', () => {
          try {
            if (response.headers['content-type']?.includes('application/json')) {
              resolve(JSON.parse(data));
            } else {
              resolve(data);
            }
          } catch {
            resolve(data);
          }
        });
      });

      req.on('error', reject);
      req.setTimeout(10000, () => {
        req.destroy();
        reject(new Error("Request timeout"));
      });
      req.end();
    });
  };

  const getUnifiSnapshot = (path: string): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
      const host = process.env.UNIFI_PROTECT_HOST;
      const apiKey = process.env.UNIFI_PROTECT_API_KEY;

      if (!host || !apiKey) {
        reject(new Error("Unifi Protect not configured"));
        return;
      }

      const options = {
        hostname: host,
        port: 443,
        path: path,
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`
        },
        rejectUnauthorized: false
      };

      const req = https.request(options, (response) => {
        const chunks: Buffer[] = [];
        response.on('data', chunk => chunks.push(chunk));
        response.on('end', () => resolve(Buffer.concat(chunks)));
      });

      req.on('error', reject);
      req.setTimeout(10000, () => {
        req.destroy();
        reject(new Error("Request timeout"));
      });
      req.end();
    });
  };

  // Check if Unifi Protect is configured
  app.get("/api/unifi/status", async (req, res) => {
    try {
      const host = process.env.UNIFI_PROTECT_HOST;
      const apiKey = process.env.UNIFI_PROTECT_API_KEY;

      if (!host || !apiKey) {
        return res.json({ configured: false, connected: false });
      }

      try {
        await makeUnifiRequest('/proxy/protect/api/bootstrap');
        res.json({ configured: true, connected: true, host });
      } catch {
        res.json({ configured: true, connected: false, host });
      }
    } catch (error) {
      res.json({ configured: false, connected: false, error: "Connection failed" });
    }
  });

  // Get all cameras
  app.get("/api/unifi/cameras", async (req, res) => {
    try {
      const bootstrap = await makeUnifiRequest('/proxy/protect/api/bootstrap');
      
      if (!bootstrap || !bootstrap.cameras) {
        return res.json([]);
      }

      const cameras = bootstrap.cameras.map((camera: any) => ({
        id: camera.id,
        name: camera.name,
        type: camera.type,
        state: camera.state,
        isConnected: camera.isConnected
      }));

      res.json(cameras);
    } catch (error) {
      console.error("Failed to fetch cameras:", error);
      res.json([]);
    }
  });

  // Get camera snapshot
  app.get("/api/unifi/cameras/:id/snapshot", async (req, res) => {
    try {
      const snapshot = await getUnifiSnapshot(`/proxy/protect/api/cameras/${req.params.id}/snapshot`);
      
      if (!snapshot || snapshot.length === 0) {
        return res.status(500).json({ error: "Failed to get snapshot" });
      }

      res.set("Content-Type", "image/jpeg");
      res.set("Cache-Control", "no-cache, no-store, must-revalidate");
      res.send(snapshot);
    } catch (error) {
      console.error("Failed to get snapshot:", error);
      res.status(500).json({ error: "Failed to get snapshot" });
    }
  });

  return httpServer;
}
