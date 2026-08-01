import fs from "fs";
import { createPrivateKey, createPublicKey, sign, verify } from "crypto";

const raw = fs.readFileSync("test-key.pem", "utf8").replace(/\r\n/g, "\n");
const lines = raw.split("\n");
const badLine = lines.findIndex((l) => l.length !== 64 && !l.startsWith("-----") && l.trim() !== "");

const corrected = lines[badLine].slice(1);
const pem = [
  "-----BEGIN PRIVATE KEY-----",
  ...lines.slice(1, badLine),
  corrected,
  ...lines.slice(badLine + 1, -1),
  "-----END PRIVATE KEY-----",
].join("\n");

const key = createPrivateKey(pem);
console.log("Key OK:", key.asymmetricKeyType);
const pub = createPublicKey(key);
console.log("Public key OK");

const data = Buffer.from("no2ta-test-message");
const sig = sign("sha256", data, key);
const ok = verify("sha256", data, pub, sig);
console.log("Sign/verify roundtrip:", ok ? "PASS" : "FAIL");

// sanity: modulus length
console.log("Modulus bits:", key.asymmetricKeyDetails.modulusLength);
