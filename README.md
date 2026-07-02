# Navy Cadet Association Website

A professional, responsive website for a Navy Cadet Association built with **Next.js 16**, **React 19**, **TypeScript**, and **Tailwind CSS v4**. Data is stored in local JSON files — no external database required.

## Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS v4 with a maritime theme (Navy Blue, White, Gold)
- **Data:** Local JSON files in `src/data/`
- **Language:** TypeScript

## Features

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Hero section, announcement marquee, leadership & history |
| Media Gallery | `/gallery` | Filterable grid with lightbox (Parades, Camps, Drills) |
| Knowledge Library | `/library` | Tabbed resource hub with download/view actions |
| Knot Tying | `/knots` | Interactive knot selector with step-by-step instructions |
| Join Form | `/join` | Validated membership application form |

## Folder Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with header/footer
│   ├── page.tsx            # Home page
│   ├── gallery/page.tsx
│   ├── library/page.tsx
│   ├── knots/page.tsx
│   ├── join/page.tsx
│   └── globals.css         # Maritime theme & utilities
├── components/
│   ├── layout/             # Header, Footer, PageHeader
│   ├── home/               # Hero, Marquee, Leadership
│   ├── gallery/            # GalleryGrid, Lightbox
│   ├── library/            # ResourceTabs
│   ├── knots/              # KnotTyingComponent
│   └── join/               # JoinForm
├── data/                   # JSON data files
│   ├── announcements.json
│   ├── leadership.json
│   ├── gallery.json
│   ├── resources.json
│   └── knots.json
└── lib/
    └── types.ts            # Shared TypeScript types

public/
└── images/
    ├── gallery/            # Gallery placeholder SVGs
    └── knots/              # Knot diagram placeholder SVGs
```

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build for Production

```bash
npm run build
npm start
```

## Accessibility

- Skip-to-content link
- ARIA labels, roles, and live regions
- Keyboard-navigable lightbox (Escape to close)
- Form validation with `aria-invalid` and `role="alert"`
- Screen-reader-friendly announcement list alongside marquee

## Customisation

- Replace placeholder images in `public/images/`
- Edit content in `src/data/*.json`
- Adjust theme colours in `src/app/globals.css`
