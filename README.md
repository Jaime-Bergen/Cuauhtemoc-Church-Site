# Service Tracker

A lightweight React + Vite app for logging service details (song leaders, songs, message, preacher) and tracking upcoming appointments. Runs entirely in the browser with localStorage. Suitable for GitHub Pages hosting; no backend required. Access is gated by a shared 4-digit PIN.

## Features
- PIN gate to keep edits limited to people who know the shared code (defaults to `7865` stored locally).
- Add service entries: Sunday School song leader + up to 3 songs, Church song leader + up to 3 songs, message title, preacher, optional notes, optional recording link.
- View dashboard with recent services and upcoming appointments.
- Manage appointments with a simple list and date/time picker.
- Track recurring responsibilities (e.g., songleader, youth SS teacher, cleaning) with weekly/monthly/custom schedules, assign members per occurrence.
- Maintain a member roster (name + birthday) to pick from when assigning responsibilities.
- All data saved in localStorage; nothing leaves the browser.

## Getting started
1) Install dependencies: `npm install` (or `pnpm install` / `yarn install`).
2) Run locally: `npm run dev` then open the shown URL.
3) Build for GitHub Pages: `npm run build` produces `dist/`.
4) Preview the production build: `npm run preview`.

## Deploying to GitHub Pages
- `vite.config.ts` base is set to `/Cuauhtemoc-Church-Site/` for GitHub Pages.
- Use the provided workflow `.github/workflows/pages.yml` (main branch push → build → deploy).
- Ensure the repo allows GitHub Pages from private repos (requires a plan that supports it); otherwise make the repo public.

## Notes and limits
- PIN and data live only in each browser; share the PIN out-of-band with friends. Clearing site data will reset everything.
- There is no real authentication or server-side storage. For persistence across devices, consider adding Supabase/Firebase later.
- File uploads are not included per your request. Add a link to recordings if hosted elsewhere.

## Scripts
- `npm run dev` — start dev server
- `npm run build` — type-check then bundle
- `npm run preview` — preview the production build locally

## Tech stack
- Vite, React, TypeScript
- React Router for routing
- date-fns for formatting and date math

## Customization ideas
- Add PIN change/reset UI.
- Export/import data as JSON for sharing between browsers.
- Add simple charts on the dashboard.
