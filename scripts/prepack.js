#!/usr/bin/env node
import { cp, stat, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";

const cwd = process.cwd();
const root = findMonorepoRoot(cwd);
const copied = [];

async function copyIfMissing(source, target) {
  try {
    await stat(target);
    return false;
  } catch {
    await cp(source, target, { recursive: true });
    return true;
  }
}

const readmeCopied = await copyIfMissing(
  resolve(root, "README.md"),
  resolve(cwd, "README.md"),
);
if (readmeCopied) copied.push("README.md");

const docsCopied = await copyIfMissing(
  resolve(root, "docs"),
  resolve(cwd, "docs"),
);
if (docsCopied) copied.push("docs");

await writeFile(
  resolve(cwd, ".kiyota-prepack.json"),
  JSON.stringify(copied, null, 2),
);

function findMonorepoRoot(start) {
  let dir = start;
  while (dir !== dirname(dir)) {
    const marker = resolve(dir, "pnpm-workspace.yaml");
    if (existsSync(marker)) {
      return dir;
    }
    dir = dirname(dir);
  }
  throw new Error("Could not find monorepo root (pnpm-workspace.yaml)");
}
