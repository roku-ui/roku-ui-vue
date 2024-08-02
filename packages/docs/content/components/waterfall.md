---

title: Waterfall / 瀑布流布局
description: 瀑布流布局组件。
features:
    - 支持自动计算元素大小
    - 支持懒加载
---

## 基础用法

一个支持懒加载的瀑布流布局只有在元素的高度是已知的情况下才能正常工作。因此，需要传入 items 对象，其中有高度和宽度的信息。

::demo-waterfall-lazy
::

## 自定义滚动

waterfall 布局一般会内置一个滚动条，但是如果你想要自定义滚动条，可以使用轻松使用 [ScrollArea 组件](/components/scroll-area)替代之。

::demo-waterfall-lazy-custom-scroll
::
