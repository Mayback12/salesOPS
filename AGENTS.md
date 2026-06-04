# Repository Guidelines

## Project Structure & Module Organization

- `client/` contains the React 19 + Vite frontend. Main app code lives in `client/src/`, with dashboard sections in `client/src/components/dashboard/sections/`, reusable UI primitives in `client/src/components/ui/`, API clients in `client/src/api/`, hooks in `client/src/hooks/`, and auth state in `client/src/stores/`.
- `server/` contains the Express + Prisma API. Source files are in `server/src/`, grouped by `controllers/`, `routes/`, `middleware/`, `services/`, and `lib/`.
- `server/prisma/` contains `schema.prisma` and migrations. `shared/` contains cross-workspace TypeScript types.
- `dist/`, `client/dist/`, and `server/dist/` are generated outputs; avoid editing them directly.

## Build, Test, and Development Commands

- `npm install` installs all workspace dependencies.
- `npm run setup` installs dependencies, generates Prisma client code, and runs development migrations.
- `npm run dev` starts both Vite and the API server with `concurrently`.
- `npm run client:dev` or `npm run server:dev` starts one side only.
- `npm run build` type-checks/builds the client and compiles the server.
- `npm run lint -w client` runs the client ESLint script.
- `npm run prisma:migrate -w server` applies Prisma migrations during local development.

## Coding Style & Naming Conventions

Use TypeScript throughout. Follow the existing style: two-space indentation in React files, semicolons, PascalCase for React components, camelCase for variables/functions, and kebab-case for route/page filenames such as `login-page.tsx` and `products.routes.ts`. Prefer the `@/` alias in client imports. Keep API route definitions thin and put business logic in services where practical.

## Testing Guidelines

No first-party test framework or test scripts are currently configured. For now, validate changes with `npm run build`, `npm run lint -w client`, and focused manual checks in the running app. When adding tests, colocate them near the code under test using `*.test.ts` or `*.test.tsx`, and add a workspace test script so contributors can run it consistently.

## Commit & Pull Request Guidelines

Git history is not available in this checkout, so use clear imperative commit subjects such as `Add customer debt filters` or `Fix Prisma product totals`. Pull requests should include a concise summary, testing performed, migration notes when `server/prisma/` changes, linked issues when applicable, and screenshots or screen recordings for UI changes.

## Security & Configuration Tips

Keep secrets in local environment files such as `server/.env`; do not commit real credentials. Document any new required variables and ensure `CLIENT_URL`, database settings, and auth secrets are set before running the API locally.
