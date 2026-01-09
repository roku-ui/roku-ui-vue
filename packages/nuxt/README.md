# Roku UI Nuxt Module

Nuxt module that auto-registers Roku UI Vue components with an `R` prefix.

## Usage

```bash
pnpm add @roku-ui/nuxt @roku-ui/vue
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@roku-ui/nuxt'],
  rokuUi: {
    // Optional: customize the prefix
    prefix: 'R',
  },
})
```

If `@unocss/nuxt` is present, this module will automatically add `rokuPreset()` to the UnoCSS configuration, so you do not need to include it manually.
