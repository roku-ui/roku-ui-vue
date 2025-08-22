<script setup lang="ts">
import type { StepItem } from '@/components/Step.vue'
import { ref } from 'vue'
import { Btn, Paper, Step } from '@/components'

// Demo data
const basicSteps: StepItem[] = [
  { title: 'Account Setup', description: 'Create your account and verify email' },
  { title: 'Profile Information', description: 'Add your personal information' },
  { title: 'Preferences', description: 'Configure your preferences' },
  { title: 'Complete', description: 'Your setup is complete' },
]

const iconSteps: StepItem[] = [
  { title: 'Account Setup', description: 'Create your account and verify email', icon: 'i-heroicons-user-plus-solid' },
  { title: 'Profile Details', description: 'Complete your profile information', icon: 'i-heroicons-identification-solid' },
  { title: 'Security Setup', description: 'Configure two-factor authentication', icon: 'i-heroicons-shield-check-solid' },
  { title: 'Welcome!', description: 'You are ready to get started', icon: 'i-heroicons-check-circle-solid' },
]

const processSteps: StepItem[] = [
  { title: 'Draft', description: 'Document is being drafted', status: 'finish' },
  { title: 'Review', description: 'Under review by team', status: 'process' },
  { title: 'Approval', description: 'Awaiting final approval', status: 'wait' },
  { title: 'Published', description: 'Document is live', status: 'wait' },
]

const errorSteps: StepItem[] = [
  { title: 'Data Collection', description: 'Gathering required information', status: 'finish' },
  { title: 'Processing', description: 'Processing your request', status: 'error' },
  { title: 'Completion', description: 'Request completed', status: 'wait', disabled: true },
]

// Reactive state
const currentBasicStep = ref(1)
const currentIconStep = ref(0)
const currentVerticalStep = ref(2)
const currentNavigationStep = ref(1)
const currentDotStep = ref(0)
const currentSimpleStep = ref(2)

const colors = ['primary', 'secondary', 'tertiary', 'error'] as const
const sizes = ['sm', 'md', 'lg'] as const

// Methods
function nextStep(current: any) {
  if (current.value < basicSteps.length - 1) {
    current.value++
  }
}

function prevStep(current: any) {
  if (current.value > 0) {
    current.value--
  }
}

function resetStep(current: any) {
  current.value = 0
}

function completeStep(current: any) {
  current.value = basicSteps.length - 1
}
</script>

<template>
  <div class="p-6 space-y-8">
    <div class="space-y-4">
      <h2 class="text-xl font-bold">
        Step Component Demo
      </h2>

      <!-- Featured Step Demo -->
      <Paper class="p-8 space-y-6">
        <h3 class="text-xl text-surface-1 font-bold dark:text-surface-1">
          Featured Step Demo
        </h3>
        <div class="space-y-8">
          <Step
            v-model="currentBasicStep"
            :items="basicSteps"
            direction="horizontal"
            color="primary"
            size="lg"
            :clickable="true"
          />

          <div class="flex gap-3 justify-center">
            <Btn
              size="md"
              variant="outline"
              :disabled="currentBasicStep === 0"
              @click="prevStep({ value: currentBasicStep })"
            >
              ← Previous
            </Btn>
            <Btn
              size="md"
              :disabled="currentBasicStep === basicSteps.length - 1"
              @click="nextStep({ value: currentBasicStep })"
            >
              Next →
            </Btn>
          </div>
        </div>
      </Paper>

      <!-- Basic Horizontal Steps -->
      <Paper class="p-6 space-y-4">
        <h3 class="text-lg font-semibold">
          Basic Horizontal Steps
        </h3>
        <div class="space-y-6">
          <Step
            v-model="currentBasicStep"
            :items="basicSteps"
            direction="horizontal"
            color="primary"
          />

          <div class="flex gap-2">
            <Btn
              size="sm"
              variant="outline"
              :disabled="currentBasicStep === 0"
              @click="prevStep({ value: currentBasicStep })"
            >
              Previous
            </Btn>
            <Btn
              size="sm"
              :disabled="currentBasicStep === basicSteps.length - 1"
              @click="nextStep({ value: currentBasicStep })"
            >
              Next
            </Btn>
            <Btn
              size="sm"
              variant="subtle"
              @click="resetStep({ value: currentBasicStep })"
            >
              Reset
            </Btn>
            <Btn
              size="sm"
              variant="subtle"
              color="success"
              @click="completeStep({ value: currentBasicStep })"
            >
              Complete
            </Btn>
          </div>

          <div class="text-sm text-gray-600">
            Current Step: {{ currentBasicStep + 1 }} / {{ basicSteps.length }}
          </div>
        </div>
      </Paper>

      <!-- Vertical Steps -->
      <Paper class="p-6 space-y-4">
        <h3 class="text-lg font-semibold">
          Vertical Steps
        </h3>
        <div class="space-y-6">
          <Step
            v-model="currentVerticalStep"
            :items="basicSteps"
            direction="vertical"
            color="secondary"
            size="md"
          />

          <div class="flex gap-2">
            <Btn
              size="sm"
              variant="outline"
              :disabled="currentVerticalStep === 0"
              @click="prevStep({ value: currentVerticalStep })"
            >
              Previous
            </Btn>
            <Btn
              size="sm"
              :disabled="currentVerticalStep === basicSteps.length - 1"
              @click="nextStep({ value: currentVerticalStep })"
            >
              Next
            </Btn>
          </div>
        </div>
      </Paper>

      <!-- Steps with Icons -->
      <Paper class="p-6 space-y-4">
        <h3 class="text-lg font-semibold">
          Steps with Icons
        </h3>
        <div class="space-y-6">
          <Step
            v-model="currentIconStep"
            :items="iconSteps"
            direction="horizontal"
            color="tertiary"
            :clickable="true"
          />

          <div class="text-sm text-gray-600">
            Click on any step to navigate directly to it
          </div>
        </div>
      </Paper>

      <!-- Navigation Type -->
      <Paper class="p-6 space-y-4">
        <h3 class="text-lg font-semibold">
          Navigation Type
        </h3>
        <div class="space-y-6">
          <Step
            v-model="currentNavigationStep"
            :items="basicSteps"
            direction="horizontal"
            color="primary"
            type="navigation"
            :linear="false"
          />

          <div class="text-sm text-gray-600">
            Navigation type with non-linear access
          </div>
        </div>
      </Paper>

      <!-- Dot Type -->
      <Paper class="p-6 space-y-4">
        <h3 class="text-lg font-semibold">
          Dot Type Steps
        </h3>
        <div class="space-y-6">
          <Step
            v-model="currentDotStep"
            :items="basicSteps"
            direction="horizontal"
            color="primary"
            type="dot"
          />

          <div class="flex gap-2">
            <Btn
              size="sm"
              variant="outline"
              :disabled="currentDotStep === 0"
              @click="prevStep({ value: currentDotStep })"
            >
              Previous
            </Btn>
            <Btn
              size="sm"
              :disabled="currentDotStep === basicSteps.length - 1"
              @click="nextStep({ value: currentDotStep })"
            >
              Next
            </Btn>
          </div>
        </div>
      </Paper>

      <!-- Simple Progress Type -->
      <Paper class="p-6 space-y-4">
        <h3 class="text-lg font-semibold">
          Simple Progress Type
        </h3>
        <div class="space-y-6">
          <Step
            v-model="currentSimpleStep"
            :items="basicSteps"
            direction="horizontal"
            color="success"
            type="simple"
          />

          <div class="flex gap-2">
            <Btn
              size="sm"
              variant="outline"
              :disabled="currentSimpleStep === 0"
              @click="prevStep({ value: currentSimpleStep })"
            >
              Previous
            </Btn>
            <Btn
              size="sm"
              :disabled="currentSimpleStep === basicSteps.length - 1"
              @click="nextStep({ value: currentSimpleStep })"
            >
              Next
            </Btn>
          </div>
        </div>
      </Paper>

      <!-- Steps with Different Statuses -->
      <Paper class="p-6 space-y-4">
        <h3 class="text-lg font-semibold">
          Steps with Different Statuses
        </h3>
        <div class="space-y-6">
          <div class="space-y-4">
            <div>
              <h4 class="text-md font-medium mb-2">
                Process Flow
              </h4>
              <Step
                v-model="currentBasicStep"
                :items="processSteps"
                direction="horizontal"
                color="primary"
                :clickable="false"
              />
            </div>

            <div>
              <h4 class="text-md font-medium mb-2">
                With Error Status
              </h4>
              <Step
                v-model="currentBasicStep"
                :items="errorSteps"
                direction="horizontal"
                color="primary"
                :clickable="false"
              />
            </div>
          </div>
        </div>
      </Paper>

      <!-- Different Sizes -->
      <Paper class="p-6 space-y-4">
        <h3 class="text-lg font-semibold">
          Different Sizes
        </h3>
        <div class="space-y-6">
          <div
            v-for="size in sizes"
            :key="size"
            class="space-y-2"
          >
            <h4 class="text-sm font-medium capitalize">
              {{ size }} Size
            </h4>
            <Step
              v-model="currentBasicStep"
              :items="basicSteps.slice(0, 3)"
              direction="horizontal"
              color="primary"
              :size="size"
            />
          </div>
        </div>
      </Paper>

      <!-- Different Colors -->
      <Paper class="p-6 space-y-4">
        <h3 class="text-lg font-semibold">
          Different Colors
        </h3>
        <div class="space-y-6">
          <div
            v-for="color in colors"
            :key="color"
            class="space-y-2"
          >
            <h4 class="text-sm font-medium capitalize">
              {{ color }} Color
            </h4>
            <Step
              v-model="currentBasicStep"
              :items="basicSteps.slice(0, 3)"
              direction="horizontal"
              :color="color"
              size="sm"
            />
          </div>
        </div>
      </Paper>

      <!-- Progress Dot Style -->
      <Paper class="p-6 space-y-4">
        <h3 class="text-lg font-semibold">
          Progress Dot Style
        </h3>
        <div class="space-y-6">
          <Step
            v-model="currentBasicStep"
            :items="basicSteps"
            direction="horizontal"
            color="primary"
            :progress-dot="true"
          />

          <div class="text-sm text-gray-600">
            Minimalist dot-style progress indicator
          </div>
        </div>
      </Paper>

      <!-- Alternative Label Placement -->
      <Paper class="p-6 space-y-4">
        <h3 class="text-lg font-semibold">
          Alternative Label Placement
        </h3>
        <div class="space-y-6">
          <Step
            v-model="currentBasicStep"
            :items="basicSteps"
            direction="horizontal"
            color="primary"
            :alternative-label="true"
          />

          <div class="text-sm text-gray-600">
            Labels placed below icons for horizontal layout
          </div>
        </div>
      </Paper>

      <!-- Without Descriptions -->
      <Paper class="p-6 space-y-4">
        <h3 class="text-lg font-semibold">
          Without Descriptions
        </h3>
        <div class="space-y-6">
          <Step
            v-model="currentBasicStep"
            :items="basicSteps"
            direction="horizontal"
            color="primary"
            :show-description="false"
          />

          <div class="text-sm text-gray-600">
            Clean layout with titles only
          </div>
        </div>
      </Paper>
    </div>
  </div>
</template>
