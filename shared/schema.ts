import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  decimal,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Materials table
export const materials = pgTable("materials", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  manufacturer: varchar("manufacturer", { length: 255 }).notNull(),
  materialType: varchar("material_type", { length: 50 }).notNull(), // ABS, PLA, PETG, etc.
  description: text("description"),
  imageUrl: varchar("image_url"),
  
  // Mechanical Properties
  tensileStrength: decimal("tensile_strength", { precision: 8, scale: 2 }), // MPa
  flexuralStrength: decimal("flexural_strength", { precision: 8, scale: 2 }), // MPa
  impactStrength: decimal("impact_strength", { precision: 8, scale: 2 }), // kJ/m²
  elongationAtBreak: decimal("elongation_at_break", { precision: 8, scale: 2 }), // %
  
  // Thermal Properties
  meltingTemperature: decimal("melting_temperature", { precision: 8, scale: 2 }), // °C
  heatDeflectionTemp: decimal("heat_deflection_temp", { precision: 8, scale: 2 }), // °C
  vicatSofteningPoint: decimal("vicat_softening_point", { precision: 8, scale: 2 }), // °C
  thermalExpansion: decimal("thermal_expansion", { precision: 12, scale: 8 }), // /°C
  
  // Physical Properties
  density: decimal("density", { precision: 8, scale: 3 }), // g/cm³
  mfr: decimal("mfr", { precision: 8, scale: 2 }), // g/10 min (Melt Flow Rate)
  waterAbsorption: decimal("water_absorption", { precision: 8, scale: 2 }), // %
  shoreHardness: integer("shore_hardness"),
  
  // Color and Appearance
  color: varchar("color", { length: 100 }),
  transparency: varchar("transparency", { length: 50 }), // transparent, translucent, opaque
  
  // Certifications
  fdaApproved: boolean("fda_approved").default(false),
  ul94Rating: varchar("ul94_rating", { length: 10 }), // V-0, V-1, V-2, HB
  rohsCompliant: boolean("rohs_compliant").default(false),
  reachCompliant: boolean("reach_compliant").default(false),
  
  // Documentation
  technicalDataSheetUrl: varchar("technical_data_sheet_url"),
  safetyDataSheetUrl: varchar("safety_data_sheet_url"),
  processingGuidelinesUrl: varchar("processing_guidelines_url"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Vendors table
export const vendors = pgTable("vendors", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  website: varchar("website"),
  contactEmail: varchar("contact_email"),
  contactPhone: varchar("contact_phone"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Material-Vendor pricing relationship
export const materialVendors = pgTable("material_vendors", {
  id: serial("id").primaryKey(),
  materialId: integer("material_id").notNull().references(() => materials.id),
  vendorId: integer("vendor_id").notNull().references(() => vendors.id),
  price: decimal("price", { precision: 10, scale: 2 }), // price per kg
  currency: varchar("currency", { length: 3 }).default("USD"),
  minimumOrder: decimal("minimum_order", { precision: 10, scale: 2 }), // kg
  availability: varchar("availability", { length: 50 }).default("in_stock"),
  productUrl: varchar("product_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User favorites
export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  materialId: integer("material_id").notNull().references(() => materials.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  favorites: many(favorites),
}));

export const materialsRelations = relations(materials, ({ many }) => ({
  vendors: many(materialVendors),
  favorites: many(favorites),
}));

export const vendorsRelations = relations(vendors, ({ many }) => ({
  materials: many(materialVendors),
}));

export const materialVendorsRelations = relations(materialVendors, ({ one }) => ({
  material: one(materials, {
    fields: [materialVendors.materialId],
    references: [materials.id],
  }),
  vendor: one(vendors, {
    fields: [materialVendors.vendorId],
    references: [vendors.id],
  }),
}));

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, {
    fields: [favorites.userId],
    references: [users.id],
  }),
  material: one(materials, {
    fields: [favorites.materialId],
    references: [materials.id],
  }),
}));

// Schemas for validation
export const insertMaterialSchema = createInsertSchema(materials).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertVendorSchema = createInsertSchema(vendors).omit({
  id: true,
  createdAt: true,
});

export const insertMaterialVendorSchema = createInsertSchema(materialVendors).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFavoriteSchema = createInsertSchema(favorites).omit({
  id: true,
  createdAt: true,
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Material = typeof materials.$inferSelect;
export type InsertMaterial = z.infer<typeof insertMaterialSchema>;
export type Vendor = typeof vendors.$inferSelect;
export type InsertVendor = z.infer<typeof insertVendorSchema>;
export type MaterialVendor = typeof materialVendors.$inferSelect;
export type InsertMaterialVendor = z.infer<typeof insertMaterialVendorSchema>;
export type Favorite = typeof favorites.$inferSelect;
export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
