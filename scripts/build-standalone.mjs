/**
 * Inlines fonts and logo artwork into the meeting-prep sheet so it can be
 * hosted, emailed or opened with no sibling files.
 *
 * Three outputs, same source:
 *   exports/<name>.standalone.html  full document, opens in any browser
 *   exports/<name>.artifact.html    head/body fragment for a hosted page
 *   site/                           what GitHub Pages serves, build output
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

// The Pages site. This is prep material on a public URL, so it is served
// unlisted: search engines are asked not to index it, and nothing links to
// it. Anyone given the link can still read it. Remove the robots directives
// if this is ever meant to be found.
const siteDir = join(root, "site");
const noindex = '<meta name="robots" content="noindex, nofollow">';
const sitePage = html.replace("<title>", `${noindex}\n<title>`);

if (!sitePage.includes(noindex)) {
  console.error("Could not add the noindex directive to the hosted page.");
  process.exit(1);
}

mkdirSync(siteDir, { recursive: true });
writeFileSync(join(siteDir, "index.html"), sitePage);
writeFileSync(join(siteDir, "robots.txt"), "User-agent: *\nDisallow: /\n");

const kb = (dir, name) => Math.round(readFileSync(join(dir, name)).length / 1024);
console.log(`Inlined ${fonts} fonts and ${logos} logo.`);
console.log(`  exports/${stem}.standalone.html  ${kb(outDir, `${stem}.standalone.html`)} KB`);
console.log(`  exports/${stem}.artifact.html    ${kb(outDir, `${stem}.artifact.html`)} KB`);
console.log(`  site/index.html                  ${kb(siteDir, "index.html")} KB  (noindex)`);
