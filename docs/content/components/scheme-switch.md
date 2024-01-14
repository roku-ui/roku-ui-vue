---
title: SchemeSwitch / 主题切换
description: 用于切换主题。
features:
  - 针对 SSR 场景优化
---

## 基础用法

这个组件经过了特殊的 CSS Hack，在 SSR 场景下，首次渲染时也能根据主题渲染不同的开关状态，并且不影响正常水合。

::demo-scheme-switch-base
::
