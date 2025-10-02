<template>
  <div class="p-8 container flex flex-col gap-8 items-center">
    <div class="flex gap-8">
      <div class="text-primary">
        Primary
      </div>
      <div class="text-secondary">
        Secondary
      </div>
      <div class="text-tertiary">
        Tertiary
      </div>
      <div class="text-success">
        Success
      </div>
      <div class="text-info">
        Info
      </div>
      <div class="text-warning">
        Warning
      </div>
      <div class="text-error">
        Error
      </div>
    </div>
    <div class="children:bg-surface-muted flex gap-8 children:px-3 children:py-1 children:border children:rounded-xl">
      <div class="text-dimmed">
        Dimmed
      </div>
      <div class="text-muted">
        Muted
      </div>
      <div class="text-default">
        Default
      </div>
      <div class="text-highlight">
        Highlight
      </div>
      <div class="bg-inverted">
        <div class="text-inverted">
          Inverted
        </div>
      </div>
    </div>
  </div>
</template>
