<template>
  <ColumnBox>
    <template #default="{ row }">
      <div class="column-operate">
        <!-- 编辑 -->
        <chant-icon-button
          v-if="show('edit')"
          icon-type="edit"
          link
          @click="emits('edit', row)">
        </chant-icon-button>
        <!-- 复制 -->
        <chant-icon-button
          v-if="show('copy')"
          icon-type="copyDocument"
          link
          @click="emits('copy', row)">
        </chant-icon-button>
        <!-- 详情 -->
        <chant-icon-button
          v-if="show('detail')"
          icon-type="link"
          link
          @click="emits('detail', row)">
        </chant-icon-button>
        <!-- 删除 -->
        <chant-icon-button
          v-if="show('delete')"
          icon-type="delete"
          link
          type="danger"
          @click="emits('delete', row)">
        </chant-icon-button>
        <slot :row="row"></slot>
      </div>
    </template>
  </ColumnBox>
</template>

<script setup lang="tsx">
import { computed, defineComponent, useSlots } from 'vue'
import { useI18n } from 'vue-i18n'
import { chant as lang } from '@chant/lang'

type Option = 'edit' | 'copy' | 'detail' | 'delete'
// props
const props = defineProps<{
  options?: Option[]
  vxe?: boolean
  width?: string | number
}>()
// emits
const emits = defineEmits(['edit', 'copy', 'detail', 'delete'])
// use
const { t } = useI18n({ messages: lang })
const slots = useSlots()
// computed
const widthCpd = computed(() => {
  if (props.width) {
    return props.width
  }
  const count = props.options?.length || 0
  let width = count > 1 ? 25 * count : 30
  width = slots.default ? width + 25 : width
  return width
})
// 显示按钮
function show(type: Option) {
  return props.options?.includes(type)
}
// column box
const ColumnBox = defineComponent({
  setup() {
    const slots = useSlots()
    return () => {
      return (
        <el-table-column
          align="center"
          fixed="right"
          label={t('operate')}
          width={widthCpd.value}>
          {{
            default: ({ row }: any) => {
              return slots.default ? slots.default({ row }) : null
            }
          }}
        </el-table-column>
      )
    }
  }
})
</script>

<style scoped lang="scss">
.column-operate {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  :deep(.el-button.is-link) {
    font-size: 16px;
  }
  :deep(.el-button + .el-button) {
    margin-left: 0;
  }
}
</style>
