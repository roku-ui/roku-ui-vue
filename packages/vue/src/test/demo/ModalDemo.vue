<script setup lang="ts">
import { ref } from 'vue'
import { Modals } from '@/utils/modals'

const modal1 = ref(false)
const modal2 = ref(false)
const modal3 = ref(false)
const modal4 = ref(false)
const modal5 = ref(false)
const drawerLeft = ref(false)
const drawerRight = ref(false)
</script>

<template>
  <div class="p-6 space-y-8">
    <h1 class="text-3xl font-bold">
      Modal & Drawer Demo
    </h1>

    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        Modal System
      </h2>

      <Paper class="flex flex-wrap gap-2">
        <Btn
          @click="Modals.open({
            id: 'test',
            title: 'Modal Title',
            type: 'confirm',
            message: 'Are you sure?',
            onConfirm() {
              console.log('Confirmed!')
            },
          })"
        >
          Open System Modal
        </Btn>
      </Paper>
    </section>

    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        Basic Modals
      </h2>

      <Paper class="flex flex-wrap gap-2">
        <Btn @click="modal1 = !modal1">
          Open Modal
        </Btn>
        <Modal
          v-model="modal1"
          title="This is a modal."
        >
          <template #body>
            Modal Content
          </template>
        </Modal>

        <Btn @click="modal2 = !modal2">
          Open Blur Modal
        </Btn>
        <Modal
          v-model="modal2"
        >
          <Paper
            with-border
            class="flex h-16 w-full w-md items-center justify-center"
          >
            <Paper>Blur Modal</Paper>
          </Paper>
        </Modal>

        <Btn @click="modal3 = !modal3">
          Open Persistent Modal
        </Btn>
        <Modal
          v-model="modal3"
          persistent
        >
          <Paper
            with-border
            class="flex h-16 w-full w-md items-center justify-center"
          >
            <Btn @click="modal3 = !modal3">
              Close
            </Btn>
          </Paper>
        </Modal>

        <Btn @click="modal4 = !modal4">
          Open Nested Modal
        </Btn>
        <Modal v-model="modal4">
          <Paper
            with-border
            class="flex h-16 w-full w-md items-center justify-center"
          >
            <Btn @click="modal5 = !modal5">
              Open Nested Modal
            </Btn>
            <Modal v-model="modal5">
              <Paper class="flex h-16 w-full items-center justify-center">
                Inner Modal
              </Paper>
            </Modal>
          </Paper>
        </Modal>
      </Paper>
    </section>

    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        Drawers
      </h2>

      <Paper class="flex flex-wrap gap-2">
        <Btn @click="drawerLeft = !drawerLeft">
          Open left drawer
        </Btn>
        <Drawer v-model="drawerLeft">
          <div>Test Drawer</div>
        </Drawer>

        <Btn @click="drawerRight = !drawerRight">
          Open right drawer
        </Btn>
        <Drawer
          v-model="drawerRight"
          position="right"
        >
          <div>Test Drawer</div>
        </Drawer>
      </Paper>
    </section>
  </div>
</template>
