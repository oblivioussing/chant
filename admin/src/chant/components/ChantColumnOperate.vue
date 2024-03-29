<template>
  <el-table-column
    :align="'center'"
    fixed="right"
    :label="t('operate')"
    :width="widthCpd">
    <template #default="{ row, $index }">
      <div class="column-operate">
        <!-- 编辑 -->
        <chant-button v-if="show('edit')" link @click="emits('edit', row)">
          {{ tg('button.edit') }}
        </chant-button>
        <!-- 详情 -->
        <chant-button v-if="show('detail')" link @click="emits('detail', row)">
          {{ tg('button.detail') }}
        </chant-button>
        <!-- 删除 -->
        <chant-button
          v-if="show('delete')"
          link
          type="danger"
          @click="emits('delete', row)">
          {{ tg('button.delete') }}
        </chant-button>
        <slot :index="$index" :row="row"></slot>
      </div>
    </template>
  </el-table-column>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import lang from '@/lang/chant'

type Option = 'edit' | 'detail' | 'delete'
// props
const props = defineProps<{
  options?: Option[]
  width?: string | number
}>()
// emits
const emits = defineEmits(['edit', 'detail', 'delete'])
// use
const { t } = useI18n({ messages: lang })
const { t: tg } = useI18n({ useScope: 'global' })
// computed
const widthCpd = computed(() => {
  if (props.width) {
    return props.width
  }
  const count = props.options?.length || 0
  return count > 1 ? 50 * count : 60
})
// 显示按钮
function show(type: Option) {
  return props.options?.includes(type)
}
</script>

<style scoped lang="scss">
.column-operate {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}
</style>
