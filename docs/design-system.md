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
