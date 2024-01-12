<script setup lang="ts">
const features = [
  '符合现代浏览器标准的语义化',
  '支持动态渲染组件（渲染成 <a /> 或 <NuxtLink /> 等元素）',
  '支持多种变体、大小调整、图标按钮',
]
</script>

<template>
  <ContentTitle
    title="按钮"
    description="最简单，最复杂的组件。"
  />
  <FeatureList :features="features" />
  <h2>基础用法</h2>
  <DemoButtonBase />
  <h2>动态渲染</h2>
  <p>
    通过 <code>is</code> 属性可以动态渲染组件，从而实现按钮形式的链接。这样的设计有许多好处。比如我们可以使用鼠标中键触发链接的打开，或者使用 <kbd>Ctrl</kbd> + <kbd>左键</kbd> 触发新标签页打开链接。而在移动端，我们可以使用长按触发在小窗中预览。
  </p>
  <DemoButtonDynamic />
  <p>
    如果你在使用 Nuxt 等 SSR 框架，你可能需要将按钮渲染为 `NuxtLink`：
  </p>
  <DemoButtonDynamicNuxt />
  <h2>图标按钮</h2>
  <p>
    通过 <code>icon</code> 属性可以实现图标按钮。它与普通按钮的区别在于，默认的 <code>padding</code> 会改为四边相同。
    其中图标本身需要由其他库导入。 Roku UI 已经引入了
    <a
      href="https://unocss.dev/"
      target="_blank"
      rel="noopener noreferrer"
    >
      @unocss/icon
    </a>
    来导入图标，不仅易于管理，还能获得最好的 SSR 效果。你需要下载相应的图标库使得它们能够正常显示。
  </p>
  <DemoButtonIcon />
</template>
