<script setup lang="ts">
import { ref } from 'vue'
import { Paper, Btn, ThemeProvider, Indicator, Image, Progress, Chip, Tag } from '../../components'

const loading = ref(false)
</script>

<template>
  <div class="p-6 space-y-8">
    <h1 class="text-3xl font-bold">
      Layout Demo
    </h1>

    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        Papers
      </h2>

      <Paper
        :loading="loading"
        with-border
      >
        <Btn @click="loading = !loading">
          {{ loading ? 'Stop' : 'Start' }} Loading
        </Btn>
      </Paper>

      <div class="flex flex-col gap-2">
        <div class="flex gap-2">
          <Paper
            trace-animate
            class="flex h-24 w-32 items-center justify-center"
          >
            Trace
          </Paper>
          <Paper
            trace-animate
            class="flex h-24 w-32 items-center justify-center"
          >
            Trace
          </Paper>
        </div>
        <div class="flex gap-2">
          <Paper
            trace-animate
            class="flex h-24 w-32 items-center justify-center"
          >
            Trace
          </Paper>
          <Paper
            trace-animate
            class="flex h-24 w-32 items-center justify-center"
          >
            Trace
          </Paper>
        </div>
      </div>
    </section>

    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        Theme Providers
      </h2>

      <div class="flex gap-4">
        <ThemeProvider scheme="light">
          <Paper class="m-4">
            Light Theme
          </Paper>
        </ThemeProvider>
        <ThemeProvider scheme="dark">
          <Paper class="m-4">
            Dark Theme
          </Paper>
        </ThemeProvider>
      </div>
    </section>

    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        Surface Colors
      </h2>

      <div>
        <div class="bg-surface-base">
          bg-surface-base
        </div>
        <div class="bg-surface">
          bg-surface
        </div>
        <div class="bg-surface-variant-1">
          bg-surface-variant-1
        </div>
        <div class="border border-surface">
          border-surface
        </div>
        <div class="text-surface">
          text-surface
        </div>
        <div class="text-surface-dimmed">
          text-surface-dimmed
        </div>
      </div>

      <div class="theme-filled">
        theme-filled test
      </div>
    </section>

    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        Indicators
      </h2>

      <Paper class="flex flex-wrap gap-2">
        <Indicator size="lg">
          <template #label>
            1
          </template>
          <Image
            style="height: 4rem; width: 4rem"
            src="https://avatars.githubusercontent.com/u/29743310?v=4"
          />
        </Indicator>
        <Indicator>
          <template #label>
            1
          </template>
          <Image
            style="height: 4rem; width: 4rem"
            src="https://avatars.githubusercontent.com/u/29743310?v=4"
          />
        </Indicator>
        <Indicator size="sm">
          <template #label>
            1
          </template>
          <Image
            style="height: 4rem; width: 4rem"
            src="https://avatars.githubusercontent.com/u/29743310?v=4"
          />
        </Indicator>
      </Paper>

      <Paper class="flex flex-wrap gap-2">
        <Indicator>
          <Image
            style="height: 4rem; width: 4rem"
            src="https://avatars.githubusercontent.com/u/29743310?v=4"
          />
        </Indicator>
        <Indicator ping>
          <Image
            style="height: 4rem; width: 4rem"
            src="https://avatars.githubusercontent.com/u/29743310?v=4"
          />
        </Indicator>
        <Indicator
          ping
          position="bottom-left"
        >
          <Image
            style="height: 4rem; width: 4rem"
            src="https://avatars.githubusercontent.com/u/29743310?v=4"
          />
        </Indicator>
        <Indicator size="sm">
          <Image
            style="height: 4rem; width: 4rem"
            src="https://avatars.githubusercontent.com/u/29743310?v=4"
          />
        </Indicator>
        <Indicator size="lg">
          <Image
            style="height: 4rem; width: 4rem"
            src="https://avatars.githubusercontent.com/u/29743310?v=4"
          />
        </Indicator>
      </Paper>
    </section>

    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        Progress
      </h2>

      <Progress
        class="max-w-md"
        loading
      />
      <Progress
        class="max-w-md"
        :value="30"
      />
      <Progress
        color="error"
        :value="99"
        class="max-w-md"
      />
      <Progress
        size="sm"
        :value="47"
        class="max-w-md"
      />
      <Progress
        size="lg"
        :value="47"
        class="max-w-md"
      />
    </section>

    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        Chips
      </h2>

      <Paper class="flex flex-wrap gap-2">
        <Chip size="sm">
          Chip
        </Chip>
        <Chip size="md">
          Chip
        </Chip>
        <Chip size="lg">
          Chip
        </Chip>
      </Paper>

      <Paper class="flex flex-wrap gap-2">
        <Chip variant="filled">
          Chip
        </Chip>
        <Chip
          variant="filled"
          color="secondary"
        >
          Chip
        </Chip>
        <Chip
          variant="filled"
          color="tertiary"
        >
          Chip
        </Chip>
      </Paper>

      <Paper class="flex flex-wrap gap-2">
        <Chip variant="light">
          Chip
        </Chip>
        <Chip
          variant="light"
          color="secondary"
        >
          Chip
        </Chip>
        <Chip
          variant="light"
          color="tertiary"
        >
          Chip
        </Chip>
      </Paper>

      <Paper class="flex flex-wrap gap-2">
        <Chip rounded="none">
          Chip
        </Chip>
        <Chip rounded="md">
          Chip
        </Chip>
        <Chip rounded="full">
          Chip
        </Chip>
      </Paper>
    </section>

    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        Tags
      </h2>

      <div class="flex flex-col gap-2 items-center">
        <Tag>
          <template #leftSection>
            Left
          </template>
          <template #rightSection>
            Right
          </template>
          Abc
        </Tag>

        <Tag
          color="secondary"
          variant="subtle"
        >
          Tag
        </Tag>
      </div>
    </section>
  </div>
</template>
