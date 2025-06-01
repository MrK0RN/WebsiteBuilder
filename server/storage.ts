import {
  users,
  materials,
  vendors,
  materialVendors,
  favorites,
  type User,
  type UpsertUser,
  type Material,
  type InsertMaterial,
  type Vendor,
  type InsertVendor,
  type MaterialVendor,
  type InsertMaterialVendor,
  type Favorite,
  type InsertFavorite,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, ilike, gte, lte, desc, asc } from "drizzle-orm";

export interface MaterialSearchFilters {
  materialType?: string;
  manufacturer?: string;
  meltingTempMin?: number;
  meltingTempMax?: number;
  tensileStrengthMin?: number;
  tensileStrengthMax?: number;
  mfrMin?: number;
  mfrMax?: number;
  densityMin?: number;
  densityMax?: number;
  impactStrengthMin?: number;
  impactStrengthMax?: number;
  fdaApproved?: boolean;
  ul94Rating?: string;
  color?: string;
  search?: string;
}

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Material operations
  getMaterials(filters?: MaterialSearchFilters, limit?: number, offset?: number): Promise<Material[]>;
  getMaterialById(id: number): Promise<Material | undefined>;
  createMaterial(material: InsertMaterial): Promise<Material>;
  updateMaterial(id: number, material: Partial<InsertMaterial>): Promise<Material>;
  deleteMaterial(id: number): Promise<void>;
  
  // Vendor operations
  getVendors(): Promise<Vendor[]>;
  createVendor(vendor: InsertVendor): Promise<Vendor>;
  
  // Material-Vendor operations
  getMaterialVendors(materialId: number): Promise<(MaterialVendor & { vendor: Vendor })[]>;
  createMaterialVendor(materialVendor: InsertMaterialVendor): Promise<MaterialVendor>;
  
  // Favorites operations
  getUserFavorites(userId: string): Promise<(Favorite & { material: Material })[]>;
  addFavorite(favorite: InsertFavorite): Promise<Favorite>;
  removeFavorite(userId: string, materialId: number): Promise<void>;
  isFavorite(userId: string, materialId: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User operations (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Material operations
  async getMaterials(filters?: MaterialSearchFilters, limit = 50, offset = 0): Promise<Material[]> {
    let query = db.select().from(materials);
    
    const conditions = [];
    
    if (filters) {
      if (filters.materialType) {
        conditions.push(eq(materials.materialType, filters.materialType));
      }
      if (filters.manufacturer) {
        conditions.push(eq(materials.manufacturer, filters.manufacturer));
      }
      if (filters.meltingTempMin) {
        conditions.push(gte(materials.meltingTemperature, filters.meltingTempMin.toString()));
      }
      if (filters.meltingTempMax) {
        conditions.push(lte(materials.meltingTemperature, filters.meltingTempMax.toString()));
      }
      if (filters.tensileStrengthMin) {
        conditions.push(gte(materials.tensileStrength, filters.tensileStrengthMin.toString()));
      }
      if (filters.tensileStrengthMax) {
        conditions.push(lte(materials.tensileStrength, filters.tensileStrengthMax.toString()));
      }
      if (filters.mfrMin) {
        conditions.push(gte(materials.mfr, filters.mfrMin.toString()));
      }
      if (filters.mfrMax) {
        conditions.push(lte(materials.mfr, filters.mfrMax.toString()));
      }
      if (filters.densityMin) {
        conditions.push(gte(materials.density, filters.densityMin.toString()));
      }
      if (filters.densityMax) {
        conditions.push(lte(materials.density, filters.densityMax.toString()));
      }
      if (filters.impactStrengthMin) {
        conditions.push(gte(materials.impactStrength, filters.impactStrengthMin.toString()));
      }
      if (filters.impactStrengthMax) {
        conditions.push(lte(materials.impactStrength, filters.impactStrengthMax.toString()));
      }
      if (filters.fdaApproved !== undefined) {
        conditions.push(eq(materials.fdaApproved, filters.fdaApproved));
      }
      if (filters.ul94Rating) {
        conditions.push(eq(materials.ul94Rating, filters.ul94Rating));
      }
      if (filters.color) {
        conditions.push(eq(materials.color, filters.color));
      }
      if (filters.search) {
        conditions.push(ilike(materials.name, `%${filters.search}%`));
      }
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return await query
      .orderBy(desc(materials.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async getMaterialById(id: number): Promise<Material | undefined> {
    const [material] = await db.select().from(materials).where(eq(materials.id, id));
    return material;
  }

  async createMaterial(material: InsertMaterial): Promise<Material> {
    const [newMaterial] = await db.insert(materials).values(material).returning();
    return newMaterial;
  }

  async updateMaterial(id: number, material: Partial<InsertMaterial>): Promise<Material> {
    const [updatedMaterial] = await db
      .update(materials)
      .set({ ...material, updatedAt: new Date() })
      .where(eq(materials.id, id))
      .returning();
    return updatedMaterial;
  }

  async deleteMaterial(id: number): Promise<void> {
    await db.delete(materials).where(eq(materials.id, id));
  }

  // Vendor operations
  async getVendors(): Promise<Vendor[]> {
    return await db.select().from(vendors).orderBy(asc(vendors.name));
  }

  async createVendor(vendor: InsertVendor): Promise<Vendor> {
    const [newVendor] = await db.insert(vendors).values(vendor).returning();
    return newVendor;
  }

  // Material-Vendor operations
  async getMaterialVendors(materialId: number): Promise<(MaterialVendor & { vendor: Vendor })[]> {
    return await db
      .select()
      .from(materialVendors)
      .innerJoin(vendors, eq(materialVendors.vendorId, vendors.id))
      .where(eq(materialVendors.materialId, materialId))
      .then(results => 
        results.map(result => ({
          ...result.material_vendors,
          vendor: result.vendors
        }))
      );
  }

  async createMaterialVendor(materialVendor: InsertMaterialVendor): Promise<MaterialVendor> {
    const [newMaterialVendor] = await db
      .insert(materialVendors)
      .values(materialVendor)
      .returning();
    return newMaterialVendor;
  }

  // Favorites operations
  async getUserFavorites(userId: string): Promise<(Favorite & { material: Material })[]> {
    return await db
      .select()
      .from(favorites)
      .innerJoin(materials, eq(favorites.materialId, materials.id))
      .where(eq(favorites.userId, userId))
      .orderBy(desc(favorites.createdAt))
      .then(results =>
        results.map(result => ({
          ...result.favorites,
          material: result.materials
        }))
      );
  }

  async addFavorite(favorite: InsertFavorite): Promise<Favorite> {
    const [newFavorite] = await db.insert(favorites).values(favorite).returning();
    return newFavorite;
  }

  async removeFavorite(userId: string, materialId: number): Promise<void> {
    await db
      .delete(favorites)
      .where(and(eq(favorites.userId, userId), eq(favorites.materialId, materialId)));
  }

  async isFavorite(userId: string, materialId: number): Promise<boolean> {
    const [favorite] = await db
      .select()
      .from(favorites)
      .where(and(eq(favorites.userId, userId), eq(favorites.materialId, materialId)));
    return !!favorite;
  }
}

export const storage = new DatabaseStorage();
