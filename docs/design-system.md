# SFS design system

The five reference pages (`/`, `/institutions`, `/community`, `/campus-ambassador`, `/login`) define the look. The migrated pages reuse their tokens and components; nothing here changes how those five render.

> The experimental "Route" direction that was drafted on this branch (IBM Plex Sans, pale-blue paper, single route line) was not adopted. Its components still sit in `src/sfs/components/home/` but are not rendered.

## Tokens

| Token | Value | Use |
|---|---|---|
| `deep` | `#00549f` | Hero bands, strong panels, primary buttons, footer |
| `brand` | `#0389ff` | Accents, icons, links, focus outline |
| `tint` | `#c0e1ff` | Borders, underlines, hover states, accent words on dark |
| `surface` | `#f2f8ff` | Pale page backgrounds |
| `ink` | `#111827` | Text (`ink/70` for supporting copy) |
| `white` | `#ffffff` | Cards, inverse text |

* Font: Poppins (weights 400/500/600). Headings 600.
* Type classes (`sfs-ui.css`): `t-display` 36–60px, `t-title` 28–40px, `t-heading` 20px, `t-lead`, `t-body` 16px, `t-small`, `t-label`.
* Radii: controls 8px (`rounded-control`), cards 16px (`rounded-card`), panels 24px (`rounded-panel`). Shadows: `shadow-raised`, `shadow-overlay`.
* Layout: `.container-x` (max 1240px), `.section` vertical rhythm 64/80/96px.
* Buttons: `.btn` + `.btn-primary | .btn-secondary | .btn-inverse` (44px tall). Inputs: `.field`.

## Page building blocks

| Piece | File | What it does |
|---|---|---|
| `PageFrame` | `src/sfs/components/page/PageFrame.tsx` | Navbar + `<main>` + skip link; turns on `sfs-skin` and `MotionConfig reducedMotion="user"` |
| `PageHero` | same | Deep-blue opener: kicker, title, description, actions, optional picture; staggered rise-in |
| `PageLoading` | `page/PageStatus.tsx` | Loading state that keeps the navigation visible |
| `Catalogue*` | `page/Catalogue.tsx` | Filter bar and empty state for course catalogues |
| `AuthShell` | `src/sfs/components/auth/AuthShell.tsx` | Sign-in / sign-up / registration frame (the `/login` composition), plus `AuthField`, `AuthDivider` |
| `Reveal` | `ui/Reveal.tsx` | Scroll reveal (fade + 16px rise, once) |

## CSS isolation

* `src/sfs/styles/sfs-ui.css` – tokens and base rules for the reference pages (unchanged apart from making three base resets skin-aware).
* `src/sfs/styles/sfs-skin.css` – every selector starts with `.sfs-skin`. Only the migrated pages add that class. It restyles legacy inputs (native, shadcn, Mantine) so page logic and props stay as they were.
* Partner and Admin dashboards never use `.sfs-ui` / `.sfs-skin` and are not affected.

## Motion

* Entrance: 0.6s ease-out `[0.16, 1, 0.3, 1]`, 16px rise, staggered by 0.05–0.1s.
* Scroll: `Reveal`, once per element. No parallax, no pinned sections on migrated pages.
* Cards: 300ms border/shadow change, 500ms image scale 1.03. Links with a trailing arrow nudge 3px (`.nudge`).
* Modals: 250ms fade + 16px rise. Reduced motion is honoured through `MotionConfig` and a `prefers-reduced-motion` rule in the skin.

## Premium layer

`src/sfs/styles/sfs-premium.css` sits on top of the skin (loaded after `sfs-skin.css`, before `index.css`). Everything starts with `.sfs-skin`, `.sfs-polish` or the `.sfs-login` scope, so the home page and the Partner and Admin dashboards cannot be reached.

* Type: tighter tracking on display and title text, calmer lead colour.
* Rhythm: sections 72 / 96 / 112px.
* Surfaces: a light-blue hairline and a two-layer shadow (`--sfs-shadow-card`), a slightly higher one on hover (`--sfs-shadow-lift`).
* Fields: a 4.2:1 outline (`--sfs-edge`, `#6b7c93`) instead of the pale tint, 48px tall, one focus ring.
* Page opener (`PageHero`): deep blue with a soft light from the upper right, framed photograph.
* Sign-in screens (`AuthShell`) and `/login` share one composition: a photograph panel (`BrandPanel`, scenes `student`, `partner`, `admin`) beside the form.
* `/login` is the student sign-in. Partner and admin sign in at `/partner/signin` and `/admin/signin`; an old `/login?role=` link is forwarded.
* Institutions, Community and Campus Ambassador pass `polish` to `SfsPage` and get only the surface and press refinements.

## Motion

`src/sfs/lib/motion/` (`motion.css`, `autoMotion.ts`) gives the public pages a soft entrance: cards, tables and section headings fade and rise 20px over 650ms as they scroll into view, 60ms apart within a group. It marks elements with `data-reveal` and removes it when the entrance ends, skips anything framer-motion already animates, and does nothing under `prefers-reduced-motion`. Hover and press changes are 160 to 200ms on the same ease. The home page and the Partner and Admin dashboards are never marked.

Timing was taken from a Riff capture of a calm product site (150 to 200ms hovers, 600 to 700ms entrances). Only numbers were used, never its colours, type, copy or assets.
