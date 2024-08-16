<script setup lang="ts">
import { ref } from 'vue'

const rating = ref(3)
</script>

<template>
  <div>
    <Rating v-model="rating" size="sm" />
    <Rating v-model="rating" />
    <Rating v-model="rating" size="lg" />
    <Rating v-model="rating" size="lg" highlight-selected-only />
    <Rating
      v-model="rating"
      :count="4" size="lg" :icons="[
        'i-tabler-leaf',
        'i-tabler-heart',
        'i-tabler-file',
        'i-tabler-rating-18-plus',
      ]"
      :color="['green', 'yellow', 'orange', 'red']"
      highlight-selected-only
    />
  </div>
</template>
