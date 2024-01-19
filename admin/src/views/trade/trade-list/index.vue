<template>
  <div class="column-box">
    <div class="column-item">
      <chant-table-search :show-fold="false">
        <el-form-item label="用户:">
          <user-picker v-model:id="state.id" v-model:text="state.text">
          </user-picker>
        </el-form-item>
      </chant-table-search>
    </div>
    <div class="column-item flex-1">{{ state.text }}</div>
    <div class="column-item">3</div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import UserPicker from '@/components/UserPicker.vue'

// state
const state = reactive({
  id: '',
  text: ''
})

state.text = 'test'
</script>

<style scoped lang="scss"></style>
