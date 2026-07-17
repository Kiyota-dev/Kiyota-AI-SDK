#!/usr/bin/env node
import { readFile, rm } from "node:fs/promises";
import { resolve } from "node:path";

const cwd = process.cwd();
const marker = resolve(cwd, ".kiyota-prepack.json");

try {
  const contents = await readFile(marker, "utf8");
  const copied = JSON.parse(contents);
  for (const item of copied) {
    await rm(resolve(cwd, item), { recursive: true, force: true });
  }
  await rm(marker, { force: true });
} catch {
  // Marker missing — nothing to clean up.
}
