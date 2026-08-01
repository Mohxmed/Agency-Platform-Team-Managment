import fs from "fs";
import { createPrivateKey } from "crypto";

const raw = fs.readFileSync("test-key.pem", "utf8").replace(/\r\n/g, "\n");
const lines = raw.split("\n");
const badLine = lines.findIndex((l) => l.length !== 64 && !l.startsWith("-----") && l.trim() !== "");

console.log("Bad line index:", badLine, "len:", lines[badLine].length);

for (let j = 0; j < lines[badLine].length; j++) {
  const candidate = lines[badLine].slice(0, j) + lines[badLine].slice(j + 1);
  const candidatePem = [
    "-----BEGIN PRIVATE KEY-----",
    ...lines.slice(1, badLine),
    candidate,
    ...lines.slice(badLine + 1, -1),
    "-----END PRIVATE KEY-----",
  ].join("\n");
  try {
    const k = createPrivateKey(candidatePem);
    console.log(`VALID at removing char ${j} (${lines[badLine][j]}):`, candidate);
    console.log("Key type:", k.asymmetricKeyType);
    break;
  } catch {
    // invalid, try next
  }
}
