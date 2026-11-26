import "dotenv/config";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema.js";

const dbFile = process.env.DB_FILE_NAME ?? "data/chreos.db";
mkdirSync(dirname(dbFile), { recursive: true });

const sqlite = new Database(dbFile);
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON"); // SQLite leaves foreign keys off by default

export const db = drizzle({ client: sqlite, schema });
