# Repository Guidelines

## Project Structure & Module Organization

- `packages/vue/` houses the Vue component library; source lives in `src/`, demos in `src/test/`, builds in `dist/`.
- `packages/preset/` ships the UnoCSS preset compiled by Rollup from `src/` to `dist/`.
- `packages/docs/` runs the Nuxt docs site with Markdown demos in `content/` and app wiring in `app/` plus `server/`.
- Root tooling (`eslint.config.js`, `uno.config.ts`, PNPM manifests) configures the workspace.

## Build, Test, and Development Commands

- `pnpm install` bootstraps all packages through the shared lockfile.
- `pnpm dev` launches the Nuxt docs; `pnpm --filter @roku-ui/vue dev` serves the component playground.
- `pnpm build` compiles the preset then the Vue package; run `pnpm --filter @roku-ui/docs generate` to pre-render docs.
- `pnpm --filter @roku-ui/vue test` runs Vitest; pass `--run` for CI-friendly execution.
- `pnpm lint` applies the shared ESLint autofix configuration and mirrors the `lint-staged` hook.

## Coding Style & Naming Conventions

- Write TypeScript-first Vue SFCs with `<script setup lang="ts">` and two-space indentation.
- Use kebab-case file names for components (e.g., `AutoHeightTransition.vue`) and PascalCase exports; keep composables in `src/composables/`.
- Import shared utilities through the `@/` alias to `packages/vue/src/`, and preserve tree-shakeable entry points by re-exporting via `src/index.ts`.
- Run `pnpm lint` after each edit session and before commits so the shared ESLint and UnoCSS rules stay authoritative.

## Styling Guidelines

- Prefer preset tokens such as `bg-base`, `text-default`, and `border-container`, or variables like `var(--r-bg-base)`, when expressing day-mode colors.
- Avoid `dark:` utility prefixes; rely on the preset’s `data-scheme` mapping so one token spans both schemes.
- Add new tokens or shortcuts in `packages/preset/src/styles.css` or the UnoCSS preset instead of inlining raw values.
- Never apply Tailwind’s stock color palette (e.g., `sky`, `cyan`, `gray`) inside the component library; always reference theme colors such as `primary`, `surface`, or preset tokens.

## Testing Guidelines

- Place specs in `packages/vue/src/test/` with the `*.test.ts` suffix so demos and tests stay paired.
- Exercise interactions with Vitest and `@vue/test-utils`, covering state branches such as hover, disabled, and async updates.
- For new components or variations, add a regression test that reflects the matching example in `src/test/demo/`.

## Commit & Pull Request Guidelines

- Follow Conventional Commit syntax (`type(scope): message`) as seen in `feat(color-system): ...` and add `!` for breaking updates.
- Keep commits focused on one package or concern; split multi-package work into separate commits.
- Pull requests must outline motivation, enumerate affected packages, and attach screenshots or recordings for UI-facing changes.
- Verify `pnpm lint` and relevant `pnpm --filter ... test` commands succeed, and link issues with `Closes #123` when appropriate.
