<template>
  <!-- user-picker -->
  <user-picker
    v-if="props.type === 'user-picker'"
    v-model:id="id"
    v-model:text="text"
    :title="props.title"
    @change="emits('change')">
  </user-picker>
</template>

<script setup lang="ts">
import { type CustomPicker } from 'chant'
import UserPicker from './UserPicker.vue'

// props
const props = defineProps<{
  title: string
  type: CustomPicker
}>()
// emits
const emits = defineEmits(['change'])
// model
const id = defineModel<string>('id')
const text = defineModel<string>('text')
</script>

<style scoped lang="scss"></style>
