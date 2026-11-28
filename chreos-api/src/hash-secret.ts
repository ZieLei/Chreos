import { randomBytes, scryptSync } from "node:crypto";
import { text } from "node:stream/consumers";

// Prints the SECRET_HASH line for .env. Reads the secret from stdin so it
// doesn't end up in shell history or the process list:
//   npm run auth:hash-secret   (then type the secret and press Ctrl+D)
const secret = (await text(process.stdin)).trim();

if (!secret) {
  console.error("No secret given on stdin");
  process.exit(1);
}

const salt = randomBytes(16);
const hash = scryptSync(secret, salt, 32);

console.log(
  `SECRET_HASH=scrypt:${salt.toString("base64")}:${hash.toString("base64")}`,
);
