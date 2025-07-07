# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Vue 3 UI component library monorepo called `roku-ui-vue`. It consists of three packages:

- `@roku-ui/vue` - Main Vue 3 component library with 40+ components
- `@roku-ui/preset` - UnoCSS preset for styling
- `@roku-ui/docs` - Nuxt 3 documentation site

## Common Development Commands

### Root Level Commands

```bash
# Install dependencies
pnpm install

# Build all packages (preset must be built first)
pnpm build

# Lint and fix all files
pnpm lint

# Development server for documentation
pnpm dev

# Vue library development server
pnpm dev:spa

# Watch mode for Vue library
pnpm watch

# Watch mode for preset
pnpm watch:preset

# Release packages
pnpm release
```

### Package-Specific Commands

```bash
# Vue library (@roku-ui/vue)
pnpm --filter @roku-ui/vue build
pnpm --filter @roku-ui/vue test    # Run Vitest tests
pnpm --filter @roku-ui/vue dev     # Development server

# Preset (@roku-ui/preset)
pnpm --filter @roku-ui/preset build
pnpm --filter @roku-ui/preset watch

# Documentation (@roku-ui/docs)
pnpm --filter @roku-ui/docs dev
pnpm --filter @roku-ui/docs build
pnpm --filter @roku-ui/docs generate
```

## Architecture

### Package Structure

- **packages/vue/**: Main component library
  - `src/components/`: Vue components (40+ components including Btn, Modal, Drawer, etc.)
  - `src/composables/`: Vue composables for shared logic
  - `src/utils/`: Utility functions (classGenerator, theme, modals, notifications)
  - `src/types/`: TypeScript type definitions
  - `src/shared/`: Shared logic and configurations
  - Built with Vite as library mode

- **packages/preset/**: UnoCSS preset
  - `src/index.tsx`: Main preset configuration
  - Built with Rollup, outputs CJS and ESM formats

- **packages/docs/**: Documentation site
  - Built with Nuxt 3 and Nuxt Content
  - `components/demo/`: Component demonstration examples
  - `content/`: Markdown documentation files

### Key Technologies

- Vue 3 with Composition API
- TypeScript for type safety
- UnoCSS for styling with custom preset
- Vite for build tooling (Vue library)
- Rollup for preset bundling
- Nuxt 3 for documentation
- Vitest for testing
- PNPM workspace for monorepo management

### Build Dependencies

The preset package must be built before the Vue library since the Vue library depends on `@roku-ui/preset` for styling.

### Component Organization

Components are auto-exported from `packages/vue/src/components/index.ts` using unplugin-auto-export. The main categories include:

- Display: Avatar, Image, Indicator, Paper, Tag, etc.
- Forms: TextField, Select, Switch, Slider, etc.
- Layout: AspectRatio, ScrollArea, Drawer, etc.
- Feedback: Progress, Notification, Modal, etc.
- Navigation: Tabs, Menu, TreeList, etc.

### Development Setup

- Uses auto-import for Vue composables and VueUse
- Components are auto-imported in development
- UnoCSS provides utility-first styling
- ESLint with @jannchie/eslint-config for code quality
- Pre-commit hooks run linting on staged files
