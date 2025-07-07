<script setup>
</script>

<template>
  <div class="p-6 space-y-8">
    <h1 class="text-3xl font-bold">
      Avatar Demo
    </h1>

    <div class="flex items-center gap-2">
      <Avatar
        name="x"
        src="https://www.example.com"
      />
      <Avatar name="Jannchie" />
      <Avatar name="Jannchie Pan" />
      <Avatar
        size="sm"
        name="Jannchie Pan"
      />
      <Avatar
        size="sm"
        name="见齐"
      />
      <Avatar
        variant="light"
        name="Light"
      />
      <Avatar
        variant="light"
        name="Light"
        color="primary"
      />
      <Avatar />
      <Avatar skeleton />
      <Avatar name="见齐" />
      <Avatar name="あ" />
      <Avatar
        size="lg"
        name="あ"
      />
      <Avatar
        size="xl"
        name="あ"
      />
    </div>

    <Paper class="flex items-center gap-2">
      <Avatar
        size="sm"
        src="https://avatars.githubusercontent.com/u/29743310?v=4"
      />
      <Avatar src="https://avatars.githubusercontent.com/u/29743310?v=4" />
      <Avatar
        size="lg"
        src="https://avatars.githubusercontent.com/u/29743310?v=4"
      />
      <Avatar
        size="4"
        src="https://avatars.githubusercontent.com/u/29743310?v=4"
      />
      <Avatar
        size="86px"
        src="https://avatars.githubusercontent.com/u/29743310?v=4"
      />
    </Paper>
  </div>
</template>
