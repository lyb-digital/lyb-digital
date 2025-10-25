import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, articles, pillars, newsletterSubscriptions } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
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
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
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

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Content management queries
export async function getPillarBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(pillars).where(eq(pillars.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllPillars() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(pillars);
}

export async function getArticleBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(articles).where(eq(articles.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getArticlesByPillarId(pillarId: number, limit: number = 10) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(articles)
    .where(eq(articles.pillarId, pillarId))
    .orderBy(desc(articles.publishedAt))
    .limit(limit);
}

export async function getFeaturedArticles(limit: number = 3) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(articles)
    .where(eq(articles.isFeatured, 1))
    .orderBy(desc(articles.publishedAt))
    .limit(limit);
}

export async function getLatestArticles(limit: number = 10) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(articles)
    .orderBy(desc(articles.publishedAt))
    .limit(limit);
}

export async function subscribeNewsletter(email: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  try {
    await db.insert(newsletterSubscriptions).values({ email });
    return true;
  } catch (error: any) {
    if (error.code === "ER_DUP_ENTRY") {
      // Email already exists, try to reactivate
      await db.update(newsletterSubscriptions)
        .set({ unsubscribedAt: null })
        .where(eq(newsletterSubscriptions.email, email));
      return true;
    }
    throw error;
  }
}

