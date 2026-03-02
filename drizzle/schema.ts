import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── Marina Towers Leads Table ────────────────────────────────────────────────
export const leads = mysqlTable("leads", {
  id: int("id").autoincrement().primaryKey(),

  // Contact
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  email: varchar("email", { length: 320 }),

  // DNA Qualification: Desire
  personalityType: varchar("personalityType", { length: 50 }),   // achiever | visionary | security | explorer
  primaryMotivation: varchar("primaryMotivation", { length: 100 }), // investment | lifestyle | residence | legacy
  dreamLifestyle: varchar("dreamLifestyle", { length: 100 }),     // yacht | resort | mountain | community

  // DNA Qualification: Need
  useCase: varchar("useCase", { length: 100 }),                   // personal | investment | mixed | family
  timeline: varchar("timeline", { length: 100 }),                 // launch | q2_2026 | year | exploring
  unitType: varchar("unitType", { length: 50 }),                  // Studio | 1 Bed | 2 Bed | 3 Bed | 4 Bed | Penthouse

  // DNA Qualification: Ability
  budgetRange: varchar("budgetRange", { length: 50 }),            // 9-12m | 12-18m | 18-25m | 25m+
  downPaymentReady: varchar("downPaymentReady", { length: 100 }), // ready_now | ready_2weeks | ready_month | need_info
  financingMethod: varchar("financingMethod", { length: 100 }),   // cash | installment | mortgage | mixed

  // Qualification Score (computed server-side)
  qualificationScore: int("qualificationScore").default(0),       // 0-100
  qualificationTier: mysqlEnum("qualificationTier", ["hot", "warm", "cold"]).default("cold"),

  // Attribution (UTM)
  utmSource: varchar("utmSource", { length: 100 }),    // e.g. facebook, google
  utmMedium: varchar("utmMedium", { length: 100 }),    // e.g. cpc, paid_social
  utmCampaign: varchar("utmCampaign", { length: 255 }), // e.g. marina_launch_march

  // Meta
  source: varchar("source", { length: 100 }).default("landing_page"),
  agreeToContact: int("agreeToContact").default(1),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;
