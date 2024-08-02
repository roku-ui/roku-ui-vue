---

title: ScrollArea / 滚动区域
description: 一个非原生的滚动区域，提供更统一的滚动条样式。
features:
    - 可以定制样式
---

## 基础用法

目前，这个组件的滚动条已经能够提供类似于原生的滑动手感和逻辑。比如一个细节是，当鼠标在滚动条上按下后，如果侧移一定距离，滚动条会回到滑动前的位置。

::demo-scroll-area-base
::

::warning{message="虽然这个组件可以设置 padding 和 margin，但是会有奇怪的表现，建议在父元素上设置。"}
::
