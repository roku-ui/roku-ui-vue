<script setup lang="tsx">
import '@roku-ui/vue/style.css'
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
  <div class="border border-neutral-700 rounded-xl bg-neutral-900">
    <div class="flex border-b border-neutral-700">
      <div
        :class="{
          'border-r': $slots.form,
        }"
        class="gird-paper-background min-h-56 w-full flex flex-grow items-center justify-center border-neutral-700"
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
      class="not-prose overflow-hidden rounded-xl text-sm children:overflow-auto children:p-2"
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
  --color: #3332;
  background-color: transparent;
  background-image:
    linear-gradient(var(--color) 1px, transparent 1px),
    linear-gradient(90deg, var(--color) 1px, transparent 1px),
    linear-gradient(var(--color) 1px, transparent 1px),
    linear-gradient(90deg, var(--color) 1px, transparent 1px);
  background-size: calc(var(--size) * 8) calc(var(--size) * 8), calc(var(--size) * 8) calc(var(--size) * 8), var(--size) var(--size), var(--size) var(--size);
  background-position: -1px -1px, -1px -1px, -1px -1px, -1px -1px;
}
</style>
