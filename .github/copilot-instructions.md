# Copilot Instructions for ArtisianGallery

## Big Picture Architecture
- **MERN stack**: Node.js/Express backend (`backend/`), React/Vite + JS frontend (`frontend/`).
- **Backend** serves EJS views and static assets, main entry is `backend/app.js`. Routes are defined in `backend/routes/`.
- **Frontend** is a Vite-powered React app, main entry is `frontend/src/main.jsx`.
- **Data flow**: No direct API integration is present; backend and frontend run as separate apps. Add API endpoints in `backend/routes/` and consume them in React as needed.

## Developer Workflows
- **Backend**:
  - Install: `cd backend && npm install`
  - Start: `npm start` (runs via `bin/www`)
  - Debug: Use `debug` package, set `DEBUG=backend:*` env var.
- **Frontend**:
  - Install: `cd frontend && npm install`
  - Start: `npm run dev` (Vite dev server)
  - Lint: `npm run lint` (ESLint config in `frontend/eslint.config.js`)

## Project-Specific Conventions
- **Views**: EJS templates in `backend/views/`.
- **Static files**: Served from `backend/public/`.
- **Routes**: Modular, each route in its own file under `backend/routes/`.
- **Frontend assets**: Place images/icons in `frontend/src/assets/`.
- **React**: Use functional components, see `App.jsx` for style.

## Integration Points & Dependencies
- **Backend**: Uses `express`, `ejs`, `morgan`, `cookie-parser`, `debug`, `http-errors`.
- **Frontend**: Uses React 19, Vite, ESLint. See `frontend/package.json` for details.
- **No database integration** is present; add database logic in `backend/app.js` or new modules as needed.

## Examples & Patterns
- **Add a new backend route**: Create a file in `backend/routes/`, import and use in `app.js`.
- **Add a new React page/component**: Create in `frontend/src/`, import in `App.jsx`.
- **Serve new static asset**: Place in `backend/public/` (backend) or `frontend/src/assets/` (frontend).

## Key Files & Directories
- `backend/app.js`: Express app setup
- `backend/routes/`: Route definitions
- `backend/views/`: EJS templates
- `frontend/src/`: React source code
- `frontend/vite.config.js`: Vite config
- `frontend/eslint.config.js`: ESLint config

---
For unclear or missing conventions, check `README.md` in root and `frontend/`.
