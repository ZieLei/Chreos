import { eq } from "drizzle-orm";
import { db } from "./index.js";
import { debtors } from "./schema.js";
import { ENCRYPTED_FIELDS, encrypt, isEncrypted } from "../crypto.js";

// One-off migration: encrypts debtor rows that were saved before encryption existed.
// Already encrypted values are skipped, so it's safe to run more than once.
let updated = 0;

db.transaction((tx) => {
  for (const debtor of tx.select().from(debtors).all()) {
    const changes: Partial<typeof debtor> = {};

    for (const field of ENCRYPTED_FIELDS) {
      const value = debtor[field];
      if (typeof value === "string" && !isEncrypted(value)) {
        changes[field] = encrypt(value);
      }
    }

    if (Object.keys(changes).length === 0) continue;

    tx.update(debtors).set(changes).where(eq(debtors.id, debtor.id)).run();
    updated++;
  }
});

console.log(`Encrypted ${updated} debtor(s).`);
