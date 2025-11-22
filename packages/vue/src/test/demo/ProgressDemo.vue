<script setup lang="ts">
import { ref } from 'vue'
import { Btn, Paper, Progress } from '@/components'

const singleValue = ref(45)
const loading = ref(false)

const stackedSections = ref([
  { value: 30, color: 'primary' },
  { value: 20, color: 'success' },
  { value: 15, color: 'warning' },
])

function toggleLoading() {
  loading.value = !loading.value
}

function updateSingleValue() {
  singleValue.value = Math.floor(Math.random() * 100)
}

function updateStackedSections() {
  stackedSections.value = [
    { value: Math.floor(Math.random() * 40), color: 'primary' },
    { value: Math.floor(Math.random() * 30), color: 'success' },
    { value: Math.floor(Math.random() * 20), color: 'warning' },
    { value: Math.floor(Math.random() * 10), color: 'error' },
  ]
}
</script>

<template>
  <div class="p-6 space-y-8">
    <div class="space-y-4">
      <h2 class="text-xl font-bold">
        Progress Component Demo
      </h2>

      <!-- Basic Progress -->
      <Paper class="p-6 space-y-4">
        <h3 class="text-lg font-semibold">
          Basic Progress
        </h3>
        <div class="space-y-4">
          <div class="space-y-2">
            <p class="text-sm">
              Default ({{ singleValue }}%)
            </p>
            <Progress :value="singleValue" />
          </div>

          <div class="space-y-2">
            <p class="text-sm">
              Primary Color ({{ singleValue }}%)
            </p>
            <Progress
              :value="singleValue"
              color="primary"
            />
          </div>

          <div class="space-y-2">
            <p class="text-sm">
              Success Color ({{ singleValue }}%)
            </p>
            <Progress
              :value="singleValue"
              color="success"
            />
          </div>

          <div class="space-y-2">
            <p class="text-sm">
              Loading State
            </p>
            <Progress
              :loading="loading"
              color="primary"
            />
          </div>
        </div>

        <div class="flex gap-2">
          <Btn
            size="sm"
            @click="updateSingleValue"
          >
            Update Value
          </Btn>
          <Btn
            size="sm"
            variant="outline"
            @click="toggleLoading"
          >
            {{ loading ? 'Stop Loading' : 'Start Loading' }}
          </Btn>
        </div>
      </Paper>

      <!-- Sizes -->
      <Paper class="p-6 space-y-4">
        <h3 class="text-lg font-semibold">
          Sizes
        </h3>
        <div class="space-y-4">
          <div class="space-y-2">
            <p class="text-sm">
              Small
            </p>
            <Progress
              :value="60"
              size="sm"
              color="primary"
            />
          </div>

          <div class="space-y-2">
            <p class="text-sm">
              Medium (Default)
            </p>
            <Progress
              :value="60"
              size="md"
              color="primary"
            />
          </div>

          <div class="space-y-2">
            <p class="text-sm">
              Large
            </p>
            <Progress
              :value="60"
              size="lg"
              color="primary"
            />
          </div>
        </div>
      </Paper>

      <!-- Stacked Progress -->
      <Paper class="p-6 space-y-4">
        <h3 class="text-lg font-semibold">
          Stacked Progress (New Feature)
        </h3>
        <div class="space-y-4">
          <div class="space-y-2">
            <p class="text-sm">
              Multiple colored sections
            </p>
            <Progress :sections="stackedSections" />
            <div class="text-xs space-y-1">
              <p class="">
                Data: {{ JSON.stringify(stackedSections) }}
              </p>
              <div class="flex gap-2 items-center">
                <div class="bg-primary rounded-sm h-3 w-3" />
                <span>Primary: {{ stackedSections[0]?.value }}%</span>
              </div>
              <div class="flex gap-2 items-center">
                <div class="bg-success rounded-sm h-3 w-3" />
                <span>Success: {{ stackedSections[1]?.value }}%</span>
              </div>
              <div class="flex gap-2 items-center">
                <div class="bg-warning rounded-sm h-3 w-3" />
                <span>Warning: {{ stackedSections[2]?.value }}%</span>
              </div>
            </div>
          </div>

          <div class="space-y-2">
            <p class="text-sm">
              Large stacked progress
            </p>
            <Progress
              :sections="stackedSections"
              size="lg"
            />
          </div>
        </div>

        <Btn
          size="sm"
          @click="updateStackedSections"
        >
          Update Sections
        </Btn>
      </Paper>

      <!-- Rounded Variants -->
      <Paper class="p-6 space-y-4">
        <h3 class="text-lg font-semibold">
          Rounded Variants
        </h3>
        <div class="space-y-4">
          <div class="space-y-2">
            <p class="text-sm">
              None
            </p>
            <Progress
              :value="70"
              rounded="none"
              color="primary"
            />
          </div>

          <div class="space-y-2">
            <p class="text-sm">
              Small
            </p>
            <Progress
              :value="70"
              rounded="sm"
              color="primary"
            />
          </div>

          <div class="space-y-2">
            <p class="text-sm">
              Full (Default)
            </p>
            <Progress
              :value="70"
              rounded="full"
              color="primary"
            />
          </div>
        </div>
      </Paper>
    </div>
  </div>
</template>
