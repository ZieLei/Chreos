import "dotenv/config";
import {
  createHash,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";
import { and, eq, gt, lte } from "drizzle-orm";
import type { RequestHandler } from "express";
import { db } from "./db/index.js";
import { sessions } from "./db/schema.js";

const SESSION_TTL_MS = 12 * 60 * 60 * 1000;
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MS = 60 * 1000;

// ---------- Secret ----------

// `scrypt:<salt>:<hash>` (base64), made by `npm run auth:hash-secret`.
// The secret itself is never stored anywhere.
const loadSecretHash = () => {
  const [scheme, salt, hash] = (process.env.SECRET_HASH ?? "").split(":");

  if (scheme !== "scrypt" || !salt || !hash) {
    throw new Error(
      "SECRET_HASH must be set in .env. Generate it with: npm run auth:hash-secret",
    );
  }

  return {
    salt: Buffer.from(salt, "base64"),
    hash: Buffer.from(hash, "base64"),
  };
};

const secretHash = loadSecretHash();

export const verifySecret = (secret: string): boolean => {
  const attempt = scryptSync(secret, secretHash.salt, secretHash.hash.length);
  // Constant time, so response timing doesn't leak how close a guess was
  return timingSafeEqual(attempt, secretHash.hash);
};

// ---------- Brute force protection ----------

const failedAttempts = new Map<
  string,
  { count: number; lockedUntil: number }
>();

// Milliseconds left on a lockout, 0 when the client may try again
export const lockoutRemaining = (client: string): number =>
  Math.max((failedAttempts.get(client)?.lockedUntil ?? 0) - Date.now(), 0);

export const recordFailedAttempt = (client: string) => {
  const count = (failedAttempts.get(client)?.count ?? 0) + 1;

  if (count >= MAX_FAILED_ATTEMPTS) {
    failedAttempts.set(client, {
      count: 0,
      lockedUntil: Date.now() + LOCKOUT_MS,
    });
  } else {
    failedAttempts.set(client, { count, lockedUntil: 0 });
  }
};

export const clearFailedAttempts = (client: string) => {
  failedAttempts.delete(client);
};

// ---------- Sessions ----------

const hashToken = (token: string) =>
  createHash("sha256").update(token).digest("hex");

export const createSession = () => {
  const now = Date.now();

  // Housekeeping: drop sessions that already expired
  db.delete(sessions).where(lte(sessions.expiresAt, now)).run();

  const token = randomBytes(32).toString("base64url");
  const expiresAt = now + SESSION_TTL_MS;

  db.insert(sessions)
    .values({ tokenHash: hashToken(token), createdAt: now, expiresAt })
    .run();

  return { token, expiresAt };
};

export const deleteSession = (token: string) => {
  db.delete(sessions)
    .where(eq(sessions.tokenHash, hashToken(token)))
    .run();
};

const bearerToken = (header: string | undefined) =>
  header?.match(/^Bearer (.+)$/)?.[1] ?? null;

export const requireAuth: RequestHandler = (req, res, next) => {
  const token = bearerToken(req.get("authorization"));

  const session = token
    ? db
        .select()
        .from(sessions)
        .where(
          and(
            eq(sessions.tokenHash, hashToken(token)),
            gt(sessions.expiresAt, Date.now()),
          ),
        )
        .get()
    : undefined;

  if (!token || !session) {
    res.status(401).json({ message: "Not logged in" });
    return;
  }

  res.locals.token = token;
  next();
};
