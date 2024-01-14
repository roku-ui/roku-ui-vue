<script setup lang="ts">
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
::selection {
  background-color: rgb(var(--r-color-primary-containerd));
  color: #FFF;
}
* {
  outline-width: 2px;
  outline-offset: 1px;
}
*:focus-visible {
  --un-outline-color-opacity: 1;
  outline-color: rgb(
    var(--r-color-primary-container) / var(--un-outline-color-opacity)
  );
  outline-style: solid;
}
</style>
