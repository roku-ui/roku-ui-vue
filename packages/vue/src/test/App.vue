<!-- eslint-disable no-console -->
<script setup lang="ts">
import { Notifications, generateColors } from '..'

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
const drawerLeft = ref(false)
const drawerRight = ref(false)
const select = ref()
const slider = ref(47)
const color = ref('#5474B4')
const colors = computed(() => generateColors(color.value))
const file = ref<File | null>(null)
function onDrop(files: File[] | null) {
  if (files && files.length) {
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
const text = ref('1')
const tab = ref(0)
const loading = ref(true)
const tabs = ref(0)
const selectObj = ref()

const apiSearch = ref('')
const apiSelected = ref<undefined | { id: number, label: string }>()
const apiOptions = computed(() => {
  const options = [
    { id: 1, label: 'apple' },
    { id: 2, label: 'banana' },
    { id: 3, label: 'orange' },
  ].filter(option => option.label.includes(apiSearch.value))
  return options
})
const btnGroupVal = ref()
const btnGroupOptions = [
  { label: 'Left', value: 'left', icon: 'i-tabler-align-left' },
  { label: 'Center', value: 'center', icon: 'i-tabler-align-center' },
  { label: 'Right', value: 'right', icon: 'i-tabler-align-right' },
]
</script>

<template>
  <RokuProvider>
    <NotificationSystem />
    <div class="flex flex-col items-center gap-2">
      <Paper>
        <BtnGroup
          v-model="btnGroupVal"
          :selections="btnGroupOptions"
          color="secondary"
        />
      </Paper>
      <Paper class="flex items-center gap-2">
        <SchemeSwitch />
      </Paper>
      <Paper>
        {{ apiSearch }}
        {{ apiSelected }}
        <Select
          v-model="apiSelected"
          searchable
          aria-label="Select a fruit"
          placeholder="Select a fruit"
          :options="apiOptions"
          @input="apiSearch = $event"
        >
          <template #item="{ data }">
            <div class="flex items-center justify-center gap-2">
              <i class="i-tabler-circle" />
              <span>
                {{ data.label }}
              </span>
            </div>
          </template>
        </Select>
      </Paper>
      <Paper>
        {{ selectObj }}
        <Select
          v-model="selectObj"
          aria-label="Select a fruit"
          placeholder="Select a fruit"
          :options="[{ id: 1, label: 'apple' }, { id: 2, label: 'banana' }, { id: 3, label: 'orange' }]"
        />
      </Paper>
      <Paper>
        {{ select }}
        <Select
          v-model="select"
          searchable
          aria-label="Select a fruit"
          placeholder="Select a fruit"
          :options="['apple', 'banana', 'orange']"
        />
      </Paper>
      <Tooltip>
        <Btn>
          Hover me
        </Btn>
        <template #content>
          This is a tooltip
        </template>
      </Tooltip>
      <div class="flex flex-col gap-2">
        <div class="flex gap-2">
          <Paper
            trace-animate
            class="h-24 w-32 flex items-center justify-center"
          >
            Trace
          </Paper>
          <Paper
            trace-animate
            class="h-24 w-32 flex items-center justify-center"
          >
            Trace
          </Paper>
        </div>
        <div class="flex gap-2">
          <Paper
            trace-animate
            class="h-24 w-32 flex items-center justify-center"
          >
            Trace
          </Paper>
          <Paper
            trace-animate
            class="h-24 w-32 flex items-center justify-center"
          >
            Trace
          </Paper>
        </div>
      </div>
      <Paper
        :loading="loading"
      >
        <Btn
          @click="loading = !loading"
        >
          {{ loading ? 'Stop' : 'Start' }} Loading
        </Btn>
      </Paper>
      <Paper>
        <Tabs v-model="tabs">
          <TabItem :value="0">
            Tab 0
          </TabItem>
          <TabItem
            v-for="i in 3"
            :key="i"
            :value="i"
            @click="() => console.log(i)"
          >
            Tab {{ i }}
          </TabItem>
          <TabItem
            :value="4"
          >
            Tab 4
          </TabItem>
        </Tabs>
        {{ tabs }}
      </Paper>
      <Paper>
        <Tabs
          v-model="tab"
          direction="vertical"
        >
          <TabItem :value="0">
            Tab 0
          </TabItem>
          <TabItem :value="1">
            Tab 1
          </TabItem>
        </Tabs>
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
      <Paper>
        <AspectRatio
          class="w-60"
          :ratio="16 / 9"
        >
          <Image
            src="https://source.unsplash.com/random/512x512"
          />
        </AspectRatio>
      </Paper>
      <Overlay
        blur
        rounded="md"
      >
        <Image
          height="312px"
          width="312px"
          src="https://source.unsplash.com/random/512x512"
        />
        <template #content>
          <div class="h-full w-full flex items-center justify-center text-white">
            This is a overlay
          </div>
        </template>
      </Overlay>
      <ChatContainer class="max-w-lg w-full py-8">
        <ChatMessage
          position="right"
          avatar="https://avatars.githubusercontent.com/u/29743310?v=4"
        >
          Hello, world!
        </ChatMessage>
        <ChatMessage
          position="right"
          variant="transparent"
          avatar="https://avatars.githubusercontent.com/u/29743310?v=4"
        >
          Hello, world!
        </ChatMessage>
        <ChatMessage
          position="right"
          variant="filled"
          avatar="https://avatars.githubusercontent.com/u/29743310?v=4"
        >
          Hello, world!
        </ChatMessage>
        <ChatSystem>
          You have said hello 3 times
        </ChatSystem>
        <ChatMessage
          avatar="https://avatars.githubusercontent.com/u/1?v=4"
        >
          <div>
            Hello, Jannchie!
          </div>
          <!-- hello image -->
          <Image
            height="312px"
            width="312px"
            src="https://source.unsplash.com/random/512x512"
          />
        </ChatMessage>
      </ChatContainer>
      <Paper class="h-72 w-128">
        <Dropzone @drop="onDrop">
          <div v-if="file">
            {{ file.name }}
          </div>
          <div v-else>
            Files drop here
          </div>
        </Dropzone>
      </Paper>
      <Image
        style="height: 4rem; width: 4rem"
        src="https://avatars.githubusercontent.com/u/29743310?v=4"
      />
      <Paper class="flex items-center gap-2">
        <ColorInput v-model="color" />
      </Paper>
      <Paper class="flex flex-wrap gap-2">
        <ColorSwatch
          v-for="c in colors"
          :key="c"
          :color="c"
        />
      </Paper>
      <ThemeProvider
        scheme="light"
      >
        <Paper class="m-4">
          Other Theme
        </Paper>
      </ThemeProvider>
      <ThemeProvider
        scheme="dark"
      >
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
            style="height: 4rem; width: 4rem"
            src="https://avatars.githubusercontent.com/u/29743310?v=4"
          />
        </indicator>
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
        </indicator>
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
        <Indicator
          size="sm"
        >
          <Image
            style="height: 4rem; width: 4rem"
            src="https://avatars.githubusercontent.com/u/29743310?v=4"
          />
        </Indicator>
        <Indicator
          size="lg"
        >
          <Image
            style="height: 4rem; width: 4rem"
            src="https://avatars.githubusercontent.com/u/29743310?v=4"
          />
        </Indicator>
      </Paper>
      <Paper class="w-80 flex flex-wrap gap-2">
        <Slider v-model="slider" />
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
          aria-label="empty select"
        />
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
      <Paper>
        <Btn @click="drawerLeft = !drawerLeft">
          Open left drawer
        </Btn>
        <Drawer v-model="drawerLeft">
          <div>
            Test Drawer
          </div>
        </Drawer>
      </Paper>
      <Paper>
        <Btn @click="drawerRight = !drawerRight">
          Open right drawer
        </Btn>
        <Drawer
          v-model="drawerRight"
          position="right"
        >
          <div>
            Test Drawer
          </div>
        </Drawer>
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
        <TextField
          v-model="text"
          password
          placeholder="Password"
        />
      </Paper>
      <Paper class="flex flex-wrap gap-2">
        <TextField
          v-model="text"
          placeholder="Placeholder"
        />
      </Paper>
      <Paper class="flex flex-wrap gap-2">
        <TextField
          v-model="text"
          label="label"
        />
      </Paper>
      <Paper class="flex flex-wrap gap-2">
        <TextField
          v-model="text"
          rounded="none"
        />
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
