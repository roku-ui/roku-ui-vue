---
title: 欢迎使用 Roku UI
description: 一个基于 UnoCSS 的 Vue 组件库。
features:
  - 激进地使用 UnoCSS 支持灵活的原子化样式
  - 完美支持 SSR、SSG 和 SPA 项目
  - 支持简易而又美观的自定义主题，并且杜绝开屏闪烁
  - 符合现代浏览器标准的语义化
  - 理所应当地适配按需导入
---

## 写在前面

之所以会有这个组件库，是我深刻体会到了 UnoCSS 等原子化组件库开发的便捷。然而，UnoCSS 本身只是一个样式库。它并不能提供复杂组件——特别是 Select、AutoComplete 等组件。如果要在每个项目中重新造一遍轮子也非常麻烦。当然也可以使用其他组件库——但是它们或多或少有一些不是很喜欢的设计。使用“无样式组件”虽然也是一种方案，然而给无样式组件合理地添加样式，并不是一件非常轻松的事情。因此，我决定开发一个基于 UnoCSS 的 Vue 组件库，以便于我在项目中使用。

如果你也熟悉 React，也许你会注意到这个库的许多设计类似 Mantine 这一组件库。没错，我认为 Mantine 的设计非常中性且专业，我希望把它也带进 Vue 的世界。因此我参考了许多。当然，完美复刻一个 Mantine 并不是我的目标，因此许多设计也并不完全相同。

## 安装

Roku UI 依赖于 UnoCSS，因此你需要一并安装 UnoCSS。同时，我们提供了一套 UnoCSS 的 preset，它包含样式 Reset CSS，同时扫描所有组件用到的原子化样式，用户无需引入其他样式文件。我们推荐使用 pnpm 来安装。

```bash
pnpm add @roku-ui/vue @roku-ui/preset unocss
```

然后创建 UnoCSS 的配置文件 `unocss.config.ts`，并导入 preset：

```ts
import { defineConfig } from 'unocss'
import { rokuPreset } from '@roku-ui/preset'

export default defineConfig({
  presets: [
    rokuPreset(),
  ],
})
```

如果你在使用 Nuxt.js，你可以使用如下命令安装：

```bash
pnpm add @roku-ui/vue @roku-ui/preset unocss nuxt-unocss
```

然后在 `nuxt.config.js` 中配置：

```javascript
export default defineNuxtConfig({
  modules: ['@unocss/nuxt'],
})
```
