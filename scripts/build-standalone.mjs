/**
 * Inlines fonts and logo artwork into the meeting-prep sheet so it can be
 * hosted, emailed or opened with no sibling files.
 *
 * Two outputs, same source:
 *   exports/<name>.standalone.html  full document, opens in any browser
 *   exports/<name>.artifact.html    head/body fragment for a hosted page
 *
 * Never hand-edit the exports. Change the source in meeting-prep/ or this
 * script, then run `node scripts/build-standalone.mjs`.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = join(root, "meeting-prep", "2026-07-30-fulton-hogan-cheat-sheet.html");
const outDir = join(root, "exports");
const stem = basename(source, ".html");

const dataUri = (path, mime) =>
  `data:${mime};base64,${readFileSync(join(root, path)).toString("base64")}`;

let html = readFileSync(source, "utf8");

// Fonts: ../assets/fonts/x.woff2 -> data URI. Self-hosting is a brand rule,
// and a hosted page blocks external font requests outright.
let fonts = 0;
html = html.replace(/url\('\.\.\/(assets\/fonts\/[^']+\.woff2)'\)/g, (_, p) => {
  fonts += 1;
  return `url('${dataUri(p, "font/woff2")}')`;
});

// Logo: the approved lockup is embedded as supplied, never redrawn.
let logos = 0;
html = html.replace(/src="\.\.\/(assets\/logo\/[^"]+\.svg)"/g, (_, p) => {
  logos += 1;
  return `src="${dataUri(p, "image/svg+xml")}"`;
});

if (fonts === 0 || logos === 0) {
  console.error(`Expected fonts and logo to inline, found ${fonts} fonts and ${logos} logos.`);
  process.exit(1);
}

if (/\.\.\//.test(html)) {
  console.error("A relative reference survived inlining. The output would break when hosted.");
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, `${stem}.standalone.html`), html);

// The hosted page supplies its own document skeleton, so strip ours and keep
// the title, styles and content.
const title = html.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? "";
const style = html.match(/<style>[\s\S]*?<\/style>/)?.[0] ?? "";
const body = html.match(/<body>([\s\S]*?)<\/body>/)?.[1]?.trim() ?? "";

if (!title || !style || !body) {
  console.error("Could not split the source into title, style and body.");
  process.exit(1);
}

writeFileSync(
  join(outDir, `${stem}.artifact.html`),
  `<title>${title}</title>\n${style}\n\n${body}\n`
);

const kb = (name) => Math.round(readFileSync(join(outDir, name)).length / 1024);
console.log(`Inlined ${fonts} fonts and ${logos} logo.`);
console.log(`  exports/${stem}.standalone.html  ${kb(`${stem}.standalone.html`)} KB`);
console.log(`  exports/${stem}.artifact.html    ${kb(`${stem}.artifact.html`)} KB`);
