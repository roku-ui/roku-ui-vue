<script setup lang="ts">
import { ref } from 'vue'

const basicInput = ref('')
const disabledInput = ref('Disabled text')
const errorInput = ref('Error text')
const passwordInput = ref('')
const partialPasswordInput = ref('')
const labeledInput = ref('')
const customInput = ref('')

// 格式化函数示例
const formatters = {
  // 数字逗号分隔符
  number: (value: string): string => {
    const cleanValue = value.replaceAll(/[^\d.]/g, '')
    const parts = cleanValue.split('.')
    const integerPart = parts[0].replaceAll(/\B(?=(\d{3})+(?!\d))/g, ',')
    return parts.length > 1 ? `${integerPart}.${parts[1]}` : integerPart
  },

  // 货币格式
  currency: (value: string): string => {
    const cleanValue = value.replaceAll(/[^\d.]/g, '')
    if (!cleanValue) {
      return ''
    }
    const parts = cleanValue.split('.')
    const integerPart = parts[0].replaceAll(/\B(?=(\d{3})+(?!\d))/g, ',')
    const formatted = parts.length > 1 ? `${integerPart}.${parts[1].slice(0, 2)}` : integerPart
    return `$${formatted}`
  },

  // 美国电话号码格式
  phoneUS: (value: string): string => {
    const cleanValue = value.replaceAll(/\D/g, '')
    if (cleanValue.length <= 3) {
      return cleanValue
    }
    if (cleanValue.length <= 6) {
      return `(${cleanValue.slice(0, 3)}) ${cleanValue.slice(3)}`
    }
    return `(${cleanValue.slice(0, 3)}) ${cleanValue.slice(3, 6)}-${cleanValue.slice(6, 10)}`
  },

  // 信用卡号格式
  creditCard: (value: string): string => {
    const cleanValue = value.replaceAll(/\D/g, '')
    return cleanValue.replaceAll(/(.{4})/g, '$1 ').trim()
  },

  // 大写转换
  uppercase: (value: string): string => {
    return value.toUpperCase()
  },

  // 日期格式 MM/DD/YYYY
  date: (value: string): string => {
    const cleanValue = value.replaceAll(/\D/g, '')
    if (cleanValue.length <= 2) {
      return cleanValue
    }
    if (cleanValue.length <= 4) {
      return `${cleanValue.slice(0, 2)}/${cleanValue.slice(2)}`
    }
    return `${cleanValue.slice(0, 2)}/${cleanValue.slice(2, 4)}/${cleanValue.slice(4, 8)}`
  },
}

// 格式化输入的变量
const numberInput = ref('')
const currencyInput = ref('')
const phoneInput = ref('')
const creditCardInput = ref('')
const uppercaseInput = ref('')
const dateInput = ref('')
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

    <!-- Partial Visible Password Field -->
    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        Partial Visible Password Field
      </h2>
      <Paper class="space-y-4">
        <TextField
          v-model="partialPasswordInput"
          password
          partial-visible
          :visible-start="2"
          :visible-end="2"
          label="Partial Visible Password (2-2)"
          placeholder="Enter your password"
        />
        <TextField
          v-model="partialPasswordInput"
          password
          partial-visible
          :visible-start="3"
          :visible-end="1"
          label="Partial Visible Password (3-1)"
          placeholder="Enter your password"
        />
        <TextField
          v-model="partialPasswordInput"
          password
          partial-visible
          :visible-start="1"
          :visible-end="3"
          label="Partial Visible Password (1-3)"
          placeholder="Enter your password"
        />
        <div class="text-sm text-gray-600">
          Value: {{ partialPasswordInput }}
        </div>
        <div class="text-xs text-gray-500">
          This feature shows the first n characters and last n characters of the password, while hiding the middle part with asterisks.
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
        <div class="mt-4 p-4 rounded">
          <h3 class="font-semibold mb-2">
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

    <!-- TextField with Format Functions -->
    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        TextField with Format Functions
      </h2>
      <Paper class="space-y-4">
        <TextField
          v-model="numberInput"
          label="Number with Commas"
          placeholder="Enter a number..."
          :format="formatters.number"
        />
        <div class="text-sm text-gray-600">
          Value: {{ numberInput }}
        </div>

        <TextField
          v-model="currencyInput"
          label="Currency"
          placeholder="Enter amount..."
          :format="formatters.currency"
        />
        <div class="text-sm text-gray-600">
          Value: {{ currencyInput }}
        </div>

        <TextField
          v-model="phoneInput"
          label="US Phone Number"
          placeholder="Enter phone number..."
          :format="formatters.phoneUS"
        />
        <div class="text-sm text-gray-600">
          Value: {{ phoneInput }}
        </div>

        <TextField
          v-model="creditCardInput"
          label="Credit Card Number"
          placeholder="Enter card number..."
          :format="formatters.creditCard"
        />
        <div class="text-sm text-gray-600">
          Value: {{ creditCardInput }}
        </div>

        <TextField
          v-model="uppercaseInput"
          label="Auto Uppercase"
          placeholder="Type anything..."
          :format="formatters.uppercase"
        />
        <div class="text-sm text-gray-600">
          Value: {{ uppercaseInput }}
        </div>

        <TextField
          v-model="dateInput"
          label="Date (MM/DD/YYYY)"
          placeholder="Enter date..."
          :format="formatters.date"
        />
        <div class="text-sm text-gray-600">
          Value: {{ dateInput }}
        </div>
      </Paper>
    </section>

    <!-- Custom Format Functions -->
    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        Custom Format Functions
      </h2>
      <Paper class="space-y-4">
        <div class="text-sm mb-4">
          <p class="font-semibold mb-2">
            Examples of how to use custom format functions:
          </p>
          <div class="text-xs font-mono p-3 rounded space-y-2">
            <div>// Number formatting</div>
            <div>:format="(value) => value.replace(/[^\d.]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')"</div>
            <div />
            <div>// Phone number formatting</div>
            <div>:format="(value) => formatAsPhone(value)"</div>
            <div />
            <div>// Currency formatting</div>
            <div>:format="(value) => '$' + value.replace(/[^\d.]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')"</div>
          </div>
        </div>

        <TextField
          v-model="customInput"
          label="Custom Format (Credit Card)"
          placeholder="Try typing numbers..."
          :format="(value) => value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim()"
        />
        <div class="text-sm text-gray-600">
          Value: {{ customInput }}
        </div>
      </Paper>
    </section>
  </div>
</template>
