---
title: Button / 按钮
description: 最常用的 UI 组件之一，用于触发一个即时操作。
features:
  - 符合现代浏览器标准的语义化
  - 支持动态渲染
  - 允许 Hover 状态拥有不同变体
---

## 基础用法

::demo-button-base
::

## Tonal fill text

Use `variant="tonal"` when you want a filled background but prefer the text to borrow the surrounding surface color instead of white in dark mode.

::demo-button-tonal
::

## 动态渲染

通过 `is` 属性可以动态渲染不同的组件，从而实现按钮形式的链接。

这种用法有许多好处。在桌面端，用户可以使用鼠标中键在新的标签页中打开链接；在移动端，用户可以长按链接实现小窗展现，并可以在多个应用之间的拖拽。

::demo-button-dynamic
::

如果你在使用 Nuxt 等 SSR 框架，你可能需要将按钮渲染为 `NuxtLink`。它能够获得更好的 SSR 支持。

::demo-button-dynamic-nuxt
::

## 图标按钮

通过 `icon` 属性可以实现图标按钮。它与普通按钮的区别在于 `padding` 会改为四边相同。

::demo-button-icon
::

其中图标本身需要由其他库导入。 Roku UI 已经引入了 [@unocss/icon](https://unocss.dev)，你可以使用 CSS 类名来使用图标。它非常易于管理，并且能获得最好的 SSR 效果，避免图标在刷新载入时的闪烁。不过图标库的容量过大，为了让图标生效，你需要另行下载相应的图标库数据使得它们能够正常显示。

## Hover 变体

有时候，我们希望一个按钮在被鼠标悬停时拥有不同的变体。通过组合不同的变体，你可以实现更多的效果。

::demo-button-hover-variant
::
