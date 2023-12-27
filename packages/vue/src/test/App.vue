<script setup lang="ts">
import { Notifications } from '..'

const isLoading = refAutoReset(false, 3000)
onMounted(() => {
  isLoading.value = true
})
</script>

<template>
  <RokuProvider>
    <NotificationSystem />
    <div class="h-100vh w-100vw flex flex-col items-center gap-2">
      <Btn @click="Notifications.show({ title: `Triggered at: ${new Date().toLocaleTimeString()}` })">
        Push Notification
      </Btn>
      <div class="flex gap-2">
        <Switch disabled />
      </div>
      <div class="flex gap-2">
        <Switch />
        <Switch color="error" />
        <Switch
          size="sm"
        />
        <Switch
          size="lg"
        />
      </div>
      <div class="flex gap-2">
        <Switch
          rounded="none"
        />
        <Switch
          rounded="sm"
        />
        <Switch
          rounded="md"
        />
        <Switch
          rounded="lg"
        />
      </div>
      <div class="flex flex-col gap-2">
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
          border
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
      <div class="flex gap-2">
        <Btn>Button</Btn>
      </div>
      <div class="flex gap-2">
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
      </div>
      <div class="flex gap-2">
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
      </div>
      <div class="flex gap-2">
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
      </div>
      <div class="flex gap-2">
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
      </div>
      <div class="flex gap-2">
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
      </div>
      <div class="flex gap-2">
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
      </div>
      <div class="flex gap-2">
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
      </div>
      <div class="flex gap-2">
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
      </div>
      <div class="flex gap-2">
        <Btn
          variant="constrast"
          color="primary"
        >
          Button
        </Btn>
        <Btn
          variant="constrast"
          color="secondary"
        >
          Button
        </Btn>
      </div>
    </div>
  </RokuProvider>
</template>
