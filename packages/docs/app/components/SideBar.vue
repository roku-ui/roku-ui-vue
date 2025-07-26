<script setup lang="ts">
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

const treeListItems = computed(() => {
  if (!contentComponents.value || !Array.isArray(contentComponents.value)) {
    return []
  }
  const sortedA = [...contentComponents.value].sort((a, b) => {
    const aDir = a.stem.split('/')[1] // components/display/avatar -> display
    const bDir = b.stem.split('/')[1]
    if (!aDir) {
      return -1
    }
    if (!bDir) {
      return 1
    }
    return aDir.localeCompare(bDir)
  })
  const res = sortedA.map((cc) => {
    return {
      value: cc.path,
      title: cc.title,
      is: NuxtLink,
      attrs: {
        to: cc.path,
      },
      dir: cc.stem.split('/')[1], // components/display/avatar -> display
    }
  })
  let currentDir = ''
  for (const r of res) {
    if (r.dir !== currentDir) {
      currentDir = r.dir
      if (currentDir === 'components') {
        continue
      }
      res.splice(res.indexOf(r), 0, {
        title: dir2Title(currentDir),
        value: undefined,
        is: undefined,
        attrs: { to: undefined },
        dir: undefined,
      })
    }
  }
  return [
    {
      title: dir2Title('components'),
      open: true,
      children: res,
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
            v-bind="subTextCS"
          >
            工具
          </div>
          <div>
            <Btn
              :is="NuxtLink"
              icon
              href="/tools/theme"
              variant="light"
            >
              <i class="i-tabler-color-filter" />
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
