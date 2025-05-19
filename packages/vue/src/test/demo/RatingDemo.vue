<script setup lang="ts">
import { ref } from 'vue'

const rating = ref(3)
</script>

<template>
  <div>
    <Rating
      v-model="rating"
      size="sm"
    />
    <Rating v-model="rating" />
    <Rating
      v-model="rating"
      size="lg"
    />
    <Rating
      v-model="rating"
      size="lg"
      highlight-selected-only
    />
    <Rating
      v-model="rating"
      :count="4"
      size="lg"
      :icons="[
        'i-fluent-checkmark-circle-12-filled',
        'i-fluent-question-circle-12-filled',
        'i-fluent-error-circle-12-filled',
        'i-fluent-dismiss-circle-12-filled',
      ]"
      :color="['green', 'yellow', 'orange', 'red']"
      highlight-selected-only
    />
  </div>
</template>
