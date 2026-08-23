# Arunesh Sharma — Portfolio

Premium interactive portfolio for **Arunesh Sharma**, positioned as a **Web Developer & Software Engineer**.

WordPress / PHP / WooCommerce expertise is proven deeper in the site — not as the hero identity.

> Future AI sessions: start with [`AI_CONTEXT.md`](AI_CONTEXT.md) and [`docs/`](docs/).

---

## Positioning

**Landing:** Web Developer & Software Engineer — “I BUILD FOR THE WEB.”  
**Depth:** Frontend + Backend → PHP / JS / APIs / Databases → WordPress / WooCommerce → Production & AI-assisted engineering.

---

## Tech stack

- React 18 + TypeScript
- Vite 5
- Tailwind CSS v4
- GSAP + ScrollTrigger
- Motion
- Wrangler 3 → **Cloudflare Workers Static Assets**

See [`docs/TECH_STACK.md`](docs/TECH_STACK.md).

---

## Local setup

```bash
npm install
npm run dev
```

### Production build & preview

```bash
npm run build
npm run preview
```

### Optional Wrangler dry-run (no live deploy)

```bash
npm run deploy:dry-run
```

---

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Local development |
| `npm run build` | Typecheck + Vite production build → `dist/` |
| `npm run preview` | Serve `dist` locally |
| `npm run lint` | ESLint |
| `npm run deploy` | Build + `wrangler deploy` to **Cloudflare Workers** |
| `npm run deploy:dry-run` | Build + dry-run deploy |

**Do not run `deploy` until Cloudflare + GitHub are intentionally configured.**

---

## Deployment workflow (intended)

```
Local → Git → GitHub → Cloudflare Workers (Wrangler Static Assets) → Live
```

**Not** Cloudflare Pages.

Details: [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md)

Status:

- GitHub: **NOT YET COMPLETED**
- Cloudflare Workers deploy: **NOT YET COMPLETED**
- Domain: **NOT YET CONFIGURED**

---

## Environment variables

Copy `.env.example` → `.env` if needed:

- `VITE_SITE_URL` — public site URL (not secret)
- `VITE_FORM_ENDPOINT` — optional future form endpoint (not secret if client-side)

Never commit secrets. Frontend `VITE_*` values are public.

---

## Project structure

```
AI_CONTEXT.md          # Primary AI/session context
docs/                  # Permanent documentation
src/
  components/          # UI sections
  data/                # Content (projects, skills, experience, site)
  hooks/
  lib/
  styles/global.css    # Design tokens
public/
  projects/            # Optional screenshots per project
  Arunesh-Sharma-Resume.pdf
resume/                # Source resume PDF
wrangler.toml          # Workers Static Assets config
```

---

## Documentation

| File | Contents |
| --- | --- |
| [`AI_CONTEXT.md`](AI_CONTEXT.md) | Positioning, stack, status, rules |
| [`docs/PROJECT_CONTEXT.md`](docs/PROJECT_CONTEXT.md) | Full project context |
| [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) | Actual design tokens |
| [`docs/TECH_STACK.md`](docs/TECH_STACK.md) | Dependencies & commands |
| [`docs/CONTENT_SOURCE.md`](docs/CONTENT_SOURCE.md) | Verified vs placeholder facts |
| [`docs/PROJECTS.md`](docs/PROJECTS.md) | Selected work |
| [`docs/ANIMATION_GUIDELINES.md`](docs/ANIMATION_GUIDELINES.md) | Motion system |
| [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) | Workers workflow |
| [`docs/DEVELOPMENT_RULES.md`](docs/DEVELOPMENT_RULES.md) | Rules for future changes |
| [`docs/CHANGELOG.md`](docs/CHANGELOG.md) | Change history |

---

## Resume

- Source: `resume/Arunesh_Wordpress(php).pdf`
- Public URL: `/Arunesh-Sharma-Resume.pdf`

---

## Project screenshots

Add optional assets under `public/projects/<slug>/desktop.webp`. Until then, `BrowserFrame` placeholders are used. Do not fabricate screenshots.
