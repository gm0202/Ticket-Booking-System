# Ticket Booking Frontend (Vite + React + TypeScript)

React front-end for the Modex ticket booking assignment. It provides:
- Admin dashboard to create shows/trips and view inventory
- User flows to browse shows, select seats on a grid, and create/confirm/cancel bookings
- React Query caching plus Context API for auth/booking state

## Quick start

```bash
cd client
pnpm install # or npm install / yarn
pnpm dev     # starts Vite on http://localhost:5173
```

## Environment

Copy `.env.example` (or create `.env`) and set:

- `VITE_API_URL` – base URL of the backend (e.g. `https://api.example.com/api`)
- `VITE_API_SHOWS_PATH` – path for show CRUD (default `/shows`)
- `VITE_API_BOOKINGS_PATH` – path for booking operations (default `/bookings`)

Example:
```
VITE_API_URL=http://localhost:3000/api
VITE_API_SHOWS_PATH=/shows
VITE_API_BOOKINGS_PATH=/bookings
```

## Tech/architecture
- React 19 + TypeScript + Vite
- React Router 7 for `/`, `/booking/:id`, `/admin`
- React Query for data fetching & cache
- Context API for auth role + booking selection state
- Seat grid uses DOM toggles (adds/removes classes for selection vs. booked)

## Scripts
- `pnpm dev` – start dev server
- `pnpm build` – type-check + production build
- `pnpm preview` – preview the build locally
