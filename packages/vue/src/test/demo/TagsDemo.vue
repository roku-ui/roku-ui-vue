<script setup lang="ts">
import type { BtnVariant } from '@/types'

const colors = ['default', 'primary', 'secondary', 'tertiary', 'error', 'crimson', 'darkorchid', 'dodgerblue']
const variants: BtnVariant[] = ['default', 'filled', 'light', 'outline', 'transparent', 'subtle', 'contrast', 'white']
</script>

<template>
  <div class="flex justify-center">
    <Paper class="flex flex-col gap-2">
      <template
        v-for="color in colors"
        :key="color"
      >
        <div class="flex gap-1">
          <Tag
            v-for="variant in variants"
            :key="variant"
            :color="color"
            :variant="variant"
            rounded="full"
          >
            <span>
              {{ variant }}
            </span>
          </Tag>
        </div>
      </template>
    </Paper>
  </div>
</template>
