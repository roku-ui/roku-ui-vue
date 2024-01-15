<script setup lang="ts">
import { AspectRatio } from '@roku-ui/vue'

const code = computed(() => `<template>
  <AspectRatio
    width="100%"
    :ratio="16 / 9"
  >
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.747975777082!2d139.742857977263!3d35.65858047259476!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188bbd9009ec09%3A0x481a93f0d2a409dd!2z5Lic5Lqs6ZOB5aGU!5e0!3m2!1szh-CN!2sjp!4v1705225332461!5m2!1szh-CN!2sjp"
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
    />
  </AspectRatio>
</template>`)
</script>

<template>
  <Demo :code="code">
    <template #preview>
      <AspectRatio
        width="100%"
        :ratio="16 / 9"
      >
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.747975777082!2d139.742857977263!3d35.65858047259476!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188bbd9009ec09%3A0x481a93f0d2a409dd!2z5Lic5Lqs6ZOB5aGU!5e0!3m2!1szh-CN!2sjp!4v1705225332461!5m2!1szh-CN!2sjp"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        />
      </AspectRatio>
    </template>
  </Demo>
</template>
