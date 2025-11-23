# Max Min Vue

## Usage

### Install

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

### Build

```bash
pnpm build
```

### Lint

```bash
pnpm lint
```

### Test

```bash
pnpm test
```

For Nuxt usage, install `@roku-ui/nuxt` and add it to `modules` to auto-register components with the `R` prefix:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@roku-ui/nuxt'],
  rokuUi: {
    prefix: 'R',
  },
})
```
