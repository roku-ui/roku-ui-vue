<script setup lang="ts">
import { ChatContainer, ChatMessage, ChatSystem, Image } from '../../components'
</script>

<template>
  <div class="p-6 space-y-8">
    <h1 class="text-3xl font-bold">
      Chat Demo
    </h1>

    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        Chat Messages
      </h2>

      <ChatContainer class="py-8 max-w-lg w-full">
        <ChatMessage
          position="right"
          avatar="https://avatars.githubusercontent.com/u/29743310?v=4"
        >
          Hello, world!
        </ChatMessage>
        <ChatMessage
          position="right"
          avatar="https://avatars.githubusercontent.com/u/29743310?v=4"
        >
          How are you today?
        </ChatMessage>
        <ChatMessage
          position="right"
          variant="filled"
          avatar="https://avatars.githubusercontent.com/u/29743310?v=4"
        >
          This is a filled message
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
          <Image
            height="312px"
            width="312px"
            src="https://picsum.photos/seed/2/512/512"
            class="rounded-lg"
          />
        </ChatMessage>
      </ChatContainer>
    </section>
  </div>
</template>
