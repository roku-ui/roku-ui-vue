<script setup>
import { ref } from 'vue'

const loading = ref(false)
</script>

<template>
  <div class="p-6 space-y-8">
    <h1 class="text-3xl font-bold">
      Button Demo
    </h1>

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
        variant="contrast"
        color="primary"
      >
        Button
      </Btn>
      <Btn
        variant="contrast"
        color="secondary"
      >
        Button
      </Btn>
      <Btn
        variant="contrast"
        color="secondary"
        skeleton
      >
        Button
      </Btn>
    </Paper>

    <Paper>
      <Btn @click="loading = !loading">
        {{ loading ? 'Stop' : 'Start' }} Loading
      </Btn>
    </Paper>
  </div>
</template>
