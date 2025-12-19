# Setoo Jamstack

Monorepo containing a Strapi v5 headless CMS (`backend/`) and a Next.js 16 site (`frontend/`). The backend provides content and GraphQL APIs; the frontend renders the marketing pages and blog using that data.

## Prerequisites
- Node.js 20.x (backend requires `>=20 <=24.x.x`; use the same version for both apps)
- npm (ships with Node)

## Project layout
- `backend/` – Strapi CMS with content types, GraphQL plugin, seed script, and local uploads.
- `frontend/` – Next.js 16 + Tailwind CSS marketing site consuming the Strapi API.

## Setup (local development)
1) Install dependencies
- `cd backend && npm install`
- `cd frontend && npm install`

2) Configure environment variables  
Create a `.env` file in each app root:
- `backend/.env`: `HOST`, `PORT`, `APP_KEYS`, `API_TOKEN_SALT`, `ADMIN_JWT_SECRET`, `TRANSFER_TOKEN_SALT`, `ENCRYPTION_KEY`, `NEXT_PUBLIC_FRONTEND_URL` (see `backend/README.md` for the full list).
- `frontend/.env`: `NEXT_PUBLIC_STRAPI_URL`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_STRAPI_TOKEN` (see `frontend/README.md`).

3) Run locally (two terminals)
- Backend (Strapi): `cd backend && npm run develop` → http://localhost:1337/admin
- Frontend (Next.js): `cd frontend && npm run dev` → http://localhost:3000

## Useful scripts
- Backend: `npm run develop` (dev), `npm run build`, `npm run start`, `npm run seed:example` (load sample content).
- Frontend: `npm run dev`, `npm run build && npm run start`, `npm run lint`, `npm run postbuild` (generates sitemap).

## Notes
- Media uploads stored at `backend/public/uploads/`; adjust storage in Strapi config if deploying.
- GraphQL is enabled in Strapi; the frontend uses `graphql-request` to query it.
- For deployment, build and start each app separately and point the frontend env vars to the deployed Strapi URL.

