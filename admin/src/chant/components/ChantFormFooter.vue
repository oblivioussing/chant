<template>
  <div class="chant-form-footer" :class="{ toolbar: vModel.type !== 'dialog' }">
    <div>
      <!-- 继续新增 -->
      <el-checkbox
        v-if="vModel.pageType === 'add'"
        v-model="vModel.continueAdd"
        class="continue">
        {{ t('continueAdd') }}
      </el-checkbox>
    </div>
    <div>
      <slot></slot>
      <template v-if="!$slots.default">
        <!-- 关闭 -->
        <el-button @click="onClose">{{ gt('button.close') }}</el-button>
        <!-- 保存 -->
        <el-button
          v-if="vModel.pageType !== 'detail'"
          :loading="vModel.loading"
          type="primary"
          @click="emits('save')">
          {{ gt('button.save') }}
        </el-button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type ModelRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { core, type FormType, type PageType } from '@/chant'
import lang from '@/lang/chant'

// type
type ModelValue = {
  continueAdd: boolean
  loading: boolean
  pageType: PageType
  type: FormType
}
// emits
const emits = defineEmits(['close', 'save'])
// model
const vModel = defineModel() as ModelRef<ModelValue>
// use
const { t } = useI18n({ messages: lang })
const { t: gt } = useI18n({ useScope: 'global' })
// 关闭
function onClose() {
  if (vModel.value.type === 'page') {
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
  margin-right: 5px;
  margin-top: 5px;
  :deep(.el-button + .el-button) {
    margin-left: 8px;
  }
  .continue {
    font-weight: normal;
  }
}
</style>
