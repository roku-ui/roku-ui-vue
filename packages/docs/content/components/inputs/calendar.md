---
title: Calendar / 日历
description: A comprehensive calendar component for date selection with support for single, multiple, and range selection modes.
features:
  - Single, multiple, and range date selection
  - Customizable size and color themes
  - Date restrictions and disabled dates
  - Internationalization support
  - Responsive design with UnoCSS
---

## Basic Usage

The Calendar component supports three different selection modes: single date, multiple dates, and date range selection.

::demo-calendar-base
::

## Sizes

Calendar component comes in three different sizes to fit various use cases.

::demo-calendar-sizes
::

## Date Restrictions

You can restrict date selection by setting minimum/maximum dates or by providing custom disabled date logic.

::demo-calendar-disabled
::

## API Reference

### Props

| Property         | Type                                           | Default     | Description                    |
| ---------------- | ---------------------------------------------- | ----------- | ------------------------------ |
| `modelValue`     | `Date \| Date[] \| { start: Date, end: Date }` | `undefined` | The selected date(s)           |
| `mode`           | `'single' \| 'multiple' \| 'range'`            | `'single'`  | Selection mode                 |
| `minDate`        | `Date`                                         | `undefined` | Minimum selectable date        |
| `maxDate`        | `Date`                                         | `undefined` | Maximum selectable date        |
| `disabledDates`  | `Date[] \| ((date: Date) => boolean)`          | `undefined` | Disabled dates                 |
| `firstDayOfWeek` | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6`              | `0`         | First day of week (0 = Sunday) |
| `locale`         | `string`                                       | `'en-US'`   | Locale for date formatting     |
| `size`           | `'sm' \| 'md' \| 'lg'`                         | `'md'`      | Calendar size                  |
| `color`          | `Color`                                        | `'primary'` | Theme color                    |
| `variant`        | `'default' \| 'filled' \| 'light'`             | `'default'` | Visual variant                 |
| `rounded`        | `Rounded`                                      | `'md'`      | Border radius                  |

### Events

| Event               | Payload                                                     | Description                    |
| ------------------- | ----------------------------------------------------------- | ------------------------------ |
| `update:modelValue` | `Date \| Date[] \| { start: Date, end: Date } \| undefined` | Emitted when selection changes |

### Slots

The Calendar component does not provide custom slots, but the date cells and navigation can be styled through the theme system.

## Usage Examples

### Single Date Selection

```vue
<script setup>
import { ref } from 'vue'

const selectedDate = ref(new Date())
</script>

<template>
  <Calendar
    v-model="selectedDate"
    mode="single"
  />
</template>
```

### Multiple Date Selection

```vue
<script setup>
import { ref } from 'vue'

const selectedDates = ref([])
</script>

<template>
  <Calendar
    v-model="selectedDates"
    mode="multiple"
    color="secondary"
  />
</template>
```

### Date Range Selection

```vue
<script setup>
import { ref } from 'vue'

const dateRange = ref()
</script>

<template>
  <Calendar
    v-model="dateRange"
    mode="range"
    color="tertiary"
  />
</template>
```

### With Date Restrictions

```vue
<script setup>
import { ref } from 'vue'

const selectedDate = ref(new Date())

const minDate = new Date()
const maxDate = new Date()
maxDate.setDate(maxDate.getDate() + 30)

// Disable weekends
function isWeekend(date) {
  const day = date.getDay()
  return day === 0 || day === 6
}
</script>

<template>
  <Calendar
    v-model="selectedDate"
    :min-date="minDate"
    :max-date="maxDate"
    :disabled-dates="isWeekend"
    mode="single"
  />
</template>
```
