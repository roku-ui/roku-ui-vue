<script setup lang="ts">
import { Notifications } from '..'

const isLoading = refAutoReset(false, 3000)
onMounted(() => {
  isLoading.value = true
})
const chip = ref(true)
const modal1 = ref(false)
const modal2 = ref(false)
const modal3 = ref(false)
const modal4 = ref(false)
const modal5 = ref(false)
const select = ref()
const theme = ref<'light' | 'dark'>('dark')
watchEffect(() => {
  document.documentElement.dataset.theme = theme.value
})
const isDark = computed({ get: () => theme.value === 'dark', set: v => theme.value = v ? 'dark' : 'light' })
</script>

<template>
  <RokuProvider>
    <NotificationSystem />
    <div class="flex flex-col items-center gap-2">
      <div class="flex items-center gap-2">
        <Switch
          v-model="isDark"
          color="secondary"
        />
      </div>
      <div class="flex items-center gap-2">
        <Avatar
          size="sm"
          src="https://avatars.githubusercontent.com/u/29743310?v=4"
        />
        <Avatar
          src="https://avatars.githubusercontent.com/u/29743310?v=4"
        />
        <Avatar
          size="lg"
          src="https://avatars.githubusercontent.com/u/29743310?v=4"
        />
        <Avatar
          size="4"
          src="https://avatars.githubusercontent.com/u/29743310?v=4"
        />
        <Avatar
          size="86px"
          src="https://avatars.githubusercontent.com/u/29743310?v=4"
        />
      </div>
      <Image
        class="h-16 w-16"
        src="https://avatars.githubusercontent.com/u/29743310?v=4"
      />
      <div class="flex flex-wrap gap-2">
        <Indicator size="lg">
          <template #label>
            1
          </template>
          <Image
            class="h-16 w-16"
            src="https://avatars.githubusercontent.com/u/29743310?v=4"
          />
        </indicator>
        <Indicator>
          <template #label>
            1
          </template>
          <Image
            class="h-16 w-16"
            src="https://avatars.githubusercontent.com/u/29743310?v=4"
          />
        </Indicator>
        <Indicator size="sm">
          <template #label>
            1
          </template>
          <Image
            class="h-16 w-16"
            src="https://avatars.githubusercontent.com/u/29743310?v=4"
          />
        </indicator>
      </div>
      <div class="flex flex-wrap gap-2">
        <Indicator>
          <Image
            class="h-16 w-16"
            src="https://avatars.githubusercontent.com/u/29743310?v=4"
          />
        </Indicator>
        <Indicator ping>
          <Image
            class="h-16 w-16"
            src="https://avatars.githubusercontent.com/u/29743310?v=4"
          />
        </Indicator>
        <Indicator
          ping
          position="bottom-left"
        >
          <Image
            class="h-16 w-16"
            src="https://avatars.githubusercontent.com/u/29743310?v=4"
          />
        </Indicator>
        <Indicator
          size="sm"
        >
          <Image
            class="h-16 w-16"
            src="https://avatars.githubusercontent.com/u/29743310?v=4"
          />
        </Indicator>
        <Indicator
          size="lg"
        >
          <Image
            class="h-16 w-16"
            src="https://avatars.githubusercontent.com/u/29743310?v=4"
          />
        </Indicator>
      </div>
      <div class="flex flex-wrap gap-2">
        <Slider />
      </div>
      <div class="flex flex-wrap gap-2">
        <Slider
          :min="2"
          :max="5"
        />
      </div>
      <div class="flex flex-wrap gap-2">
        <Slider :tick-num="5" />
      </div>
      <div class="flex flex-wrap gap-2">
        <Slider :options="['A', 'B', 'C']" />
      </div>

      <div class="flex flex-wrap gap-2">
        <Select
          v-model="select"
          placeholder="Select a fruit"
          :options="['apple', 'banana', 'orange']"
        />
        <Select />
      </div>
      <div class="flex flex-wrap gap-2">
        <Btn @click="modal1 = !modal1">
          Open Model
        </Btn>
        <Modal v-model="modal1">
          <Paper class="h-16 w-full flex items-center justify-center md:w-md">
            <div>
              Basic Modal
            </div>
          </Paper>
        </Modal>

        <Btn @click="modal2 = !modal2">
          Open Blur Model
        </Btn>
        <Modal
          v-model="modal2"
          blur="lg"
        >
          <Paper class="h-16 w-full flex items-center justify-center md:w-md">
            <div>
              Blur Modal
            </div>
          </Paper>
        </Modal>

        <Btn @click="modal3 = !modal3">
          Open Persistent Model
        </Btn>
        <Modal
          v-model="modal3"
          blur="lg"
          persistent
        >
          <Paper class="h-16 w-full flex items-center justify-center md:w-md">
            <Btn @click="modal3 = !modal3">
              Close
            </Btn>
          </Paper>
        </Modal>
        <Btn @click="modal4 = !modal4">
          Open Nested Modal
        </Btn>
        <Modal
          v-model="modal4"
        >
          <Paper class="h-16 w-full flex items-center justify-center md:w-md">
            <Btn @click="modal5 = !modal5">
              Open Nested Modal
            </Btn>
          </Paper>
        </Modal>
        <Modal
          v-model="modal5"
        >
          <Paper class="h-16 w-full flex items-center justify-center md:w-md">
            Inner Modal
          </Paper>
        </Modal>
      </div>
      <Progress
        color="error"
        :value="99"
        class="max-w-md"
      />
      <Progress
        class="max-w-md"
        loading
      />
      <Progress
        class="max-w-md"
        :value="30"
      />
      <PinInput />
      <PinInput password />
      <div class="flex flex-wrap gap-2">
        <Chip v-model="chip">
          Checkable Chip
        </Chip>
      </div>
      <div class="flex flex-wrap gap-2">
        <Chip size="sm">
          Chip
        </Chip>
        <Chip size="md">
          Chip
        </Chip>
        <Chip size="lg">
          Chip
        </Chip>
      </div>
      <div class="flex flex-wrap gap-2">
        <Chip rounded="none">
          Chip
        </Chip>
        <Chip rounded="md">
          Chip
        </Chip>
        <Chip rounded="full">
          Chip
        </Chip>
      </div>
      <div class="flex flex-wrap gap-2">
        <TextField placeholder="Placeholder" />
      </div>
      <div class="flex flex-wrap gap-2">
        <TextField rounded="none" />
        <TextField rounded="lg" />
        <TextField rounded="full" />
        <TextField rounded="0.5rem" />
      </div>
      <div class="flex flex-wrap gap-2">
        <TextField disabled />
        <TextField

          disabled
          error
        />
      </div>
      <div class="flex flex-wrap gap-2">
        <TextField error />
        <TextField color="tertiary" />
        <TextField color="secondary" />
        <TextField color="error" />
        <TextField />
      </div>
      <Btn @click="Notifications.show({ title: `Triggered at: ${new Date().toLocaleTimeString()}` })">
        Push Notification
      </Btn>
      <div class="flex flex-wrap gap-2">
        <Switch disabled />
      </div>
      <div class="flex flex-wrap gap-2">
        <Switch />
        <Switch color="error" />
        <Switch
          size="sm"
        />
        <Switch
          size="lg"
        />
      </div>
      <div class="flex flex-wrap gap-2">
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
      <div class="flex flex-wrap gap-2">
        <Btn>Button</Btn>
      </div>
      <div class="flex flex-wrap gap-2">
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
      <div class="flex flex-wrap gap-2">
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
      <div class="flex flex-wrap gap-2">
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
      <div class="flex flex-wrap gap-2">
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
      <div class="flex flex-wrap gap-2">
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
      <div class="flex flex-wrap gap-2">
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
      <div class="flex flex-wrap gap-2">
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
      <div class="flex flex-wrap gap-2">
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
      <div class="flex flex-wrap gap-2">
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
