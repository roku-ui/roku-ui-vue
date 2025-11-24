<script setup lang="ts">
import type { TreeListItemData } from '@roku-ui/vue'
import { NuxtLink } from '#components'
import { Btn, TreeList } from '@roku-ui/vue'
import { subTextCS } from '@/utils/colors'

defineProps<{
  isOpen: boolean
}>()
const { data: contentComponents } = await useAsyncData('home', () => queryCollection('content').where('path', 'LIKE', '/components%').all())

const currentPath = useRoute().path
function dir2Title(dir: string) {
  switch (dir) {
    case 'components': {
      return '组件'
    }
    case 'display': {
      return '显示'
    }
    case 'feedback': {
      return '反馈'
    }
    case 'form': {
      return '表单'
    }
    case 'layout': {
      return '布局'
    }
    case 'navigation': {
      return '导航'
    }
    case 'overlay': {
      return '覆盖'
    }
    case 'inputs': {
      return '输入'
    }
    default: {
      return dir
    }
  }
}

const treeListItems = computed<TreeListItemData[]>(() => {
  if (!Array.isArray(contentComponents.value)) {
    return []
  }
  const sortedComponents = contentComponents.value.toSorted((a, b) => {
    const aDir = a.stem.split('/')[1]
    const bDir = b.stem.split('/')[1]
    if (!aDir) {
      return -1
    }
    if (!bDir) {
      return 1
    }
    return aDir.localeCompare(bDir)
  })
  const children: TreeListItemData[] = []
  let currentDir: string | null = null
  for (const component of sortedComponents) {
    const dir = component.stem.split('/')[1] ?? ''
    if (dir && dir !== 'components' && dir !== currentDir) {
      currentDir = dir
      children.push({
        title: dir2Title(dir),
      })
    }
    else {
      currentDir = dir
    }
    const title = typeof component.title === 'string' && component.title.length > 0
      ? component.title
      : component.stem.split('/').at(-1) ?? component.path
    children.push({
      value: component.path,
      title,
      is: NuxtLink,
      attrs: {
        to: component.path,
      },
    })
  }
  return [
    {
      title: dir2Title('components'),
      open: true,
      children,
    },
  ]
})
</script>

<template>
  <div
    :class="{
      '-translate-x-100%': !isOpen,
      'translate-x-0': isOpen,
    }"
    class="bg-surface flex flex-col gap-2 h-100vh min-w-64 w-33vw items-end top-12 fixed z-10 md:translate-x-0"
  >
    <div class="px-8 py-6 flex flex-col gap-8 h-100vh w-86 overflow-y-auto">
      <div>
        <div>
          <NuxtLink
            to="/"
            class="text-xl font-bold"
          >
            Roku UI - Vue
          </NuxtLink>
        </div>
        <NuxtLink
          to="/"
          class="text-sm op58"
        >
          @roku-ui/vue
        </NuxtLink>
      </div>
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <div
            class="text-sm"
            :class="subTextCS.class"
            :style="subTextCS.style"
          >
            工具
          </div>
          <div>
            <Btn
              :is="NuxtLink"
              icon
              href="/tools/theme"
              variant="light"
              aria-label="Theme tool"
            >
              <i class="i-tabler-palette" />
            </Btn>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <div>
            <TreeList
              :model-value="currentPath"
              :items="treeListItems || []"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.content-link.router-link-active {
  color: rgb(var(--r-color-primary-3));
}
</style>

<style scoped>
* {
  outline-width: 2px;
  outline-offset: 1px;
}
*:focus-visible {
  --un-outline-color-opacity: 1;
  outline-color: rgb(
    var(--r-color-primary-3) / var(--un-outline-color-opacity)
  );
  outline-style: solid;
}
</style>
