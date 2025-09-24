# Artisian Gallery

This is a full-stack web application consisting of a Node.js/Express backend and a React/Vite frontend.

## Project Structure

```
Project/
├── backend/        # Express.js server, EJS views, routes
│   ├── app.js      # Main Express app
│   ├── package.json
│   ├── bin/
│   ├── public/
│   ├── routes/
│   └── views/
├── frontend/       # React + Vite client app
│   ├── src/
│   ├── public/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md       # Project documentation
```

## Backend (Express.js)
- Serves EJS views and static files
- Main entry: `backend/app.js`
- Routes: `/` (home), `/users`
- Dependencies: express, ejs, morgan, cookie-parser, debug, http-errors

## Frontend (React + Vite)
- Main entry: `frontend/src/main.jsx`
- Features: React 19, Vite, HMR, ESLint
- UI: Simple counter and logo demo

## Getting Started

### Backend
```bash
cd backend
npm install
npm start
```
App runs on default Express port (see `bin/www`).

### Frontend
```bash
cd frontend
npm install
npm run dev
```
App runs on Vite dev server (default: http://localhost:5173).

## Features
- Node.js/Express backend with EJS templating
- React frontend with Vite
- ESLint for code quality
- Modular folder structure
 

 