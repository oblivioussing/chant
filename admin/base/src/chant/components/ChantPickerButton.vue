<template>
  <el-input
    v-model="text"
    class="chant-picker-input"
    :disabled="props.disabled"
    :placeholder="tips"
    :prefix-icon="Search"
    readonly
    :value="text"
    @click="visible = true">
    <template #suffix>
      <div
        v-if="text && props.disabled !== true"
        class="clear-box"
        @click="onClear">
        <el-icon :size="14" class="pointer">
          <circle-close></circle-close>
        </el-icon>
      </div>
    </template>
  </el-input>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { CircleClose, Search } from '@element-plus/icons-vue'
import { base } from '@/chant'

// props
const props = defineProps<{
  disabled?: boolean
  placeholder?: string
}>()
// emits
const emits = defineEmits(['clear'])
// model
const id = defineModel<string>('id')
const text = defineModel<string>('text')
const visible = defineModel<boolean>()
// use
const { t: gt } = useI18n({ useScope: 'global' })
// computed
const tips = computed(() => {
  return base.i18nJoint([gt('tips.select'), props.placeholder || ''])
})
// 清空
function onClear() {
  id.value = ''
  text.value = ''
  emits('clear')
}
</script>

<style scoped lang="scss">
.chant-picker-input {
  &.is-disabled {
    .clear-box {
      display: none;
    }
  }
}
.chant-picker-input:not(.is-disabled) {
  .clear-box {
    cursor: pointer;
    display: flex;
    align-items: center;
  }
  :deep(.el-input__prefix) {
    cursor: pointer;
  }
  :deep(.el-input__inner) {
    cursor: pointer;
  }
}
</style>
