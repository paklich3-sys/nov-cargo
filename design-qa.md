# Design QA

- Source target: premium 3D redesign brief with moving vehicles and full RU/EN support.
- Desktop captures: `nov3d-desktop.png`, `nov3d-services-safe.png`, 1440 × 1000.
- Mobile captures: `nov3d-mobile.png`, `nov3d-contact-mobile-safe.png`, 500 × 900.

## Review

- Hero is a 190vh sticky 3D scene with two independent transparent CGI vehicle layers.
- Scroll progress drives the orange and white vans in opposite directions with different depth, scale and rotation.
- Premium navy/orange art direction, glass navigation, perspective road grid and ray-traced vehicle assets remain legible on both breakpoints.
- Mobile uses an independent composition, reduced vehicle travel, stacked CTAs and a persistent tap-to-call action.
- RU/EN toggle covers navigation, hero, sections, form, success and error states; `?lang=ru|en` is supported.
- Desktop navigation, mobile navigation trigger, primary and secondary actions are visible and correctly spaced.
- Mobile content stays readable, controls meet comfortable touch sizes, and the fixed call action does not cover the main CTA.
- Only name and phone are required. Route, cargo, mass, desired date and desired time are optional and sent to Telegram when provided.
- Optional fields have no explanatory “optional” labels; only required name and phone fields show an asterisk.
- Fleet specification shows `400 × 180 × 220 cm` (length × width × height), replacing the incorrect L3H2 label.
- Loaders are advertised as available on request and can be selected in the lead form; the choice is included in Telegram.
- Cargo placeholder now uses a realistic load example: a sofa, table and 12 boxes.
- Navigation uses a custom transparent 3D NOV monogram asset rather than the generic truck icon.
- Service cards include animated CGI vehicle scenes with three distinct motion compositions.
- Third service card now uses a single vehicle and a dedicated route animation, eliminating the collision composition.
- UI accents moved from flat orange to an aurora indigo/teal system with animated iridescent cards and dimensional buttons.
- Manifesto label now reads “Прямая логистика. Личная ответственность.” / “Direct logistics. Personal responsibility.”
- Native selects, date and time controls were replaced with custom glass popovers and a branded calendar.
- Third service card uses a new sapphire-blue CGI van with a distinct body and front-right camera angle.
- Favicon, 32 px PNG and Apple Touch Icon are derived from the NOV monogram.
- Scroll reveals stage the section container first, then fly text in from alternating screen edges and stagger the cards.
- All phone actions use `tel:+79506888862`, including the fixed mobile call button.
- Generated assets are optimized transparent WebP layers (97 KB and 78 KB) plus a 160 KB atmospheric backdrop.
- Reduced-motion preference disables decorative animation.

## Remaining deployment inputs

- Replace the placeholder canonical/sitemap domain with the purchased production domain.
- Add `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` to the production environment.

final result: passed
