<script setup lang="ts">
import { ChatContainer, ChatMessage } from '@roku-ui/vue'

const code = computed(() => `<template>
  <ChatContainer class="p-4">
  <ChatMessage
      position="right"
      variant="filled"
      avatar="https://avatars.githubusercontent.com/u/29743310?v=4"
  >
      Hello, world!
  </ChatMessage>
  <ChatMessage avatar="https://avatars.githubusercontent.com/u/0?v=4">
      Hello, Jannchie!
  </ChatMessage>
  </ChatContainer>
</template>`)
</script>

<template>
  <Demo :code="code">
    <template #preview>
      <ChatContainer class="p-4">
        <ChatMessage
          position="right"
          variant="filled"
          avatar="https://avatars.githubusercontent.com/u/29743310?v=4"
        >
          Hello, world!
        </ChatMessage>
        <ChatMessage avatar="https://avatars.githubusercontent.com/u/0?v=4">
          Hello, Jannchie!
        </ChatMessage>
      </ChatContainer>
    </template>
  </Demo>
</template>
