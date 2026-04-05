# AI Doctor Virtual Hospital

## Overview
A comprehensive AI-powered digital healthcare platform with telemedicine, AI diagnosis, emergency response, and medical records management.

## Tech Stack
- **Frontend**: React 18 + Vite + Tailwind CSS + Framer Motion
- **Package Manager**: npm
- **Frontend Location**: `project/` directory

## Project Structure
```
project/
├── src/           # React components, pages, context, utils
├── server/        # Node.js Express backend (not currently running in Replit)
├── ai-services/   # Python FastAPI AI/ML services (not currently running)
├── vite.config.ts # Vite config (port 5000, host 0.0.0.0, allowedHosts: true)
└── package.json   # Frontend dependencies
```

## Running the App
- **Workflow**: "Start application" — runs `cd project && npm run dev`
- **Port**: 5000 (frontend)
- The frontend runs as a standalone Vite dev server

## Deployment
- **Type**: Static site
- **Build**: `cd project && npm run build`
- **Public Dir**: `project/dist`
