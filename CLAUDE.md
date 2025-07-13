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

### Build Dependencies & Order

The preset package must be built before the Vue library since the Vue library depends on `@roku-ui/preset` for styling. Build order is:

1. `@roku-ui/vue` (Vue component library)
2. `@roku-ui/docs` (documentation site, optional)

**Important**: Always run `pnpm --filter @roku-ui/preset build` before building the Vue library when making preset changes.

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

### Testing

- Tests are located in `packages/vue/src/test/` directory
- Run tests with `pnpm --filter @roku-ui/vue test` (uses Vitest)
- Basic test setup exists but more comprehensive testing should be added for new components

### Auto-generation

- Component exports are auto-generated in `packages/vue/src/components/index.ts` via unplugin-auto-export
- Vue composables and utilities are auto-imported in development
- Type definitions are auto-generated during build

### Build Process

1. **Preset package** must be built first since Vue library depends on `@roku-ui/preset`
2. **Vue library** builds as both ESM and CJS with TypeScript declarations
3. **Documentation** is built as a static Nuxt.js site

## Development Workflow

### Adding New Components

1. Create component in `packages/vue/src/components/`
2. Component will be auto-exported via unplugin-auto-export
3. Add demo in `packages/docs/components/demo/ComponentName/`
4. Add documentation in `packages/docs/content/components/category/component-name.md`
5. Test component functionality with `pnpm --filter @roku-ui/vue test`

### Making Preset Changes

1. Build preset: `pnpm --filter @roku-ui/preset build`
2. Rebuild Vue library: `pnpm --filter @roku-ui/vue build`
3. Test changes in documentation: `pnpm dev`

### Code Quality

- All code is linted with ESLint using @jannchie/eslint-config
- Pre-commit hooks automatically lint staged files
- Run `pnpm lint` to lint and fix all files
- TypeScript strict mode is enabled

## Style Guidelines

- 永远不应该使用 style 标签。这个库主打使用 UnoCSS 管理样式，而不需要引入任何 CSS
- 所有样式通过 UnoCSS 类名实现，配合自定义 preset 提供组件样式
- 组件库不包含任何 CSS 文件，所有样式都通过 utility classes 提供
