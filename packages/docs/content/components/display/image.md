---
title: Image / 图片
description: 图片组件。比起原生的 img 标签，Image 组件提供了更多的功能。
features:
  - 支持载入时的占位和动画
---

## 基础用法

默认情况下，`Image` 组件会在图片未加载完成时显示一个占位动画，加载完成后显示图片。

::demo-image-base
::

::warning{message="如果想要在 flex 布局中正常显示占位，需要同时设置高度和宽度。"}
::
