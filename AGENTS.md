# AGENTS.md — FitLog (Gym Tracker, Android)

## Project
FitLog is an offline-first Android gym workout tracker built with **Expo (React Native) and plain JavaScript**.
The full specification is in `REQUIREMENTS.md`. Read it before starting any task and follow the milestone order in section 11.

## Hard rules
- Language: **JavaScript only** (no TypeScript). Functional components + hooks only.
- Use ONLY the libraries listed in section 2 of `REQUIREMENTS.md`. Install with `npx expo install <pkg>` when possible.
  Adding any other dependency requires a one-line justification in the commit message.
- No web-only APIs (`localStorage`, `document`, `window`).
- Work on **one milestone at a time**. Do not implement features from later milestones.
- Keep files small and readable (target < 250 lines per file). Prefer simple code over clever code.
- All user-facing strings go through `t('key')` and exist in both `src/i18n/en.js` and `src/i18n/ar.js`. No hard-coded UI text.
- Use `marginStart/marginEnd/paddingStart/paddingEnd` (not left/right) so RTL works.
- Colors, spacing and radii come from `src/theme/tokens.js`. No inline hex colors in screens.
- Weights are stored in **kilograms** in the database; convert only for display.
- Persist data to SQLite immediately on every change (no "save later" patterns for workouts).
- Never bundle copyrighted exercise images or videos. Built-in exercises have no media.
- Ask for permissions only at the moment of use (camera, gallery, notifications).

## Media rules
- Exercise image: one cover image per exercise, copied into `documentDirectory/exercise-images/<uuid>.jpg`,
  resized to max width 1080 and JPEG quality 0.8. Store only the file URI in SQLite. Delete the old file when replaced or removed.
- YouTube: parse links with `src/utils/youtube.js` (`parseYouTubeUrl`), store only `youtube_id` and `youtube_start`.
  Render with `components/YouTubeEmbed.js` (16:9, no autoplay, error/timeout fallback = "Open in YouTube" button).

## Commands
- Install: `npm install`
- Run dev server: `npx expo start` (test on a phone with Expo Go)
- Unit tests: `npm test`
- Health check: `npx expo-doctor`

## Definition of done for every task
1. `npm test` passes (add/extend Jest tests for any change in `src/utils/`).
2. `npx expo-doctor` reports no errors.
3. No unused files, no leftover `console.log`, no TODOs for the current milestone.
4. The milestone's acceptance criteria in `REQUIREMENTS.md` are met.
5. Commit with a clear message: `M<number>: <short description>`.

## UI style
Modern, clean, minimal. Material-like rounded cards (radius 16), 8-pt spacing grid, large touch targets (>= 48dp),
primary action reachable with one hand, light + dark themes, Inter (Latin) and Cairo (Arabic) fonts.

## When unsure
Choose the simplest option that satisfies `REQUIREMENTS.md`, state the assumption in the final message, and continue.
