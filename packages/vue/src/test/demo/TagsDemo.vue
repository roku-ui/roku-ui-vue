<script setup lang="ts">
import type { BtnVariant } from '@/types'
import { Tag } from '@/components'
import { Paper } from '../../components'

const colors = ['default', 'primary', 'secondary', 'tertiary', 'error', 'crimson', 'darkorchid', 'dodgerblue']
const variants: BtnVariant[] = ['default', 'filled', 'light', 'outline', 'transparent', 'subtle', 'contrast', 'white']
</script>

<template>
  <div class="flex justify-center">
    <Paper class="flex flex-col gap-4">
      <div class="flex flex-col gap-2">
        <h3 class="text-lg font-semibold">
          Non-clickable Tags (no hover effects)
        </h3>
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
      </div>

      <div class="flex flex-col gap-2">
        <h3 class="text-lg font-semibold">
          Clickable Tags (with hover effects)
        </h3>
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
              @click="() => console.log(`Clicked ${variant} tag with color ${color}`)"
            >
              <span>
                {{ variant }}
              </span>
            </Tag>
          </div>
        </template>
      </div>

      <div class="flex flex-col gap-2">
        <h3 class="text-lg font-semibold">
          Tags with leftSection and rightSection
        </h3>
        <div class="flex flex-wrap gap-1">
          <Tag
            color="primary"
            variant="filled"
            rounded="full"
          >
            <template #leftSection>
              <i class="i-carbon-user shrink-0" />
            </template>
            <span>User</span>
          </Tag>

          <Tag
            color="secondary"
            variant="outline"
            rounded="md"
          >
            <span>Settings</span>
            <template #rightSection>
              <i class="i-carbon-settings shrink-0" />
            </template>
          </Tag>

          <Tag
            color="tertiary"
            variant="light"
            rounded="lg"
          >
            <template #leftSection>
              <i class="i-carbon-star shrink-0" />
            </template>
            <span>Favorite</span>
            <template #rightSection>
              <i class="i-carbon-chevron-down shrink-0" />
            </template>
          </Tag>

          <Tag
            color="error"
            variant="subtle"
            rounded="full"
          >
            <template #leftSection>
              <i class="i-carbon-warning shrink-0" />
            </template>
            <span>Alert</span>
          </Tag>
        </div>
      </div>
    </Paper>
  </div>
</template>
