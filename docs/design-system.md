# SFS design system – direction "Route"

Status: **proposed, awaiting approval** (first page built: Home).

## Subject and job
STEM for Society connects college students, institutions and industry. The home page has to do three jobs in order: say what SFS is, show real proof, and send each visitor (student, institution, partner) to the right next step.

## Idea
Everything SFS does is a route from campus to industry. The page is calm and flat on cool paper; the only drawn element is **one route line** that travels from "Campus" to "Industry" along the foot of the hero. One full-colour band (Network Beyond Campus) carries the only strong colour moment.

## Self-critique that shaped it
Checked against the `frontend-design` guidance on disk (Hallmark and Riff were not available, see report): removed one-word coloured headline accents, ALL-CAPS labels, numbered markers (01/02/03), "→" suffixes on actions, identical card grids, scroll-jacking and fade-and-slide on every section.

## Tokens
| Group | Value |
|---|---|
| Colour (5 + white) | Field Blue `#00549f` (primary, dark bands) · Signal Blue `#0389ff` (the route line, selected states only) · Mist `#c0e1ff` (rules, underlines, text on dark) · Ink `#0e1b2e` (text) · Paper `#f5f8fb` (page tint) · White |
| Type | IBM Plex Sans 400 / 500 / 600, one family (engineering vernacular, strong numerals). Poppins stays on the not-yet-migrated pages. |
| Scale | Display 40→68 px / 1.04 / −0.028em · Title 30→44 / 1.12 · Heading 22 / 1.3 · Lead 17→20 / 1.6 · Body 17 / 1.65 · Small and label 15 |
| Line length | ≤ 62 characters (`max-w-xl`, headline `max-w-[17ch]`) |
| Spacing | 4 px base: 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128. Sections 64 / 80 / 96 px |
| Container | 1240 px content, full-bleed bands allowed; gutters 16 / 24 px |
| Grid | 12 columns; compositions are asymmetric (7/5, 5/7), single column below 1024 px |
| Breakpoints | 640 · 768 · 1024 · 1180 (nav) · 1280 |
| Radius | 6 px controls · 14 px media and surfaces · 20 px dialogs |
| Borders / shadow | 1 px hairlines in Ink at 10 %; no resting shadows; one overlay shadow for menus and dialogs |
| Buttons | Primary: Field Blue fill, white, 44 px, 6 px radius. Secondary: text link with a 2 px Mist underline. Inverse on dark. No arrow suffixes |
| Images | Hero 4:3.3 (16:10 on small screens), programmes 3:2, network band full-height; 14 px radius except bleeding bands |
| Icons | Phosphor regular, 20–22 px, only where they carry meaning |
| Motion | One orchestrated moment (route line draws once, 1.8 s). Responsive-to-action only elsewhere: programme picture cross-fade 200 ms, menus. `prefers-reduced-motion` shows the final state |

## Home composition
1. Hero: headline, lead, one primary action and one text link; photo; route line.
2. Proof: three real figures from the previous home page (22,000+ Trained Students, 70+ Industry Partners, 40+ Institution Partners).
3. Programmes: one explorer (tabs with arrow-key support) replacing the scroll-hijacked slideshow.
4. Network Beyond Campus: single full-colour band, photo bleeds to the edge.
5. Trusted by: still logo wall in one tone.
6. Closing action band, then the shared footer.

Left out on purpose: the testimonial deck (its quotes and portraits were placeholders; reinstate with approved quotes).

## Implementation notes
- Components: `src/sfs/components/home/*`; tokens: `tailwind.config.js` and `src/sfs/styles/sfs-ui.css`.
- Base resets in `sfs-ui.css` now use `:where()` so spacing and colour utilities are no longer overridden (this fixed paragraphs on every migrated page ignoring `mt-*`).
