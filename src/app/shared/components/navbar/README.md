# Navbar Component - Quick README

This component is part of the Angular 17 Employee Management System and demonstrates:

- Dark mode via Tailwind (`html.dark` class)
- Runtime language switching (Arabic/English) using message assets and a translation pipe

## How to run the project

Prerequisites:

- Node.js 18+ installed
- npm installed

Steps:

1. Install dependencies:

2. Start the dev server:

    ng serve

    The application will be available at `http://localhost:4200/`.

## Notes and assumptions

- Dark mode:
- Tailwind is configured with `darkMode: 'class'` in `tailwind.config.js`.
- Theme toggling adds/removes the `dark` class on the `<html>` element via ThemeService.
- See: src/app/shared/services/theme.service.ts

- Language switching:
- Arabic (`ar`) and English (`en`) are supported.
- The LanguageService sets `html.lang` and `html.dir` (`rtl` for Arabic, `ltr` for English).
- Translations are loaded at runtime from `/assets/messages/messages.{lang}.json` by MessagesService, and used via the `t` pipe.
- See:
  - src/app/shared/services/language.service.ts
  - src/app/shared/services/messages.service.ts
  - src/app/shared/pipes/t.pipe.ts
  - Assets:
    - src/assets/messages/messages.ar-AR.json
    - src/assets/messages/messages.en-US.json

- API configuration:
- Base URL is provided by reactive config from:
- src/assets/config-dev.json
- src/assets/config-prod.json
- Make sure `apiUrl` has no leading/trailing spaces in these files to avoid request issues.

- Angular Material:
- Angular Material is still present for some features (e.g., dialogs on the Employees page).
- Tailwind is used for most recent UI refactors (Login, Data Table, Navbar).

- Service worker:
- Service worker registration is present in `index.html`, typically relevant for production builds.
- In development, it may not register or is not needed.

- ESLint/Jest:
- Strict ESLint rules and Jest are configured. You can run lint/tests if needed:
- Lint:

   npm run lint

- Test (Jest):

   npm test
  