// Run with: node scripts/check-second.mjs
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
const page = read("app/second/page.tsx");
assert.match(page, /@\/components\/home\/hero-stack/);
assert.equal((page.match(/@\/components\/home\//g) ?? []).length, 1);
const sections = ["whats-on", "guests", "apparel", "cafe", "footer"].map((name) => read(`components/second/${name}.tsx`));
for (const section of sections) {
  assert.doesNotMatch(section, /Draggable|scrub:|pin:|rotation:|rotate-|className="hl"/);
}
const [posters, guests, apparel, cafe, footer] = sections;
assert.match(posters, /overflow-x-auto overflow-y-hidden/);
assert.match(posters, /scrollBy/);
assert.match(posters, /prefers-reduced-motion: reduce/);
assert.match(guests, /grid-cols-2.*lg:grid-cols-4/);
assert.match(apparel, /group-focus-visible:opacity-100/);
assert.match(cafe, /onFocus=\{\(\) => setPeek\(i\)\}/);
assert.match(cafe, /motion-reduce:transition-none/);
assert.match(footer, /addEventListener\("pointermove", onMove\)/);
assert.match(footer, /removeEventListener\("pointermove", onMove\)/);
assert.doesNotMatch(footer, /onEnter|gsap\.from/);
assert.match(footer, /prefers-reduced-motion: no-preference/);
console.log("/second restraint and interaction contracts pass.");
