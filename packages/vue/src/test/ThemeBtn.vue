<script setup lang="ts">
const scheme = useScheme()
</script>

<template>
  <Btn @click="scheme = 'dark'">
    dark
  </Btn>
  <Btn @click="scheme = 'light'">
    light
  </Btn>
</template>
