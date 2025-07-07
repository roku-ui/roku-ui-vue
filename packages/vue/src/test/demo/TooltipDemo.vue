<script setup>
</script>

<template>
  <div class="p-6 space-y-8">
    <h1 class="text-3xl font-bold">
      Tooltip Demo
    </h1>

    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        Basic Tooltips
      </h2>

      <div class="flex flex-wrap gap-4">
        <Tooltip>
          <Btn hover-variant="filled">
            Hover me
          </Btn>
          <template #content>
            This is a tooltip
          </template>
        </Tooltip>

        <Tooltip>
          <Btn
            variant="filled"
            color="secondary"
          >
            Secondary Button
          </Btn>
          <template #content>
            Tooltip for secondary button
          </template>
        </Tooltip>

        <Tooltip>
          <Avatar name="JC" />
          <template #content>
            User Avatar
          </template>
        </Tooltip>
      </div>
    </section>
  </div>
</template>
