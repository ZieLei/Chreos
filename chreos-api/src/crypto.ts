import "dotenv/config";
import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import type { Debtor, NewDebtor } from "./types/types.js";

export const ALGORITHM = "aes-256-gcm";

// Stored as `v1:<iv>:<auth tag>:<ciphertext>` (base64) so the format can change later
const PREFIX = "v1";
const IV_LENGTH = 12; // 96-bit IV, the recommended size for GCM

// Personal info is encrypted. Amounts/dates stay plain so SQL can still sum them.
export const ENCRYPTED_FIELDS = [
  "picture",
  "firstName",
  "lastName",
  "birthday",
  "phoneNumber",
  "email",
  "facebook",
] as const satisfies readonly (keyof Debtor)[];

const loadKey = (): Buffer => {
  const hex = process.env.ENCRYPTION_KEY;

  if (!hex || !/^[0-9a-f]{64}$/i.test(hex)) {
    throw new Error(
      "ENCRYPTION_KEY must be set in .env as 64 hex characters (32 bytes). " +
        `Generate one with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`,
    );
  }

  return Buffer.from(hex, "hex");
};

const key = loadKey();

export const encrypt = (plaintext: string): string => {
  // A fresh random IV per value: the same email never encrypts to the same text twice
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const ciphertext = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);

  return [
    PREFIX,
    iv.toString("base64"),
    cipher.getAuthTag().toString("base64"),
    ciphertext.toString("base64"),
  ].join(":");
};

export const isEncrypted = (value: string): boolean =>
  value.startsWith(`${PREFIX}:`);

export const decrypt = (value: string): string => {
  // Rows written before encryption was added are still plain text
  if (!isEncrypted(value)) return value;

  const [, iv, tag, ciphertext] = value.split(":");
  if (!iv || !tag || ciphertext === undefined) {
    throw new Error("Malformed encrypted value");
  }

  const decipher = createDecipheriv(ALGORITHM, key, Buffer.from(iv, "base64"));
  // GCM checks the auth tag, so a tampered value throws instead of decrypting to garbage
  decipher.setAuthTag(Buffer.from(tag, "base64"));

  return Buffer.concat([
    decipher.update(Buffer.from(ciphertext, "base64")),
    decipher.final(),
  ]).toString("utf8");
};

export const encryptDebtor = <T extends Partial<NewDebtor>>(debtor: T): T => {
  const encrypted: Record<string, unknown> = { ...debtor };

  for (const field of ENCRYPTED_FIELDS) {
    const value = encrypted[field];
    if (typeof value === "string") {
      encrypted[field] = encrypt(value);
    }
  }

  return encrypted as T;
};

export const decryptDebtor = (debtor: Debtor): Debtor => {
  const decrypted = { ...debtor };

  for (const field of ENCRYPTED_FIELDS) {
    const value = decrypted[field];
    if (typeof value === "string") {
      decrypted[field] = decrypt(value);
    }
  }

  return decrypted;
};
