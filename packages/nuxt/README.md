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
