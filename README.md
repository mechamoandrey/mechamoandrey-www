# andrey.dev.br

Personal website and portfolio — real stack, real projects, focused on performance and production. Live at [www.andrey.dev.br](https://www.andrey.dev.br).

![Home page preview](./docs/hero.png)

## Stack

| Area | Technologies |
|------|----------------|
| Framework | [Next.js](https://nextjs.org/) 16, React 19 |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4, `class-variance-authority`, `tailwind-merge` |
| Motion | Framer Motion, GSAP + horizontal scroll via `ScrollTrigger` |
| 3D / media | Three.js, Remotion, `@remotion/player` |
| UI | Lucide React, React Icons, `@base-ui/react` |
| Theming | next-themes — dark/light without flash |
| SEO | `app/layout.tsx` metadata, JSON-LD (Person), sitemap, robots, Open Graph edge image |
| Quality | ESLint (`eslint-config-next`) |

## Getting started

```bash
git clone https://github.com/mechamoandrey/mechamoandrey-www.git
cd mechamoandrey-www
npm install
npm run dev
```

Runs at [http://localhost:3000](http://localhost:3000). Node.js 20+ required.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Run production build locally |
| `npm run lint` | ESLint |

## Configuration

- **`app/layout.tsx`** — fonts, metadata, viewport, JSON-LD, theme provider
- **`app/sitemap.ts`** / **`app/robots.ts`** — base URL `https://www.andrey.dev.br`
- **`app/opengraph-image.tsx`** — Edge-rendered OG image (1200×630)

## Deploy

[Vercel](https://vercel.com): push to `main` triggers automatic deployment.

## License

MIT — see [LICENSE](./LICENSE).

## Author

**Andrey Rattes** — [andrey.dev.br](https://www.andrey.dev.br) · [GitHub](https://github.com/mechamoandrey) · [LinkedIn](https://www.linkedin.com/in/andrey-azevedo/)
