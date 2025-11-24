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

const highlighter = await getSingletonHighlighter({
  themes: ['vitesse-dark'],
  langs: ['vue', 'tsx'],
})

const hasCode = computed(() => props.code.trim().length > 0)

const codeHtml = computed(() => {
  if (!hasCode.value) {
    return ''
  }

  return highlighter.codeToHtml(props.code, {
    lang: 'vue',
    theme: 'vitesse-dark',
    transformers: [
      transformerNotationHighlight(),
    ],
  })
})

const previewRadiusStyle = computed(() => (hasCode.value
  ? {
      borderBottomLeftRadius: '0',
      borderBottomRightRadius: '0',
    }
  : {}))
const containerCS = useContainerDefaultCS()
</script>

<template>
  <div
    class="border rounded-xl flex flex-col overflow-hidden"
    :class="containerCS.class"
    :style="containerCS.style"
  >
    <section
      v-if="$slots.form"
      class="px-6 py-5 border-b"
      :class="surfaceBorderCS.class"
      :style="surfaceBorderCS.style"
    >
      <div class="demo-form-grid">
        <slot name="form" />
      </div>
    </section>
    <section
      class="gird-paper-background px-6 py-10 flex min-h-56 w-full items-center justify-center"
      :class="[surfaceBorderCS.class, hasCode ? 'border-b' : '']"
      :style="[surfaceBorderCS.style, previewRadiusStyle]"
    >
      <slot name="preview" />
    </section>
    <section
      v-if="hasCode"
      class="not-prose text-sm"
      :class="surfaceBorderCS.class"
      :style="surfaceBorderCS.style"
    >
      <div class="px-6 py-5">
        <div
          class="rounded-b-xl overflow-hidden children:p-2 children:overflow-auto children:outline-none!"
          v-html="codeHtml"
        />
      </div>
    </section>
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

.demo-form-grid {
  display: grid;
  gap: 1.25rem;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
}

.demo-form-grid > * {
  min-width: 0;
}

@media (min-width: 1280px) {
  .demo-form-grid {
    column-gap: 1.5rem;
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .demo-form-grid > * {
    padding-left: 1rem;
    border-left: 1px solid rgb(var(--r-color-surface-5) / 0.35);
  }

  .demo-form-grid > *:nth-child(4n+1) {
    padding-left: 0;
    border-left: none;
  }
}
</style>
