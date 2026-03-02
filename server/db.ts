import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, leads, InsertLead } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }

  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];
    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
    if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
    else if (user.openId === ENV.ownerOpenId) { values.role = 'admin'; updateSet.role = 'admin'; }
    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot get user: database not available"); return undefined; }
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ─── Lead Qualification Score ─────────────────────────────────────────────────
function computeQualificationScore(data: InsertLead): { score: number; tier: "hot" | "warm" | "cold" } {
  let score = 0;

  // Ability signals (highest weight — 50 points)
  if (data.budgetRange === "25m+") score += 20;
  else if (data.budgetRange === "18-25m") score += 15;
  else if (data.budgetRange === "12-18m") score += 10;
  else if (data.budgetRange === "9-12m") score += 5;

  if (data.downPaymentReady === "ready_now") score += 20;
  else if (data.downPaymentReady === "ready_2weeks") score += 15;
  else if (data.downPaymentReady === "ready_month") score += 8;
  else score += 2;

  if (data.financingMethod === "cash") score += 10;
  else if (data.financingMethod === "installment") score += 7;
  else score += 4;

  // Need signals (30 points)
  if (data.timeline === "launch") score += 15;
  else if (data.timeline === "q2_2026") score += 10;
  else if (data.timeline === "year") score += 5;
  else score += 1;

  if (data.unitType === "Penthouse" || data.unitType === "4 Bed") score += 10;
  else if (data.unitType === "3 Bed") score += 7;
  else score += 4;

  if (data.useCase === "investment" || data.useCase === "mixed") score += 5;
  else score += 3;

  // Desire signals (20 points)
  if (data.personalityType === "achiever" || data.personalityType === "visionary") score += 10;
  else score += 5;

  if (data.primaryMotivation === "investment") score += 10;
  else if (data.primaryMotivation === "lifestyle") score += 7;
  else score += 4;

  const tier: "hot" | "warm" | "cold" = score >= 70 ? "hot" : score >= 40 ? "warm" : "cold";
  return { score: Math.min(score, 100), tier };
}

// ─── Lead CRUD ────────────────────────────────────────────────────────────────
export async function createLead(data: InsertLead): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { score, tier } = computeQualificationScore(data);

  const [result] = await db.insert(leads).values({
    ...data,
    qualificationScore: score,
    qualificationTier: tier,
    source: "landing_page",
  });

  return (result as { insertId: number }).insertId;
}

export async function getAllLeads() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(leads).orderBy(leads.createdAt);
}
