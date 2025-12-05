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

  // Unifi Protect API with Cloud API Key authentication
  interface UnifiCamera {
    id: string;
    mac: string;
    name: string;
    model: string;
    ip: string;
    status: string;
    hostId: string;
  }

  let cachedCameras: UnifiCamera[] = [];
  let cacheTime = 0;

  const getUnifiDevices = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      const apiKey = process.env.UNIFI_PROTECT_API_KEY;

      if (!apiKey) {
        reject(new Error("Unifi Protect API key not configured"));
        return;
      }

      const options = {
        hostname: 'api.ui.com',
        port: 443,
        path: '/v1/devices',
        method: 'GET',
        headers: {
          'X-API-Key': apiKey,
          'Accept': 'application/json'
        }
      };

      const req = https.request(options, (response) => {
        let data = '';
        response.on('data', chunk => data += chunk);
        response.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch {
            reject(new Error("Failed to parse response"));
          }
        });
      });

      req.on('error', reject);
      req.setTimeout(15000, () => {
        req.destroy();
        reject(new Error("Request timeout"));
      });
      req.end();
    });
  };

  const getLocalSnapshot = (host: string, cameraId: string): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: host,
        port: 443,
        path: `/proxy/protect/api/cameras/${cameraId}/snapshot`,
        method: 'GET',
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

      if (!apiKey) {
        return res.json({ configured: false, connected: false });
      }

      try {
        const devices = await getUnifiDevices();
        const hasData = devices && devices.data && devices.data.length > 0;
        res.json({ configured: true, connected: hasData, host: host || 'cloud' });
      } catch (err: any) {
        console.error("Unifi status check failed:", err.message);
        res.json({ configured: true, connected: false, error: err.message });
      }
    } catch (error) {
      res.json({ configured: false, connected: false, error: "Connection failed" });
    }
  });

  // Get all cameras
  app.get("/api/unifi/cameras", async (req, res) => {
    try {
      // Use cache if less than 30 seconds old
      if (cachedCameras.length > 0 && Date.now() - cacheTime < 30000) {
        return res.json(cachedCameras);
      }

      const devices = await getUnifiDevices();
      
      if (!devices || !devices.data) {
        console.error("No device data returned from Unifi API");
        return res.json([]);
      }

      // Extract cameras (productLine = "protect") from all hosts
      const cameras: UnifiCamera[] = [];
      for (const host of devices.data) {
        if (host.devices) {
          for (const device of host.devices) {
            if (device.productLine === 'protect') {
              cameras.push({
                id: device.id || device.mac,
                mac: device.mac,
                name: device.name,
                model: device.model,
                ip: device.ip,
                status: device.status,
                hostId: host.hostId
              });
            }
          }
        }
      }

      cachedCameras = cameras;
      cacheTime = Date.now();

      const result = cameras.map(camera => ({
        id: camera.id,
        name: camera.name,
        type: camera.model,
        state: camera.status,
        isConnected: camera.status === 'online'
      }));

      res.json(result);
    } catch (error: any) {
      console.error("Failed to fetch cameras:", error.message);
      res.json([]);
    }
  });

  // Get camera snapshot (requires local access)
  app.get("/api/unifi/cameras/:id/snapshot", async (req, res) => {
    try {
      const host = process.env.UNIFI_PROTECT_HOST;
      
      if (!host) {
        return res.status(503).json({ error: "Local Unifi host not configured for snapshots" });
      }

      // Find camera IP from cache
      const camera = cachedCameras.find(c => c.id === req.params.id || c.mac === req.params.id);
      
      const snapshot = await getLocalSnapshot(host, req.params.id);
      
      if (!snapshot || snapshot.length === 0) {
        return res.status(500).json({ error: "Failed to get snapshot" });
      }

      res.set("Content-Type", "image/jpeg");
      res.set("Cache-Control", "no-cache, no-store, must-revalidate");
      res.send(snapshot);
    } catch (error: any) {
      console.error("Failed to get snapshot:", error.message);
      res.status(500).json({ error: "Failed to get snapshot" });
    }
  });

  return httpServer;
}
