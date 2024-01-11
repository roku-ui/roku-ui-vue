<script setup lang="ts">
import { Notifications, generateColors, lightTheme } from '..'

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
const slider = ref(47)
const colors = generateColors('#5474B4')
const file = ref<File | null>(null)
function onDrop(files: File[] | null) {
  if (files) {
    file.value = files[0]
    Notifications.show({
      title: 'Files dropped',
      message: files.map(file => file.name).join(', '),
    })
  }
  else {
    Notifications.show({
      title: 'Files dropped',
      message: 'No files dropped',
    })
  }
}
</script>

<template>
  <RokuProvider>
    <NotificationSystem />
    <div class="flex flex-col items-center gap-2">
      <Paper class="flex items-center gap-2">
        <ThemeSwitch />
      </Paper>
      <Paper class="flex items-center gap-2">
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
      </Paper>
      <Paper class="w-128 h-72">
        <Dragzone @drop="onDrop">
          <div v-if="file">
            {{ file.name }}
          </div>
          <div v-else>
            Files drop here
          </div>
        </Dragzone>
      </Paper>
      <Image
        class="h-16 w-16"
        src="https://avatars.githubusercontent.com/u/29743310?v=4"
      />
      <Paper class="flex flex-wrap gap-2">
        <ColorSwatch
          v-for="color in colors"
          :key="color"
          :color="color"
        />
      </Paper>
      <ThemeProvider :theme="lightTheme">
        <Paper class="m-4">
          Other Theme
        </Paper>
      </ThemeProvider>

      <Paper class="flex flex-wrap gap-2">
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
      </Paper>
      <Paper class="flex flex-wrap gap-2">
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
      </Paper>
      <Paper class="flex flex-wrap gap-2">
        <Slider v-model="slider" />
      </Paper>
      <Paper class="flex flex-wrap gap-2">
        <Slider
          v-model="slider"
          color="tertiary"
        />
      </Paper>
      <Paper class="flex flex-wrap gap-2">
        <Slider
          :min="2"
          :max="5"
        />
      </Paper>
      <Paper class="flex flex-wrap gap-2">
        <Slider :tick-num="5" />
      </Paper>
      <Paper class="flex flex-wrap gap-2">
        <Slider :options="['A', 'B', 'C']" />
      </Paper>

      <Paper class="flex flex-wrap gap-2">
        <Select
          v-model="select"
          placeholder="Select a fruit"
          :options="['apple', 'banana', 'orange']"
        />
        <Select />
      </Paper>
      <Paper class="flex flex-wrap gap-2">
        <Btn @click="modal1 = !modal1">
          Open Model
        </Btn>
        <Modal v-model="modal1">
          <Paper class="h-16 w-full flex items-center justify-center md:w-md">
            <Paper>
              Basic Modal
            </Paper>
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
            <Paper>
              Blur Modal
            </Paper>
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
      </Paper>

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
      <PinInput />
      <PinInput password />
      <Paper class="flex flex-wrap gap-2">
        <Chip v-model="chip">
          Checkable Chip
        </Chip>
      </Paper>
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
      <Paper class="flex flex-wrap gap-2">
        <TextField placeholder="Placeholder" />
      </Paper>
      <Paper class="flex flex-wrap gap-2">
        <TextField rounded="none" />
        <TextField rounded="lg" />
        <TextField rounded="full" />
        <TextField rounded="0.5rem" />
      </Paper>
      <Paper class="flex flex-wrap gap-2">
        <TextField disabled />
        <TextField

          disabled
          error
        />
      </Paper>
      <Paper class="flex flex-wrap gap-2">
        <TextField error />
        <TextField color="tertiary" />
        <TextField color="secondary" />
        <TextField color="error" />
        <TextField />
      </Paper>
      <Btn @click="Notifications.show({ title: `Triggered at: ${new Date().toLocaleTimeString()}` })">
        Push Notification
      </Btn>
      <Paper class="flex flex-wrap gap-2">
        <Switch disabled />
      </Paper>
      <Paper class="flex flex-wrap gap-2">
        <Switch />
        <Switch color="error" />
        <Switch
          size="sm"
        />
        <Switch
          size="lg"
        />
      </Paper>
      <Paper class="flex flex-wrap gap-2">
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
      </Paper>
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
      </Paper>
    </div>
  </RokuProvider>
</template>
