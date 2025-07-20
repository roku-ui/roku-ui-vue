<script setup lang="ts">
import { ref } from 'vue'

const basicInput = ref('')
const disabledInput = ref('Disabled text')
const errorInput = ref('Error text')
const passwordInput = ref('')
const labeledInput = ref('')
const customInput = ref('')
</script>

<template>
  <div class="p-6 space-y-8">
    <h1 class="text-3xl font-bold">
      TextField Demo
    </h1>

    <!-- Basic TextField -->
    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        Basic TextField
      </h2>
      <Paper class="space-y-4">
        <TextField
          v-model="basicInput"
          placeholder="Enter some text..."
        />
        <div class="text-sm text-gray-600">
          Value: {{ basicInput }}
        </div>
      </Paper>
    </section>

    <!-- Different Sizes -->
    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        Different Sizes
      </h2>
      <Paper class="space-y-4">
        <TextField
          v-model="basicInput"
          size="sm"
          placeholder="Small size"
        />
        <TextField
          v-model="basicInput"
          size="md"
          placeholder="Medium size (default)"
        />
        <TextField
          v-model="basicInput"
          size="lg"
          placeholder="Large size"
        />
      </Paper>
    </section>

    <!-- Different Colors -->
    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        Different Colors
      </h2>
      <Paper class="space-y-4">
        <TextField
          v-model="basicInput"
          color="primary"
          placeholder="Primary color"
        />
        <TextField
          v-model="basicInput"
          color="secondary"
          placeholder="Secondary color"
        />
        <TextField
          v-model="basicInput"
          color="tertiary"
          placeholder="Tertiary color"
        />
        <TextField
          v-model="basicInput"
          color="error"
          placeholder="Error color"
        />
      </Paper>
    </section>

    <!-- Different Rounded -->
    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        Different Rounded
      </h2>
      <Paper class="space-y-4">
        <TextField
          v-model="basicInput"
          rounded="none"
          placeholder="No rounded"
        />
        <TextField
          v-model="basicInput"
          rounded="sm"
          placeholder="Small rounded"
        />
        <TextField
          v-model="basicInput"
          rounded="md"
          placeholder="Medium rounded (default)"
        />
        <TextField
          v-model="basicInput"
          rounded="lg"
          placeholder="Large rounded"
        />
        <TextField
          v-model="basicInput"
          rounded="full"
          placeholder="Full rounded"
        />
      </Paper>
    </section>

    <!-- With Labels -->
    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        With Labels
      </h2>
      <Paper class="space-y-4">
        <TextField
          v-model="labeledInput"
          label="Username"
          placeholder="Enter your username"
        />
        <TextField
          v-model="labeledInput"
          placeholder="Email address"
        >
          <template #label>
            <span class="text-blue-600">Email Address *</span>
          </template>
        </TextField>
        <div class="text-sm text-gray-600">
          Value: {{ labeledInput }}
        </div>
      </Paper>
    </section>

    <!-- Password Field -->
    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        Password Field
      </h2>
      <Paper class="space-y-4">
        <TextField
          v-model="passwordInput"
          password
          label="Password"
          placeholder="Enter your password"
        />
        <div class="text-sm text-gray-600">
          Value: {{ passwordInput }}
        </div>
      </Paper>
    </section>

    <!-- Disabled State -->
    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        Disabled State
      </h2>
      <Paper class="space-y-4">
        <TextField
          v-model="disabledInput"
          disabled
          label="Disabled Field"
          placeholder="This field is disabled"
        />
      </Paper>
    </section>

    <!-- Error State -->
    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        Error State
      </h2>
      <Paper class="space-y-4">
        <TextField
          v-model="errorInput"
          error
          color="error"
          label="Error Field"
          placeholder="This field has an error"
        />
      </Paper>
    </section>

    <!-- Custom Attributes -->
    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        Custom Attributes
      </h2>
      <Paper class="space-y-4">
        <TextField
          v-model="customInput"
          label="Email"
          placeholder="user@example.com"
          type="email"
          autocomplete="email"
          maxlength="50"
        />
        <TextField
          v-model="customInput"
          label="Phone Number"
          placeholder="+1 (555) 123-4567"
          type="tel"
          pattern="[+][0-9\s\-\(\)]+"
        />
        <div class="text-sm text-gray-600">
          Value: {{ customInput }}
        </div>
      </Paper>
    </section>

    <!-- TextField with Left Section -->
    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        TextField with Left Section
      </h2>
      <Paper class="space-y-4">
        <TextField
          v-model="basicInput"
          label="Search"
          placeholder="Search for something..."
        >
          <template #leftSection>
            <div class="i-heroicons-magnifying-glass h-4 w-4" />
          </template>
        </TextField>
        <TextField
          v-model="customInput"
          label="Email"
          placeholder="user@example.com"
          type="email"
        >
          <template #leftSection>
            <div class="i-heroicons-at-symbol h-4 w-4" />
          </template>
        </TextField>
        <TextField
          v-model="customInput"
          label="Phone Number"
          placeholder="+1 (555) 123-4567"
          type="tel"
        >
          <template #leftSection>
            <div class="i-heroicons-phone h-4 w-4" />
          </template>
        </TextField>
      </Paper>
    </section>

    <!-- TextField with Right Section -->
    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        TextField with Right Section
      </h2>
      <Paper class="space-y-4">
        <TextField
          v-model="passwordInput"
          password
          label="Password"
          placeholder="Enter your password"
        >
          <template #rightSection>
            <div class="i-heroicons-eye h-4 w-4 cursor-pointer" />
          </template>
        </TextField>
        <TextField
          v-model="basicInput"
          label="Amount"
          placeholder="0.00"
          type="number"
        >
          <template #rightSection>
            <span class="text-sm text-gray-500">USD</span>
          </template>
        </TextField>
        <TextField
          v-model="customInput"
          label="Website"
          placeholder="example.com"
          type="url"
        >
          <template #rightSection>
            <div class="i-heroicons-arrow-top-right-on-square h-4 w-4 cursor-pointer" />
          </template>
        </TextField>
      </Paper>
    </section>

    <!-- TextField with Both Sections -->
    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        TextField with Both Sections
      </h2>
      <Paper class="space-y-4">
        <TextField
          v-model="basicInput"
          label="Search with Filter"
          placeholder="Search products..."
        >
          <template #leftSection>
            <div class="i-heroicons-magnifying-glass h-4 w-4" />
          </template>
          <template #rightSection>
            <div class="i-heroicons-adjustments-horizontal h-4 w-4 cursor-pointer" />
          </template>
        </TextField>
        <TextField
          v-model="customInput"
          label="Price Range"
          placeholder="Enter amount"
          type="number"
        >
          <template #leftSection>
            <span class="text-sm text-gray-500">$</span>
          </template>
          <template #rightSection>
            <span class="text-sm text-gray-500">.00</span>
          </template>
        </TextField>
        <TextField
          v-model="labeledInput"
          label="Location"
          placeholder="Enter address or coordinates"
        >
          <template #leftSection>
            <div class="i-heroicons-map-pin h-4 w-4" />
          </template>
          <template #rightSection>
            <div class="i-heroicons-globe-alt h-4 w-4 cursor-pointer" />
          </template>
        </TextField>
      </Paper>
    </section>

    <!-- Different Sizes with Sections -->
    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        Different Sizes with Sections
      </h2>
      <Paper class="space-y-4">
        <TextField
          v-model="basicInput"
          size="sm"
          placeholder="Small with sections"
        >
          <template #leftSection>
            <div class="i-heroicons-user h-3 w-3" />
          </template>
          <template #rightSection>
            <div class="i-heroicons-check h-3 w-3" />
          </template>
        </TextField>
        <TextField
          v-model="basicInput"
          size="md"
          placeholder="Medium with sections"
        >
          <template #leftSection>
            <div class="i-heroicons-user h-4 w-4" />
          </template>
          <template #rightSection>
            <div class="i-heroicons-check h-4 w-4" />
          </template>
        </TextField>
        <TextField
          v-model="basicInput"
          size="lg"
          placeholder="Large with sections"
        >
          <template #leftSection>
            <div class="i-heroicons-user h-5 w-5" />
          </template>
          <template #rightSection>
            <div class="i-heroicons-check h-5 w-5" />
          </template>
        </TextField>
      </Paper>
    </section>

    <!-- Interactive Example -->
    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        Interactive Form Example
      </h2>
      <Paper class="space-y-4">
        <TextField
          v-model="basicInput"
          label="First Name"
          placeholder="John"
          size="md"
          color="primary"
          rounded="md"
        />
        <TextField
          v-model="labeledInput"
          label="Last Name"
          placeholder="Doe"
          size="md"
          color="primary"
          rounded="md"
        />
        <TextField
          v-model="passwordInput"
          password
          label="Password"
          placeholder="Enter a secure password"
          size="md"
          color="primary"
          rounded="md"
        />
        <div class="mt-4 rounded p-4">
          <h3 class="mb-2 font-semibold">
            Form Values:
          </h3>
          <div class="text-sm space-y-1">
            <div>First Name: {{ basicInput }}</div>
            <div>Last Name: {{ labeledInput }}</div>
            <div>Password: {{ passwordInput ? '•'.repeat(passwordInput.length) : '' }}</div>
          </div>
        </div>
      </Paper>
    </section>
  </div>
</template>
