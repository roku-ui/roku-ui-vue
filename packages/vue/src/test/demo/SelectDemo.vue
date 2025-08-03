<script setup lang="ts">
import { ref } from 'vue'
import Select from '@/components/Select.vue'
// 基础用法 - 标准对象格式
const selections = [
  {
    label: 'Option 1',
    id: 'option1',
  },
  {
    label: 'Option 2',
    id: 'option2',
  },
  {
    label: 'Option 3',
    id: 'option3',
  },
]
const selected = ref(selections[0])

// 字符串数组
const stringOptions = ['苹果', '香蕉', '橘子', '葡萄']
const stringSelected = ref(stringOptions[0])

// 自定义属性名 - 用户数据
const users = [
  { name: '张三', userId: 1, email: 'zhangsan@example.com' },
  { name: '李四', userId: 2, email: 'lisi@example.com' },
  { name: '王五', userId: 3, email: 'wangwu@example.com' },
]
const userSelected = ref(users[0])

// 自定义 getter 函数 - 产品数据
const products = [
  { title: 'iPhone 15', price: 999, sku: 'IPHONE15' },
  { title: 'MacBook Pro', price: 2399, sku: 'MBP16' },
  { title: 'iPad Air', price: 599, sku: 'IPADAIR' },
]
const productSelected = ref(products[0])

// 大量选项演示
const manyOptions = Array.from({ length: 100 }, (_, i) => ({ id: i, label: `城市 ${i + 1}` }))
const manySelected = ref(manyOptions[0])
</script>

<template>
  <div class="space-y-8">
    <div>
      <h3>基础用法 - 标准对象格式</h3>
      <Select
        v-model="selected"
        :options="selections"
        class="w-64"
      />
      <div class="text-sm text-surface-dimmed mt-2">
        当前选择：{{ selected?.label }}
      </div>
    </div>

    <div>
      <h3>字符串数组</h3>
      <Select
        v-model="stringSelected"
        :options="stringOptions"
        placeholder="选择一个水果"
        class="w-64"
      />
      <div class="text-sm text-surface-dimmed mt-2">
        当前选择：{{ stringSelected }}
      </div>
    </div>

    <div>
      <h3>自定义属性名 - 用户数据</h3>
      <Select
        v-model="userSelected"
        :options="users"
        label-key="name"
        placeholder="选择用户"
        class="w-64"
      />
      <div class="text-sm text-surface-dimmed mt-2">
        当前选择：{{ userSelected?.name }} (ID: {{ userSelected?.userId }})
      </div>
    </div>

    <div>
      <h3>自定义 Label 函数 - 产品数据</h3>
      <Select
        v-model="productSelected"
        :options="products"
        :label-getter="(p) => `${p.title} - $${p.price}`"
        placeholder="选择产品"
        class="w-80"
      />
      <div class="text-sm text-surface-dimmed mt-2">
        当前选择：{{ productSelected?.title }} (SKU: {{ productSelected?.sku }})
      </div>
    </div>

    <div>
      <h3>自定义显示模板 - 复杂布局</h3>
      <Select
        v-model="productSelected"
        :options="products"
        placeholder="选择产品"
        class="w-80"
      >
        <template #item="{ data: product }">
          <div class="flex w-full items-center justify-between">
            <div>
              <div class="font-medium">
                {{ product.title }}
              </div>
              <div class="text-xs text-gray-500">
                SKU: {{ product.sku }}
              </div>
            </div>
            <span class="text-sm text-green-600 font-semibold">${{ product.price }}</span>
          </div>
        </template>
      </Select>
      <div class="text-sm text-surface-dimmed mt-2">
        当前选择：{{ productSelected?.title }} (SKU: {{ productSelected?.sku }})
      </div>
    </div>

    <div>
      <h3>搜索功能 - 大量选项</h3>
      <Select
        v-model="manySelected"
        :options="manyOptions"
        placeholder="请选择一个城市"
        searchable
        class="w-80"
      />
      <div class="text-sm text-surface-dimmed mt-2">
        当前选择：{{ manySelected?.label }}
      </div>
    </div>
  </div>
</template>
