<script setup>
import { ref } from 'vue'

const loading = ref(false)
</script>

<template>
  <div class="p-6 space-y-8">
    <h1 class="text-3xl font-bold">
      Button Demo
    </h1>

    <Paper class="flex flex-wrap gap-2">
      <Btn>Button</Btn>
    </Paper>

    <Paper class="flex flex-wrap gap-2">
      <Btn rounded="none">
        Button
      </Btn>
      <Btn rounded="sm">
        Button
      </Btn>
      <Btn rounded="md">
        Button
      </Btn>
      <Btn rounded="lg">
        Button
      </Btn>
      <Btn rounded="full">
        Button
      </Btn>
    </Paper>

    <Paper class="flex flex-wrap gap-2">
      <Btn
        variant="filled"
        color="secondary"
      >
        Button
      </Btn>
      <Btn
        variant="filled"
        color="tertiary"
      >
        Button
      </Btn>
      <Btn
        variant="filled"
        color="error"
      >
        Button
      </Btn>
    </Paper>

    <Paper class="flex flex-wrap gap-2">
      <Btn
        variant="filled"
        color="error"
        disabled
      >
        Button
      </Btn>
      <Btn
        variant="filled"
        color="primary"
        disabled
      >
        Button
      </Btn>
    </Paper>

    <Paper class="flex flex-wrap gap-2">
      <Btn
        variant="filled"
        color="primary"
        size="sm"
      >
        Button
      </Btn>
      <Btn
        variant="filled"
        color="primary"
      >
        Button
      </Btn>
      <Btn
        variant="filled"
        color="primary"
        size="lg"
      >
        Button
      </Btn>
    </Paper>

    <Paper class="flex flex-wrap gap-2">
      <Btn
        variant="light"
        color="primary"
      >
        Button
      </Btn>
      <Btn
        variant="light"
        color="secondary"
      >
        Button
      </Btn>
    </Paper>

    <Paper class="flex flex-wrap gap-2">
      <Btn
        variant="outline"
        color="primary"
      >
        Button
      </Btn>
      <Btn
        variant="outline"
        color="secondary"
      >
        Button
      </Btn>
    </Paper>

    <Paper class="flex flex-wrap gap-2">
      <Btn
        variant="subtle"
        color="primary"
      >
        Button
      </Btn>
      <Btn
        variant="subtle"
        color="secondary"
      >
        Button
      </Btn>
    </Paper>

    <Paper class="flex flex-wrap gap-2">
      <Btn
        variant="transparent"
        color="primary"
      >
        Button
      </Btn>
      <Btn
        variant="transparent"
        color="secondary"
      >
        Button
      </Btn>
    </Paper>

    <Paper class="flex flex-wrap gap-2">
      <Btn
        variant="contrast"
        color="primary"
      >
        Button
      </Btn>
      <Btn
        variant="contrast"
        color="secondary"
      >
        Button
      </Btn>
      <Btn
        variant="contrast"
        color="secondary"
        skeleton
      >
        Button
      </Btn>
    </Paper>

    <Paper>
      <Btn @click="loading = !loading">
        {{ loading ? 'Stop' : 'Start' }} Loading
      </Btn>
    </Paper>

    <!-- Buttons with Left Section -->
    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        Buttons with Left Section
      </h2>

      <Paper class="flex flex-wrap gap-2">
        <Btn
          variant="filled"
          color="primary"
        >
          <template #leftSection>
            <div class="i-heroicons-plus" />
          </template>
          Add Item
        </Btn>

        <Btn
          variant="outline"
          color="secondary"
        >
          <template #leftSection>
            <i class="i-heroicons-magnifying-glass" />
          </template>
          Search
        </Btn>

        <Btn
          variant="light"
          color="tertiary"
        >
          <template #leftSection>
            <div class="i-heroicons-heart" />
          </template>
          Like
        </Btn>

        <Btn
          variant="subtle"
          color="error"
        >
          <template #leftSection>
            <div class="i-heroicons-trash" />
          </template>
          Delete
        </Btn>
      </Paper>
    </section>

    <!-- Buttons with Right Section -->
    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        Buttons with Right Section
      </h2>

      <Paper class="flex flex-wrap gap-2">
        <Btn
          variant="filled"
          color="primary"
        >
          Download
          <template #rightSection>
            <div class="i-heroicons-arrow-down-tray" />
          </template>
        </Btn>

        <Btn
          variant="outline"
          color="secondary"
        >
          Settings
          <template #rightSection>
            <div class="i-heroicons-cog-6-tooth" />
          </template>
        </Btn>

        <Btn
          variant="light"
          color="tertiary"
        >
          External Link
          <template #rightSection>
            <div class="i-heroicons-arrow-top-right-on-square" />
          </template>
        </Btn>

        <Btn
          variant="transparent"
          color="primary"
        >
          Next
          <template #rightSection>
            <div class="i-heroicons-chevron-right" />
          </template>
        </Btn>
      </Paper>
    </section>

    <!-- Buttons with Both Sections -->
    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        Buttons with Both Sections
      </h2>

      <Paper class="flex flex-wrap gap-2">
        <Btn
          variant="filled"
          color="primary"
        >
          <template #leftSection>
            <div class="i-heroicons-play" />
          </template>
          Play Audio
          <template #rightSection>
            <div class="i-heroicons-speaker-wave" />
          </template>
        </Btn>

        <Btn
          variant="outline"
          color="secondary"
        >
          <template #leftSection>
            <div class="i-heroicons-document-text" />
          </template>
          Export File
          <template #rightSection>
            <div class="i-heroicons-arrow-up-tray" />
          </template>
        </Btn>

        <Btn
          variant="light"
          color="tertiary"
        >
          <template #leftSection>
            <div class="i-heroicons-shield-check" />
          </template>
          Secure Action
          <template #rightSection>
            <div class="i-heroicons-key" />
          </template>
        </Btn>
      </Paper>
    </section>

    <!-- Icon Only Buttons -->
    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        Icon Only Buttons
      </h2>

      <Paper class="flex flex-wrap gap-2">
        <Btn
          variant="filled"
          color="primary"
          icon
        >
          <div class="i-heroicons-plus" />
        </Btn>

        <Btn
          variant="outline"
          color="secondary"
          icon
        >
          <div class="i-heroicons-pencil" />
        </Btn>

        <Btn
          variant="light"
          color="tertiary"
          icon
        >
          <div class="i-heroicons-heart" />
        </Btn>

        <Btn
          variant="subtle"
          color="error"
          icon
        >
          <div class="i-heroicons-trash" />
        </Btn>

        <Btn
          variant="transparent"
          color="primary"
          icon
        >
          <div class="i-heroicons-ellipsis-horizontal" />
        </Btn>
      </Paper>
    </section>

    <!-- Different Sizes with Sections -->
    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        Different Sizes with Sections
      </h2>

      <Paper class="flex flex-wrap items-center gap-2">
        <Btn
          variant="filled"
          color="primary"
          size="sm"
        >
          <template #leftSection>
            <div class="i-heroicons-plus" />
          </template>
          Small
        </Btn>

        <Btn
          variant="filled"
          color="primary"
          size="md"
        >
          <template #leftSection>
            <div class="i-heroicons-plus" />
          </template>
          Medium
        </Btn>

        <Btn
          variant="filled"
          color="primary"
          size="lg"
        >
          <template #leftSection>
            <div class="i-heroicons-plus" />
          </template>
          Large
        </Btn>
      </Paper>
    </section>
  </div>
</template>
