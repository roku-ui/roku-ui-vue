<script setup lang="tsx">
import { useContainerDefaultCS } from '@roku-ui/vue'
import { transformerNotationHighlight } from '@shikijs/transformers'
import { getSingletonHighlighter } from 'shiki'
import { surfaceBorderCS } from '~/utils/colors'

const props = withDefaults(defineProps<{
  code?: string
}>(), {
  code: '',
})

const highlighter = await getSingletonHighlighter ({
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
const containerCS = useContainerDefaultCS()
</script>

<template>
  <div
    class="border rounded-xl overflow-hidden"
    :class="containerCS.class"
    :style="containerCS.style"
  >
    <div
      class="border-b flex"
      :class="surfaceBorderCS.class"
      :style="surfaceBorderCS.style"
    >
      <div
        :class="{
          'border-r': $slots.form,
        }"
        class="gird-paper-background flex flex-grow min-h-56 w-full items-center justify-center"
        :class="surfaceBorderCS.class"
        :style="surfaceBorderCS.style"
      >
        <slot name="preview" />
      </div>
      <div
        v-if="$slots.form"
        class="px-6 py-4 flex items-center"
      >
        <slot name="form" />
      </div>
    </div>
    <div
      class="not-prose text-sm rounded-b-xl overflow-hidden children:p-2 children:overflow-auto children:outline-none!"
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
  border-radius: 0.5rem 0 0 0.5rem;
  background-image:
    linear-gradient(var(--color) 1px, transparent 1px),
    linear-gradient(90deg, var(--color) 1px, transparent 1px),
    linear-gradient(var(--color) 1px, transparent 1px),
    linear-gradient(90deg, var(--color) 1px, transparent 1px);
  background-size: calc(var(--size) * 8) calc(var(--size) * 8), calc(var(--size) * 8) calc(var(--size) * 8), var(--size) var(--size), var(--size) var(--size);
  background-position: -1px -1px, -1px -1px, -1px -1px, -1px -1px;
}
</style>
