<script setup lang="ts">
import { Btn, Paper, Popover, Tooltip } from '../../components'
</script>

<template>
  <div class="p-20 flex flex-col gap-4">
    <Popover position="top-start">
      <Btn>Click me</Btn>
      <template #content>
        <Paper>
          <div class="text-sm">
            Popover content
          </div>
          <div class="text-xs">
            This is a popover
          </div>
        </Paper>
      </template>
    </Popover>

    <Popover position="left">
      <Btn>Click me</Btn>
      <template #content>
        <Paper>
          <div class="text-sm">
            Popover content
          </div>
          <div class="text-xs">
            This is a popover
          </div>
        </Paper>
      </template>
    </Popover>

    <Tooltip>
      <Btn>Click me</Btn>
      <template #content>
        <div class="text-sm">
          Popover content
        </div>
        <div class="text-xs">
          This is a popover
        </div>
      </template>
    </Tooltip>

    <Popover>
      <Btn>Click me</Btn>
      <template #content>
        <Paper>
          <div class="text-sm">
            Popover content
          </div>
          <div class="text-xs">
            This is a popover
          </div>
        </Paper>
      </template>
    </Popover>

    <Popover trigger="hover">
      <Btn>Hover me</Btn>
      <template #content>
        <Paper>
          <div class="text-sm">
            Popover content
          </div>
          <div class="text-xs">
            This is a popover
          </div>
        </Paper>
      </template>
    </Popover>
  </div>
</template>
