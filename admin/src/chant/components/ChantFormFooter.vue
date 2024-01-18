<template>
  <div class="chant-form-footer" :class="{ toolbar: props.type }">
    <div>
      <!-- 继续新增 -->
      <el-checkbox v-model="vModel.continueAdd" class="continue">
        {{ t('continue') }}
      </el-checkbox>
    </div>
    <div>
      <slot></slot>
      <template v-if="!$slots.default">
        <!-- 关闭 -->
        <el-button @click="onClose">{{ tg('button.close') }}</el-button>
        <!-- 保存 -->
        <el-button
          :loading="vModel.loading"
          type="primary"
          @click="emits('save')">
          {{ tg('button.save') }}
        </el-button>
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import { type ModelRef } from 'vue'
import { useI18n } from 'vue-i18n'
import type { FormType } from '@/type'
import { core } from '@/utils'

// type
type ModelValue = {
  continueAdd: boolean
  loading: boolean
}
// props
const props = defineProps<{
  type?: FormType
}>()
// emits
const emits = defineEmits(['close', 'save'])
// model
const vModel = defineModel() as ModelRef<ModelValue>
// use
const { t: tg } = useI18n({ useScope: 'global' })
const { t } = useI18n({
  messages: {
    en: {
      continue: 'continue add'
    },
    zh: {
      continue: '继续新增'
    }
  }
})
// 关闭
function onClose() {
  if (props.type === 'page') {
    core.closePage()
  } else {
    emits('close')
  }
}
</script>
<style scoped lang="scss">
.chant-form-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
  :deep(.el-button + .el-button) {
    margin-left: 8px;
  }
  .continue {
    font-weight: normal;
  }
}
</style>
