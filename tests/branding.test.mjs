import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);
const suppliedLogo = new URL(
  "../../Downloads/CitadelConsortiumLogo.png",
  import.meta.url,
);

async function sha256(path) {
  const bytes = await readFile(path);
  return createHash("sha256").update(bytes).digest("hex");
}

test("website logo is the exact supplied transparent artwork", async () => {
  const [expected, actual] = await Promise.all([
    sha256(suppliedLogo),
    sha256(new URL("public/assets/citadel-logo.png", projectRoot)),
  ]);

  assert.equal(actual, expected);
});

test("favicon uses the exact supplied artwork", async () => {
  const [expected, actual] = await Promise.all([
    sha256(suppliedLogo),
    sha256(new URL("public/assets/citadel-favicon.png", projectRoot)),
  ]);

  assert.equal(actual, expected);
});

test("transparent logo is not altered with blend modes", async () => {
  const css = await readFile(new URL("public/styles.css", projectRoot), "utf8");
  assert.doesNotMatch(css, /mix-blend-mode:\s*lighten/);
});

test("all document branding references the canonical logo assets", async () => {
  const html = await readFile(new URL("public/index.html", projectRoot), "utf8");

  assert.match(html, /rel="icon"[^>]+href="\/assets\/citadel-favicon\.png"/);
  assert.match(html, /rel="apple-touch-icon"[^>]+href="\/assets\/citadel-favicon\.png"/);
  assert.doesNotMatch(html, /<img[^>]+(?:logo|brand|crest)[^>]+src="(?!\/assets\/citadel-logo\.png)/i);
});
