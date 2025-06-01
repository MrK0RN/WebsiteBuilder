import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertMaterialSchema, insertVendorSchema, insertMaterialVendorSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Material routes
  app.get('/api/materials', async (req, res) => {
    try {
      const filters = {
        materialType: req.query.materialType as string,
        manufacturer: req.query.manufacturer as string,
        meltingTempMin: req.query.meltingTempMin ? Number(req.query.meltingTempMin) : undefined,
        meltingTempMax: req.query.meltingTempMax ? Number(req.query.meltingTempMax) : undefined,
        tensileStrengthMin: req.query.tensileStrengthMin ? Number(req.query.tensileStrengthMin) : undefined,
        tensileStrengthMax: req.query.tensileStrengthMax ? Number(req.query.tensileStrengthMax) : undefined,
        mfrMin: req.query.mfrMin ? Number(req.query.mfrMin) : undefined,
        mfrMax: req.query.mfrMax ? Number(req.query.mfrMax) : undefined,
        densityMin: req.query.densityMin ? Number(req.query.densityMin) : undefined,
        densityMax: req.query.densityMax ? Number(req.query.densityMax) : undefined,
        impactStrengthMin: req.query.impactStrengthMin ? Number(req.query.impactStrengthMin) : undefined,
        impactStrengthMax: req.query.impactStrengthMax ? Number(req.query.impactStrengthMax) : undefined,
        fdaApproved: req.query.fdaApproved === 'true',
        ul94Rating: req.query.ul94Rating as string,
        color: req.query.color as string,
        search: req.query.search as string,
      };

      const limit = req.query.limit ? Number(req.query.limit) : 50;
      const offset = req.query.offset ? Number(req.query.offset) : 0;

      const materials = await storage.getMaterials(filters, limit, offset);
      res.json(materials);
    } catch (error) {
      console.error("Error fetching materials:", error);
      res.status(500).json({ message: "Failed to fetch materials" });
    }
  });

  app.get('/api/materials/:id', async (req, res) => {
    try {
      const id = Number(req.params.id);
      const material = await storage.getMaterialById(id);
      
      if (!material) {
        return res.status(404).json({ message: "Material not found" });
      }
      
      res.json(material);
    } catch (error) {
      console.error("Error fetching material:", error);
      res.status(500).json({ message: "Failed to fetch material" });
    }
  });

  app.post('/api/materials', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertMaterialSchema.parse(req.body);
      const material = await storage.createMaterial(validatedData);
      res.status(201).json(material);
    } catch (error) {
      console.error("Error creating material:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create material" });
    }
  });

  app.put('/api/materials/:id', isAuthenticated, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const validatedData = insertMaterialSchema.partial().parse(req.body);
      const material = await storage.updateMaterial(id, validatedData);
      res.json(material);
    } catch (error) {
      console.error("Error updating material:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update material" });
    }
  });

  app.delete('/api/materials/:id', isAuthenticated, async (req, res) => {
    try {
      const id = Number(req.params.id);
      await storage.deleteMaterial(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting material:", error);
      res.status(500).json({ message: "Failed to delete material" });
    }
  });

  // Material vendors routes
  app.get('/api/materials/:id/vendors', async (req, res) => {
    try {
      const materialId = Number(req.params.id);
      const vendors = await storage.getMaterialVendors(materialId);
      res.json(vendors);
    } catch (error) {
      console.error("Error fetching material vendors:", error);
      res.status(500).json({ message: "Failed to fetch vendors" });
    }
  });

  app.post('/api/materials/:id/vendors', isAuthenticated, async (req, res) => {
    try {
      const materialId = Number(req.params.id);
      const validatedData = insertMaterialVendorSchema.parse({
        ...req.body,
        materialId,
      });
      const materialVendor = await storage.createMaterialVendor(validatedData);
      res.status(201).json(materialVendor);
    } catch (error) {
      console.error("Error creating material vendor:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create material vendor" });
    }
  });

  // Vendor routes
  app.get('/api/vendors', async (req, res) => {
    try {
      const vendors = await storage.getVendors();
      res.json(vendors);
    } catch (error) {
      console.error("Error fetching vendors:", error);
      res.status(500).json({ message: "Failed to fetch vendors" });
    }
  });

  app.post('/api/vendors', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertVendorSchema.parse(req.body);
      const vendor = await storage.createVendor(validatedData);
      res.status(201).json(vendor);
    } catch (error) {
      console.error("Error creating vendor:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create vendor" });
    }
  });

  // Favorites routes
  app.get('/api/favorites', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const favorites = await storage.getUserFavorites(userId);
      res.json(favorites);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      res.status(500).json({ message: "Failed to fetch favorites" });
    }
  });

  app.post('/api/favorites', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { materialId } = req.body;
      
      if (!materialId) {
        return res.status(400).json({ message: "Material ID is required" });
      }

      const favorite = await storage.addFavorite({ userId, materialId: Number(materialId) });
      res.status(201).json(favorite);
    } catch (error) {
      console.error("Error adding favorite:", error);
      res.status(500).json({ message: "Failed to add favorite" });
    }
  });

  app.delete('/api/favorites/:materialId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const materialId = Number(req.params.materialId);
      
      await storage.removeFavorite(userId, materialId);
      res.status(204).send();
    } catch (error) {
      console.error("Error removing favorite:", error);
      res.status(500).json({ message: "Failed to remove favorite" });
    }
  });

  app.get('/api/favorites/:materialId/check', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const materialId = Number(req.params.materialId);
      
      const isFavorite = await storage.isFavorite(userId, materialId);
      res.json({ isFavorite });
    } catch (error) {
      console.error("Error checking favorite:", error);
      res.status(500).json({ message: "Failed to check favorite" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
