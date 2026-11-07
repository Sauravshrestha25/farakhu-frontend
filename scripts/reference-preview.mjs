import fs from 'node:fs';

// Preview keeps the authorized source DOM and choreography intact.
let html = fs.readFileSync('/tmp/voyeur-reference.html', 'utf8');
html = html.replace(/#ee3335/gi, '#003636');
const experiences = [
  ['Specialty coffee', 'A specialty coffee shop in Samakhusi, Kathmandu. A place to pause, meet a friend and settle into the day.'],
  ['Apparel', 'Clothing is part of Farakchu too. An apparel line for carrying a little of this place into everyday life.'],
  ['Entertainment', 'Music, events and shared experiences bring another side of Farakchu to life.'],
  ['Community space', 'A local space to spend time together, meet familiar faces and make new connections.'],
  ['Kathmandu', 'Rooted in Kathmandu, Nepal, Farakchu brings hospitality and creative expression into one place.'],
  ['Samakhusi', 'Our neighbourhood is part of who we are. Find Farakchu in Samakhusi, Kathmandu.'],
  ['Coffee together', 'Come for a coffee and stay for the conversation. The coffee shop is a meeting point for the community.'],
  ['Wear Farakchu', 'Explore the apparel side of the brand, alongside the coffee, entertainment and community that shape it.'],
  ['Shared moments', 'Entertainment gives us more reasons to get together and experience something as a community.'],
  ['Local connections', 'Farakchu is a space for the people around it, whether you are stopping in or spending the afternoon.'],
  ['Creative living', 'Coffee, clothing and entertainment are connected parts of the same creative lifestyle.'],
  ['Come through', 'Visit us in Samakhusi. For questions about the cafe, apparel or events, message @farakchu on Instagram.'],
];
let historyHeading = 0;
let historyBody = 0;
let meaningBody = 0;
let pillarBody = 0;
html = html.replace(/<(h[1-3]|p)\b([^>]*)>([\s\S]*?)<\/\1>/g, (whole, tag, attrs, inner) => {
  let copy;
  if (attrs.includes('history_step_heading')) copy = experiences[historyHeading++][0];
  else if (attrs.includes('history_p ')) copy = experiences[historyBody++][1];
  else if (attrs.includes('history_conclustion_heading')) copy = 'Coffee.<br/>Apparel.<br/>Entertainment.<br/>Community.';
  else if (attrs.includes('history_conclusion_p')) copy = 'A creative lifestyle and hospitality brand, rooted in Kathmandu, Nepal.';
  else if (attrs.includes('history_heading')) copy = 'A place for everyday life in Kathmandu';
  else if (attrs.includes('about_heading')) copy = 'Farakchu is a creative lifestyle and hospitality brand based in Kathmandu, Nepal.';
  else if (attrs.includes('about_p ')) copy = 'We bring together a specialty coffee shop, an apparel line, entertainment and a local community space in Samakhusi.';
  else if (tag === 'p' && attrs === ' class="u-p1"' && meaningBody < 2) copy = ['Different. A name that expresses our own way of living, creating and coming together.', 'I am. Together, Farak Chu means I am different.'][meaningBody++];
  else if (tag === 'p' && !attrs && !inner.includes('browser')) copy = experiences[pillarBody++ % 4][1];
  return copy === undefined ? whole : `<${tag}${attrs}>${copy}</${tag}>`;
});
html = html.replace(/Who Believed The Camera/g, 'Coffee, apparel and entertainment').replace(/Should be a[^<]*Witness Rather Than an[^<]*Authority/g, 'A local space to come together');
const replacements = [
  ['THE ART OF OBSERVATION', 'THE ART OF DIFFERENCE'],
  ['OBSERVATION', 'DIFFERENCE'],
  ['Voyeur Verite', 'Farakchu'], ['Voyeur Vérité', 'Farakchu'],
  ['Voyeur', 'Farak'], ['Vérité', 'Chu'],
  ['The Symphony', 'Live Sessions'], ['Dance', 'Music'], ['Stand Up', 'Game Night'],
  ['Truth', 'Energy'], ['Humility', 'Community'], ['Grit', 'Play'], ['Evolve', 'Create'],
  ['Films', 'Events'], ['Lineage', 'Our house'], ['VV Collection 001', 'Farakchu Apparel'],
  ['Creative', 'Lifestyle'], ['Studio', 'Hospitality'], ['creative', 'lifestyle'], ['studio', 'hospitality'],
  ['Symphony', 'Rhythm'], ['Film:', 'Experience:'], ['VV', 'Farakchu'], ['vv', 'fc'],
];
html = html.replace(/>([^<>]+)</g, (match, text) => {
  let result = text;
  for (const [from, to] of replacements) result = result.replaceAll(from, to);
  return `>${result}<`;
});
const photos = ['storefront-day', 'apparel-kid', 'apparel-storefront', 'storefront-day'];
let photo = 0;
html = html.replace(/<image\b[^>]*>/g, tag => tag.replace(/href="[^"]*"/, `href="/images/home/${photos[photo++ % photos.length]}.jpg"`));
html = html.replace(/<img\b[^>]*>/g, tag => {
  if (tag.includes('footer_logo')) return tag.replace(/\s+srcset="[^"]*"/g, '').replace(/src="[^"]*"/, 'src="/images/logo/logo.svg"').replace(/alt="[^"]*"/, 'alt="Farakchu"');
  const name = tag.includes('hero_bg') ? 'storefront-day' : photos[photo++ % photos.length];
  return tag.replace(/\s+srcset="[^"]*"/g, '').replace(/src="[^"]*"/, `src="/images/home/${name}.jpg"`);
});
html = html.replace(/<video\b[\s\S]*?<\/video>/g, () => `<img src="/images/home/${photos[photo++ % photos.length]}.jpg" style="width:100%;height:100%;object-fit:cover" alt="Farakchu" />`);
html = html.replace(/href="\/(?:the-symphony-of-dance|stand-up|privacy-policy)[^"]*"/g, 'href="https://www.instagram.com/farakchu/" target="_blank"');
const logo = fs.readFileSync('public/images/logo/logo.svg', 'utf8').replace('fill="#fff"', 'fill="currentColor"');
html = html.replace(/<svg\b[^>]*class="nav_logo"[^>]*>[\s\S]*?<\/svg>/g, logo.replace('<svg ', '<svg class="nav_logo" role="img" aria-label="Farakchu" '));
html = html.replace(/<svg\b[^>]*class="footer_logo difference"[^>]*>[\s\S]*?<\/svg>/g, logo.replace('<svg ', '<svg class="footer_logo difference" role="img" aria-label="Farakchu" '));
html = html.replace('</head>', '<style>.navbar_logo .nav_logo{width:64px;height:64px}.footer_logo_wrapper svg.footer_logo{width:100%;height:clamp(200px,35vw,480px);color:#f1ece1;mix-blend-mode:normal}.footer_logo.mobile{object-fit:contain}</style></head>');
html = html.replaceAll('https://www.instagram.com/voyeurverite/', 'https://www.instagram.com/farakchu/');
html = html.replace(/<svg\b[^>]*class="(?:footer_logo difference|about_logo)"[^>]*>[\s\S]*?<\/svg>/g, '<div class="farakchu-wordmark" aria-label="Farakchu">Farakchu</div>');
html = html.replace(/<img\b[^>]*class="footer_logo difference mobile"[^>]*>/g, '');
html = html.replace('</head>', '<style>.farakchu-wordmark{width:100%;font-family:Arial,sans-serif;font-size:clamp(48px,18vw,300px);font-weight:900;line-height:1.1;letter-spacing:-.065em;text-align:center;color:var(--vv-off-white)}.about_logo_wrapper .farakchu-wordmark{color:var(--vv-red)}</style></head>');
html = html.replace('</head>', '<style>:root{--vv-red:#003636;--vv-off-white:#f1ece1;--vv-black:#001f1f;--vv-gray:#0c4a48}</style></head>');
html = html.replace('</head>', '<style>:root{--farakchu-accent:#88ed05}.u-btn-ellipse.primary{background-color:var(--farakchu-accent);color:#003636}.u-link:hover,.navbar_nav_mobile_item:hover{color:var(--farakchu-accent)}.history_steps_nav_item_fill,.preloader_loader_fill{background-color:var(--farakchu-accent)}::selection{background:var(--farakchu-accent);color:#003636}.u-btn-ellipse:focus-visible,.u-link:focus-visible{outline:2px solid var(--farakchu-accent);outline-offset:4px}</style></head>');
// Solid brand ink avoids the source blend layers shifting green back toward red.
html = html.replace('</head>', '<style>.hero_heading,.hero_heading.u-h1-review.blend{color:#003636!important;mix-blend-mode:normal!important}.hero_heading.u-h1-review.blend{visibility:hidden!important}.hero_bg{filter:brightness(1.18) saturate(.65);object-position:center 25%}.hero_overlay{background:rgba(241,236,225,.25)!important}</style></head>');
html = html.replace('</body>', `<script>document.addEventListener('submit',function(e){e.preventDefault();window.open('https://ig.me/m/farakchu','_blank')},true);</script></body>`);
html = html.replace('</head>', `<style>
/* Farakchu navigation: solid contrast keeps the diamond visible over every section. */
.u-navbar{top:16px!important;left:16px!important;right:16px!important;width:auto!important;mix-blend-mode:normal!important;color:#f1ece1!important}
.navbar_container{max-width:1160px!important;width:100%!important;margin:0 auto!important;padding:0!important}
.navbar_nav{display:flex!important;align-items:center!important;justify-content:flex-end!important;gap:30px!important;min-height:88px;padding:10px 22px!important;background:#003636;border:1px solid #0c4a48;border-radius:18px;box-shadow:0 8px 30px #001f1f26}
.navbar_logo{order:-1!important;position:static!important;transform:none!important;margin:0 auto 0 0!important;display:flex!important;align-items:center!important;gap:12px!important;color:#f1ece1!important;width:auto!important}
.navbar_logo .nav_logo{display:block!important;width:64px!important;height:64px!important;flex:none;opacity:1!important;visibility:visible!important}
.navbar_logo::after{content:'Farakchu';font:800 21px Arial,sans-serif;letter-spacing:-.7px}
.navbar_nav>.u-link{color:#f1ece1;font:500 13px Arial,sans-serif;text-transform:none;letter-spacing:0;white-space:nowrap}
.navbar_nav>.u-link:hover{color:#88ed05}
.navbar_nav>.navbar_mobile_link{display:block!important;border-radius:999px;background:#88ed05;color:#003636!important;padding:13px 22px}
.navbar_nav>.navbar_mobile_link div{font-size:0}.navbar_nav>.navbar_mobile_link div::after{content:'Explore apparel';font:700 12px Arial,sans-serif}
.u-menu-btn{color:#f1ece1!important}
.navbar_logo:focus-visible,.navbar_nav a:focus-visible{outline:2px solid #88ed05;outline-offset:4px}
@media(max-width:767px){.u-navbar{top:10px!important;left:10px!important;right:10px!important}.navbar_nav{min-height:76px;padding:8px 14px!important;gap:14px!important;border-radius:14px}.navbar_logo .nav_logo{width:52px!important;height:52px!important}.navbar_logo::after{font-size:18px}.navbar_nav>.navbar_mobile_link{display:none!important}.u-menu-btn{padding:12px!important;border:1px solid #f1ece155;border-radius:999px}}
</style></head>`);
html = html.replace('</head>', `<style>
.u-navbar{top:12px!important;left:24px!important;right:24px!important}
.navbar_container{max-width:none!important}
.navbar_nav{background:transparent!important;border:0!important;border-radius:0!important;box-shadow:none!important;padding:0!important;gap:28px!important}
.navbar_logo{color:#003636!important}
.navbar_logo::after{content:none!important}
.navbar_logo .nav_logo{width:80px!important;height:80px!important;filter:drop-shadow(0 0 5px #f1ece1)}
.navbar_nav>.u-link,.u-menu-btn{color:#003636!important;text-shadow:0 0 8px #f1ece1,0 0 4px #f1ece1}
.navbar_nav>.navbar_mobile_link{background:transparent!important;border-radius:0!important;padding:0!important}
.navbar_nav>.navbar_mobile_link div::after{content:'Apparel';font:500 13px Arial,sans-serif}
.navbar_nav>.u-link:hover{color:#0c4a48!important;text-decoration:underline;text-underline-offset:5px}
@media(max-width:767px){.u-navbar{top:10px!important;left:16px!important;right:16px!important}.navbar_logo .nav_logo{width:64px!important;height:64px!important}.u-menu-btn{border:0!important;border-radius:0!important;padding:12px 0!important}}
</style></head>`);
html = html.replace('</head>', '<style>.section_hero,.hero_container{background:#f1ece1!important}.hero_bg{object-fit:contain!important;object-position:center!important;transform:none!important;scale:1!important}</style></head>');
html = html.replace('</head>', '<style>.section_footer .farakchu-wordmark{text-transform:uppercase}</style></head>');
html = html.replace('</body>', `<script>
(() => {
  const footer = document.querySelector('.section_footer');
  const wordmark = footer?.querySelector('.farakchu-wordmark');
  if (!wordmark || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  wordmark.innerHTML = '<svg viewBox="0 0 1000 190" role="img" aria-label="Farakchu" style="display:block;width:100%;overflow:visible"><defs><filter id="footer-warp" x="-15%" y="-50%" width="130%" height="200%"><feTurbulence type="fractalNoise" baseFrequency="0.008 0.02" numOctaves="2" seed="7"/><feDisplacementMap in="SourceGraphic" scale="0" xChannelSelector="R" yChannelSelector="G"/></filter></defs><text x="500" y="155" text-anchor="middle" textLength="960" lengthAdjust="spacingAndGlyphs" fill="currentColor" filter="url(#footer-warp)" style="font:900 170px Arial,sans-serif;letter-spacing:-6px">Farakchu</text></svg>';
  wordmark.querySelector('text').textContent = 'FARAKCHU';
  const displacement = wordmark.querySelector('feDisplacementMap');
  let frame;
  let amount = 0;
  let target = 0;
  let lastTime = 0;
  const tick = (time) => {
    const delta = Math.min((time - lastTime) / 16.67 || 1, 3);
    lastTime = time;
    amount += (target - amount) * (1 - Math.pow(.85, delta));
    target *= Math.pow(.94, delta);
    displacement.setAttribute('scale', amount.toFixed(2));
    if (amount > .1 || target > .1) frame = requestAnimationFrame(tick);
    else { frame = null; displacement.setAttribute('scale', '0'); }
  };
  const pulse = (value) => { target = value; if (!frame) { lastTime = 0; frame = requestAnimationFrame(tick); } };
  wordmark.addEventListener('pointermove', (event) => pulse(Math.min(100, 15 + Math.hypot(event.movementX, event.movementY) * 4)));
  wordmark.addEventListener('pointerleave', () => { target = 0; });
  const observer = new IntersectionObserver((entries) => {
    if (entries.some(entry => entry.isIntersecting)) { pulse(110); observer.disconnect(); }
  }, { threshold: .25 });
  observer.observe(wordmark);
})();
</script></body>`);
fs.writeFileSync('public/reference-preview.html', html);
