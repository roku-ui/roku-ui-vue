<script setup lang="ts">
const route = useRoute()
const { data } = await useAsyncData(route.path, queryContent(route.path).findOne)
</script>

<template>
  <main>
    <ContentTitle>
      {{ data?.title }}
      <template #description>
        {{ data?.description }}
      </template>
    </ContentTitle>
    <FeatureList :features="data?.features" />
    <ContentDoc />
  </main>
</template>
