<script setup lang="tsx">
import { getHighlighter } from 'shikiji'
import {
  transformerNotationHighlight,
} from 'shikiji-transformers'

const props = withDefaults(defineProps<{
  code?: string
}>(), {
  code: '',
})

const highlighter = await getHighlighter({
  themes: ['vitesse-dark'],
  langs: ['vue', 'tsx'],
})

const codeHtml = computed(() => highlighter.codeToHtml(props.code, {
  lang: 'vue',
  theme: 'vitesse-dark',
  transformers: [
    transformerNotationHighlight(),
  ],
}),
)
</script>

<template>
  <div class="overflow-hidden border border-surface-border-low rounded-xl bg-surface-low transition-background-color,border-color">
    <div
      class="flex border-b border-surface-border-low transition-border-color"
    >
      <div
        :class="{
          'border-r': $slots.form,
        }"
        class="gird-paper-background min-h-56 w-full flex flex-grow items-center justify-center border-surface-border-low transition-border-color"
      >
        <slot name="preview" />
      </div>
      <div
        v-if="$slots.form"
        class="flex items-center px-6 py-4"
      >
        <slot name="form" />
      </div>
    </div>
    <div
      class="not-prose overflow-hidden rounded-b-xl text-sm children:overflow-auto children:p-2 children:outline-none!"
      v-html="codeHtml"
    />
  </div>
</template>

<style>
.highlighted {
  background-color: rgba(101, 117, 133, .16);
  display: inline-block;
  margin: 0 -24px;
  padding: 0 24px;
}

.shiki code {
  display: inline-flex;
  min-width: calc(100% - 16px);
  flex-direction: column;
  align-items: stretch;
}

.gird-paper-background {
  --size: 0.25rem;
  --color: rgb(var(--r-color-surface-5) / 0.05);
  background-color: transparent;
  border-radius: 0.5rem;
  background-image:
    linear-gradient(var(--color) 1px, transparent 1px),
    linear-gradient(90deg, var(--color) 1px, transparent 1px),
    linear-gradient(var(--color) 1px, transparent 1px),
    linear-gradient(90deg, var(--color) 1px, transparent 1px);
  background-size: calc(var(--size) * 8) calc(var(--size) * 8), calc(var(--size) * 8) calc(var(--size) * 8), var(--size) var(--size), var(--size) var(--size);
  background-position: -1px -1px, -1px -1px, -1px -1px, -1px -1px;
}
</style>
