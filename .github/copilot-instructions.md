# Copilot Instructions for reframy-app

## Project Overview
- This is a React application bootstrapped with Create React App.
- Main entry: `src/App.js`.
- UI components are in `src/components/`.
- Data and logic are separated into `src/data/` and `src/logic/`.
- Pages are in `src/pages/` and are composed of components and logic.
- Custom hooks are in `src/hooks/` (e.g., for sound management).

## Data Flow & Architecture
- Data such as points and scenes are defined in `src/data/points.js` and `src/data/scenes.js`.
- Business logic (e.g., answer evaluation, synonyms) is in `src/logic/`.
- Components communicate via props; state is typically managed at the page or App level.
- Sound and BGM are managed via context/provider in `src/hooks/SoundProvider.js` and `src/hooks/useBgmManager.js`.

## Developer Workflows
- Start dev server: `npm start` (runs on http://localhost:3000)
- Run tests: `npm test`
- Build for production: `npm run build`
- No custom build/test scripts beyond Create React App defaults.

## Project Conventions
- Use functional React components and hooks throughout.
- CSS is split between `App.css`, `index.css`, and `style.css`.
- Images and sounds are in `public/images/` and `public/sounds/`.
- Page components in `src/pages/` are the main route-level views.
- Avoid class components; use hooks for state and side effects.
- Use explicit file names for clarity (e.g., `FeedbackWidget.jsx`, `evaluateAnswer.js`).

## Integration Points
- No backend/API integration is present; all data is local/static.
- Service worker and PWA support via `serviceWorkerRegistration.js`.
- App is designed for browser use only.

## Examples
- To add a new scene: update `src/data/scenes.js` and reference it in relevant page/component.
- To add a new sound: place file in `public/sounds/` and update sound logic/hooks as needed.

## Key Files/Directories
- `src/components/` — Reusable UI components
- `src/pages/` — Route-level views
- `src/data/` — Static data
- `src/logic/` — Business logic
- `src/hooks/` — Custom React hooks
- `public/` — Static assets (images, sounds, manifest)

---
If any conventions or workflows are unclear, please ask for clarification or examples from the codebase.
