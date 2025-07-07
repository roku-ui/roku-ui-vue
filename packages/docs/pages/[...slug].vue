<script setup lang="ts">
const route = useRoute()
const { data } = await useAsyncData(route.path, () => queryCollection('content').path(route.path).first())
const titleList = computed(() => {
  if (!data.value) {
    return ['Roku UI']
  }
  if (route.path.includes('components')) {
    return [data.value?.title, '组件', 'Roku UI']
  }
  return [data.value?.title, 'Roku UI']
})

useHead({
  title: titleList.value.join(' - ').trim(),
  meta: [
    {
      hid: 'description',
      name: 'description',
      content: data.value?.description,
    },
  ],
})
</script>

<template>
  <main>
    <ContentTitle :title="data?.title">
      <template #description>
        {{ data?.description }}
      </template>
    </ContentTitle>
    <FeatureList :features="data?.features" />
    <ContentRenderer
      v-if="data"
      :value="data"
    />
  </main>
</template>
