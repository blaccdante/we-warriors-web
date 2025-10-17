# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Project overview
- Pure static website (HTML/CSS/JS). No framework or bundler; pages are hand-authored and share a reusable template at templates/page-template.html.
- Entry: index.html. Content pages live under top-level folders like support/, information/, community/, professionals/, and pages/.
- Styling layers: css/main.css, css/responsive.css, css/accessibility.css, css/pages.css, plus component-focused styles like css/universal-header.css, css/modern-homepage.css, css/theme-optimization.css.
- Client JS modules (loaded directly by pages):
  - js/universal-header.js: header, nav, dropdowns, mobile menu, theme toggle, and active-link logic (persists theme via localStorage and [data-theme]).
  - js/modern-slideshow.js: hero slideshow (ModernSlideshow), initialized against .hero-slideshow; responsive, touch, progress, and dark-mode fixes.
  - js/main.js and js/pages.js: general UX/accessibility (skip links, smooth scroll, keyboard focus trapping), and page-specific behaviors (gallery, donate form UI, etc.).
  - js/performance-monitor.js: lightweight in-page perf HUD; toggle with Ctrl+Shift+P.
  - js/warriorbot-ai.js: optional AI assistant; tries local Ollama, Hugging Face, Gemini, Groq; falls back to deterministic responses. Provider config is read from localStorage under key "warriorbot-ai-config".

Common commands
- Install deps (required once):
  - npm install
- Dev server with auto-reload (live-server on port 3000):
  - npm run dev
- Serve the built static site (also on port 3000):
  - npm start
- Lint all JS (eslint js/**/*.js):
  - npm run lint
- Lint a single file:
  - npm run lint -- js/universal-header.js
- Format code (Prettier across html/css/js):
  - npm run format
- Format a single file:
  - npx prettier --write css/main.css
- Build (no-op; site is already static):
  - npm run build
- Tests: none configured; current script is a placeholder.
  - npm test

WarriorBot AI configuration (optional)
- To enable cloud providers without code changes, set this in the browser console (values are placeholders and should be provided securely by the user at runtime; do not hardcode into the repo):
  ```json
  {
    "huggingface": { "apiKey": "{{HUGGINGFACE_API_KEY}}" },
    "gemini": { "apiKey": "{{GEMINI_API_KEY}}" },
    "groq": { "apiKey": "{{GROQ_API_KEY}}" }
  }
  ```
- Example (run in DevTools Console on the site):
  ```js
  localStorage.setItem('warriorbot-ai-config', JSON.stringify({
    huggingface: { apiKey: '{{HUGGINGFACE_API_KEY}}' },
    gemini: { apiKey: '{{GEMINI_API_KEY}}' },
    groq: { apiKey: '{{GROQ_API_KEY}}' }
  }));
  ```
- Local inference: js/warriorbot-ai.js auto-detects Ollama at http://localhost:11434 if running.

Notes and gotchas
- Linting: No eslint config file was found in the repo; if eslint reports “No ESLint configuration found,” add one before relying on npm run lint.
- Tests: No test runner is set up; the test script is a stub.
