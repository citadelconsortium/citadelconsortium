import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("v2 pushes synchronize Netlify's production branch", async () => {
  const workflow = await readFile(
    new URL("../.github/workflows/sync-netlify-production.yml", import.meta.url),
    "utf8",
  );

  assert.match(workflow, /branches:\s*\[v2\]/);
  assert.match(workflow, /git push origin HEAD:main/);
});
