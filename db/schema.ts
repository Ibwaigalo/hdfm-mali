import {
  pgTable,
  serial,
  text,
  varchar,
  timestamp,
  boolean,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";

// Enums
export const roleEnum = pgEnum("role", ["ADMIN", "EDITOR"]);
export const statutEnum = pgEnum("statut", ["publie", "brouillon"]);
export const jourEnum = pgEnum("jour", [
  "lundi",
  "mardi",
  "mercredi",
  "jeudi",
  "vendredi",
  "samedi",
  "dimanche",
]);
export const sourceActuEnum = pgEnum("source_actu", [
  "UNICEF",
  "ReliefWeb",
  "OCHA",
  "UNHCR",
  "Autre",
]);

// Users (admin)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  nom: varchar("nom", { length: 100 }),
  role: roleEnum("role").default("EDITOR").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Emissions (importées depuis YouTube)
export const emissions = pgTable("emissions", {
  id: serial("id").primaryKey(),
  ytVideoId: varchar("yt_video_id", { length: 50 }).notNull().unique(),
  titre: text("titre").notNull(),
  description: text("description"),
  thumbnailUrl: text("thumbnail_url"),
  duree: varchar("duree", { length: 20 }), // format ISO 8601 PT#M#S
  publishedAt: timestamp("published_at").notNull(),
  syncedAt: timestamp("synced_at").defaultNow().notNull(),
  visible: boolean("visible").default(true).notNull(),
  categorie: varchar("categorie", { length: 100 }),
});

// Programme hebdomadaire
export const programme = pgTable("programme", {
  id: serial("id").primaryKey(),
  jour: jourEnum("jour").notNull(),
  heureDebut: varchar("heure_debut", { length: 5 }).notNull(), // "08:00"
  heureFin: varchar("heure_fin", { length: 5 }).notNull(),
  titreEmission: varchar("titre_emission", { length: 200 }).notNull(),
  animateur: varchar("animateur", { length: 100 }),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Actualités humanitaires (agrégées automatiquement)
export const actualites = pgTable("actualites", {
  id: serial("id").primaryKey(),
  titre: text("titre").notNull(),
  resume: text("resume"),
  imageUrl: text("image_url"),
  source: sourceActuEnum("source").notNull(),
  sourceUrl: text("source_url").notNull(),
  publieLe: timestamp("publie_le"),
  fetchedAt: timestamp("fetched_at").defaultNow().notNull(),
  guid: text("guid").unique(), // pour éviter les doublons RSS
});

// Messages auditeurs
export const messagesAuditeurs = pgTable("messages_auditeurs", {
  id: serial("id").primaryKey(),
  nom: varchar("nom", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }),
  message: text("message").notNull(),
  audioUrl: text("audio_url"),
  lu: boolean("lu").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Articles (blog / news radio)
export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  titre: text("titre").notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  contenu: text("contenu").notNull(),
  imageUrl: text("image_url"),
  categorie: varchar("categorie", { length: 100 }),
  statut: statutEnum("statut").default("brouillon").notNull(),
  auteurId: integer("auteur_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Messages contact
export const messagesContact = pgTable("messages_contact", {
  id: serial("id").primaryKey(),
  nom: varchar("nom", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  sujet: varchar("sujet", { length: 200 }),
  message: text("message").notNull(),
  lu: boolean("lu").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
