<template>
  <el-dialog
    v-model="vModel"
    class="chant-dialog"
    :close-on-click-modal="false"
    :title="props.title">
    <slot></slot>
  </el-dialog>
</template>

<script setup lang="ts">
import { type ModelRef } from 'vue'

// props
const props = defineProps<{
  title: string
}>()
// model
const vModel = defineModel() as ModelRef<boolean>
</script>

<style lang="scss">
.chant-dialog {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  max-height: 84vh;
  margin: 8vh auto;
  overflow: hidden;
  padding-bottom: 0;
  .el-dialog__body {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
    padding: 0 15px 10px;
  }
  .el-dialog__footer {
    padding: 0;
  }
}
</style>
