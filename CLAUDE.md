# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Start

For new developers or AI assistants working with this project:

1. **Install dependencies**: `pnpm install`
2. **Build preset first**: `pnpm --filter @roku-ui/preset build` (required before building Vue library)
3. **Start development**: `pnpm dev:spa` (Vue library) or `pnpm dev` (documentation)
4. **Run tests**: `pnpm --filter @roku-ui/vue test`

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

1. `@roku-ui/preset` (UnoCSS preset)
2. `@roku-ui/vue` (Vue component library)
3. `@roku-ui/docs` (documentation site, optional)

**Important**: Always run `pnpm --filter @roku-ui/preset build` before building the Vue library when making preset changes.

### Component Organization

Components are auto-exported from `packages/vue/src/components/index.ts` using unplugin-auto-export. The main categories include:

- **Display**: Avatar, Image, Indicator, Paper, Tag, ColorSwatch, Chip
- **Forms**: TextField, Select, Switch, Slider, Rating, ColorInput, CalendarInput, PinInput, Checkbox, Dropzone
- **Layout**: AspectRatio, ScrollArea, Drawer, AppShell, AutoHeightTransition
- **Feedback**: Progress, Notification, Modal, Overlay, FullscreenOverlay
- **Navigation**: Tabs, Menu, TreeList, BtnGroup
- **Chat**: ChatContainer, ChatMessage, ChatSystem
- **Utilities**: RokuProvider, ThemeProvider, SchemeSwitch

**Total Components**: 40+ components with consistent API design and UnoCSS styling.

### Development Setup

- **Auto-imports**: Vue composables and VueUse functions are auto-imported
- **Component auto-import**: Components are auto-imported in development via unplugin-vue-components
- **UnoCSS styling**: Utility-first styling with custom preset (`@roku-ui/preset`)
- **ESLint**: Code quality enforced with @jannchie/eslint-config
- **Pre-commit hooks**: Automatic linting on staged files via simple-git-hooks and lint-staged
- **TypeScript**: Strict mode enabled for type safety
- **Hot reload**: Fast development with Vite HMR

### Testing

- **Test Framework**: Vitest for unit and integration testing
- **Test Location**: `packages/vue/src/test/` directory
- **Run Command**: `pnpm --filter @roku-ui/vue test`
- **Demo System**: Comprehensive demo components in `packages/vue/src/test/demo/`
- **Test Coverage**: Basic test setup exists, more comprehensive testing should be added for new components
- **Visual Testing**: Use demo components for manual testing and visual regression

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
3. Create demo component in `packages/vue/src/test/demo/ComponentNameDemo.vue`
4. Import and add demo to `packages/vue/src/test/App.vue` navigation list
5. Test component functionality with `pnpm --filter @roku-ui/vue test`

**Important**: Focus on implementing Vue library demos in `packages/vue/src/test/demo/` rather than documentation site demos. The main demo page (`packages/vue/src/test/App.vue`) should be able to navigate to all component demos.

### Demo Development

The Vue library includes a comprehensive demo system located in `packages/vue/src/test/`:

- **Main Demo App**: `packages/vue/src/test/App.vue` - Navigation interface with TreeList for all demos
- **Demo Components**: `packages/vue/src/test/demo/` - Individual demo implementations
- **Development Server**: Run `pnpm dev:spa` to start the Vue library demo server

When adding new demos:

1. Create `ComponentNameDemo.vue` in `packages/vue/src/test/demo/`
2. Import the demo component in `packages/vue/src/test/App.vue`
3. Add entry to the `demoPages` array with key, title, and component reference
4. The TreeList navigation will automatically update

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

- **No CSS Files**: 永远不应该使用 style 标签。这个库主打使用 UnoCSS 管理样式，而不需要引入任何 CSS
- **UnoCSS Only**: 所有样式通过 UnoCSS 类名实现，配合自定义 preset 提供组件样式
- **Utility Classes**: 组件库不包含任何 CSS 文件，所有样式都通过 utility classes 提供
- **Custom Preset**: 使用 `@roku-ui/preset` 提供组件特定的样式变体和组合
- **Responsive Design**: 利用 UnoCSS 的响应式前缀实现移动端适配
- **Theme Support**: 通过 CSS 变量和 UnoCSS 支持亮色/暗色主题切换

## Component Development Guidelines

### Component Structure

```vue
<!-- Standard component template -->
<script setup lang="ts">
// Props definition with TypeScript
interface Props {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
}

// Use withDefaults for default values
const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
})

// Computed classes using UnoCSS
const computedClasses = computed(() => [
  'base-classes',
  `variant-${props.variant}`,
  `size-${props.size}`,
])
</script>

<template>
  <div :class="computedClasses">
    <slot />
  </div>
</template>
```

### Naming Conventions

- **Component Names**: PascalCase (e.g., `TextField`, `BtnGroup`)
- **Props**: camelCase with TypeScript interfaces
- **Events**: kebab-case following Vue conventions
- **Slots**: descriptive names (e.g., `prepend`, `append`, `header`)

### Props Design

- Use TypeScript interfaces for prop definitions
- Provide sensible defaults with `withDefaults`
- Support common variants: size, variant, disabled, loading states
- Follow consistent naming across similar components
- Use union types for controlled prop values

### Accessibility

- Include proper ARIA attributes
- Support keyboard navigation
- Provide screen reader friendly content
- Test with accessibility tools
- Follow WCAG 2.1 AA guidelines

## Troubleshooting

### Common Issues

1. **Build Failures**: Ensure preset is built before Vue library

   ```bash
   pnpm --filter @roku-ui/preset build
   pnpm --filter @roku-ui/vue build
   ```

2. **Style Not Applied**: Check if UnoCSS classes are properly generated
   - Verify `@roku-ui/preset` is installed and built
   - Check if classes exist in UnoCSS configuration

3. **Auto-import Issues**: Restart development server after adding new components

   ```bash
   # Stop dev server and restart
   pnpm dev:spa
   ```

4. **TypeScript Errors**: Run type checking explicitly

   ```bash
   pnpm --filter @roku-ui/vue build  # includes vue-tsc
   ```

### Development Tips

- Use the demo system (`pnpm dev:spa`) for rapid component development
- Check existing components for consistent patterns before creating new ones
- Always test components in both light and dark themes
- Verify responsive behavior on different screen sizes
- Test keyboard navigation and screen reader compatibility
