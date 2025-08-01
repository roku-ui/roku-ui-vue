<script setup lang="ts">
import { refAutoReset } from '@vueuse/core'
import { onMounted } from 'vue'
import { Notifications } from '../..'
import { Btn, Notification } from '../../components'

const isLoading = refAutoReset(false, 3000)
onMounted(() => {
  isLoading.value = true
})
</script>

<template>
  <div class="p-6 space-y-8">
    <h1 class="text-3xl font-bold">
      Notification Demo
    </h1>

    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        Static Notifications
      </h2>

      <div class="flex flex-col gap-2">
        <Notification
          title="Notification Title"
          message="Notification Message"
          :loading="isLoading"
          size="sm"
        />
        <Notification
          title="Notification Title"
          message="Notification Message"
          :loading="isLoading"
          size="lg"
        />
        <Notification
          title="Notification Title"
          message="Notification Message"
          :loading="isLoading"
        />
        <Notification
          message="Notification Message"
          :loading="isLoading"
        />
        <Notification
          title="Notification Title"
          :loading="isLoading"
        />
        <Notification
          with-border
          title="Notification Title"
          :loading="isLoading"
        />
        <Notification
          color="tertiary"
          title="Notification Title"
          :loading="isLoading"
        />
        <Notification
          message="Notification Title"
          icon="i-tabler-alert-circle"
          :loading="isLoading"
        />
      </div>
    </section>

    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        Dynamic Notifications
      </h2>

      <div class="flex flex-wrap gap-2">
        <Btn @click="Notifications.show({ title: `Triggered at: ${new Date().toLocaleTimeString()}`, durationMS: 5000, position: 'top-left' })">
          Push Left
        </Btn>
        <Btn @click="Notifications.show({ title: `Triggered at: ${new Date().toLocaleTimeString()}`, durationMS: 5000, position: 'top' })">
          Push Center
        </Btn>
        <Btn @click="Notifications.show({ title: `Triggered at: ${new Date().toLocaleTimeString()}`, durationMS: 5000, position: 'top-right' })">
          Push Right
        </Btn>
        <Btn @click="Notifications.show({ title: `Triggered at: ${new Date().toLocaleTimeString()}`, durationMS: 5000, position: 'bottom-left' })">
          Push BL
        </Btn>
        <Btn @click="Notifications.show({ title: `Triggered at: ${new Date().toLocaleTimeString()}`, durationMS: 5000, position: 'bottom' })">
          Push BC
        </Btn>
        <Btn @click="Notifications.show({ title: `Triggered at: ${new Date().toLocaleTimeString()}`, durationMS: 5000, position: 'bottom-right' })">
          Push BR
        </Btn>
      </div>
    </section>
  </div>
</template>
