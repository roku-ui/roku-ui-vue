<script setup lang="ts">
import { Avatar, Paper } from '@/components'
</script>

<template>
  <div class="p-6 space-y-8">
    <h1 class="text-3xl font-bold">
      Avatar Demo
    </h1>

    <section class="space-y-3">
      <h2 class="text-xl font-semibold">
        基础
      </h2>
      <div class="flex flex-wrap gap-3 items-center">
        <Avatar name="Jannchie" />
        <Avatar name="Jannchie Pan" />
        <Avatar
          size="sm"
          name="见齐"
        />
        <Avatar
          size="lg"
          name="あ"
        />
        <Avatar
          size="xl"
          name="あ"
        />
      </div>
    </section>

    <section class="space-y-3">
      <h2 class="text-xl font-semibold">
        颜色与变体
      </h2>
      <div class="flex flex-wrap gap-3 items-center">
        <Avatar name="Default" />
        <Avatar
          name="Primary"
          variant="filled"
          color="primary"
        />
        <Avatar
          name="Secondary"
          variant="light"
          color="secondary"
        />
        <Avatar
          name="Outline"
          variant="outline"
          color="tertiary"
        />
        <Avatar
          name="Inverted"
          variant="inverted"
          color="success"
        />
        <Avatar
          name="Warning"
          variant="filled"
          color="warning"
        />
      </div>
    </section>

    <section class="space-y-3">
      <h2 class="text-xl font-semibold">
        占位与回退
      </h2>
      <div class="flex flex-wrap gap-3 items-center">
        <Avatar skeleton />
        <Avatar name="Initials" />
        <Avatar />
        <Avatar
          name="Broken"
          src="https://this-avatar-will-404.invalid/avatar.png"
        />
        <Avatar
          variant="filled"
          color="primary"
        >
          <i class="i-tabler-robot" />
        </Avatar>
      </div>
    </section>

    <section class="space-y-3">
      <h2 class="text-xl font-semibold">
        边角与圆角
      </h2>
      <div class="flex flex-wrap gap-3 items-center">
        <Avatar name="Full" />
        <Avatar
          name="Rounded"
          rounded="lg"
        />
        <Avatar
          name="Square"
          rounded="none"
        />
        <Avatar
          name="Notch"
          size="lg"
          corner-shape="notch"
        />
        <Avatar
          name="Bevel"
          size="lg"
          corner-shape="bevel"
        />
        <Avatar
          name="Scoop"
          size="lg"
          corner-shape="scoop"
        />
        <Avatar
          name="Squircle"
          size="lg"
          corner-shape="squircle"
        />
      </div>
    </section>

    <section class="space-y-3">
      <h2 class="text-xl font-semibold">
        图片与尺寸
      </h2>
      <Paper class="p-4 flex flex-wrap gap-3 items-center">
        <Avatar
          size="sm"
          src="https://avatars.githubusercontent.com/u/29743310?v=4"
        />
        <Avatar src="https://avatars.githubusercontent.com/u/29743310?v=4" />
        <Avatar
          size="lg"
          src="https://avatars.githubusercontent.com/u/29743310?v=4"
        />
        <Avatar
          :size="4"
          src="https://avatars.githubusercontent.com/u/29743310?v=4"
        />
        <Avatar
          :size="5.5"
          src="https://avatars.githubusercontent.com/u/29743310?v=4"
        />
        <Avatar
          size="sm"
          corner-shape="squircle"
          src="https://avatars.githubusercontent.com/u/29743310?v=4"
        />
        <Avatar src="https://avatars.githubusercontent.com/u/29743310?v=4" />
        <Avatar
          size="lg"
          corner-shape="squircle"
          src="https://avatars.githubusercontent.com/u/29743310?v=4"
        />
        <Avatar
          :size="4"
          corner-shape="squircle"
          src="https://avatars.githubusercontent.com/u/29743310?v=4"
        />
        <Avatar
          :size="5.5"
          corner-shape="squircle"
          src="https://avatars.githubusercontent.com/u/29743310?v=4"
        />
      </Paper>
    </section>
  </div>
</template>
