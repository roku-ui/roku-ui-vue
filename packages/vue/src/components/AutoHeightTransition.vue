<script setup lang="ts">
function onBeforeEnter(el: Element) {
  if (el instanceof HTMLElement) {
    el.style.height = `${0}px`
  }
}
function onEnter(el: Element) {
  if (el instanceof HTMLElement) {
    el.style.height = `${el.scrollHeight}px`
  }
}
function onAfterEnter(el: Element) {
  if (el instanceof HTMLElement) {
    el.style.height = 'auto'
  }
}
function onBeforeLeave(el: Element) {
  if (el instanceof HTMLElement) {
    el.style.height = `${el.scrollHeight}px`
  }
}
function onLeave(el: Element) {
  if (el instanceof HTMLElement) {
    el.style.height = `${0}px`
  }
}
</script>

<template>
  <Transition
    css
    mode="out-in"
    class="transition-height"
    @before-enter="onBeforeEnter"
    @enter="onEnter"
    @after-enter="onAfterEnter"
    @before-leave="onBeforeLeave"
    @leave="onLeave"
  >
    <slot />
  </Transition>
</template>
