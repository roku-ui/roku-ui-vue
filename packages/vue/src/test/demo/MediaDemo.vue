<script setup lang="ts">
import { computed, ref } from 'vue'
import { generateColors, Notifications } from '../..'
import { AspectRatio, ColorInput, ColorSwatch, Dropzone, Image, Overlay, Paper } from '../../components'

// Allow undefined assignment for file selection handling
const file = ref<File | null | undefined>(null)
const color = ref('#5474B4')
const colors = computed(() => generateColors(color.value))

// Demo theme colors
const primaryColor = ref('#0067cc')
const surfaceColor = ref('#121212')

function onDrop(files: File[] | null) {
  if (files && files.length > 0) {
    file.value = files[0]
    Notifications.show({
      title: 'Files dropped',
      message: files.map(file => file.name).join(', '),
    })
  }
  else {
    Notifications.show({
      title: 'Files dropped',
      message: 'No files dropped',
    })
  }
}
</script>

<template>
  <div class="p-6 space-y-8">
    <h1 class="text-3xl font-bold">
      Media & Colors Demo
    </h1>

    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        Images
      </h2>

      <Paper>
        <AspectRatio
          class="w-60"
          :ratio="16 / 9"
        >
          <Image src="https://picsum.photos/seed/2/512/512" />
        </AspectRatio>
      </Paper>

      <Overlay
        blur
        rounded="md"
      >
        <Image
          height="312px"
          width="312px"
          src="https://picsum.photos/seed/2/512/512"
        />
        <template #content>
          <div class="text-white flex h-full w-full items-center justify-center">
            This is an overlay
          </div>
        </template>
      </Overlay>

      <Image
        style="height: 4rem; width: 4rem"
        rounded="lg"
        src="https://avatars.githubusercontent.com/u/29743310?v=4"
      />
    </section>

    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        Color Picker
      </h2>

      <Paper class="flex gap-2 items-center">
        <ColorInput v-model="color" />
        <ColorInput v-model="primaryColor" />
        <ColorInput v-model="surfaceColor" />
      </Paper>

      <Paper class="flex flex-wrap gap-2">
        <ColorSwatch
          v-for="c in colors"
          :key="c"
          :color="c"
        />
      </Paper>
    </section>

    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        Dropzone
      </h2>

      <Paper class="h-72 w-128">
        <Dropzone @drop="onDrop">
          <div v-if="file">
            {{ file.name }}
          </div>
          <div v-else>
            Files drop here
          </div>
        </Dropzone>
      </Paper>
    </section>
  </div>
</template>
