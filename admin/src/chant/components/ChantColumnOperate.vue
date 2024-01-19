<template>
  <el-table-column
    :align="'center'"
    fixed="right"
    :label="t('operate')"
    :width="props.width">
    <template #="{ row, $index }">
      <div class="column-operate">
        <slot :index="$index" :row="row"></slot>
      </div>
    </template>
  </el-table-column>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

// props
const props = defineProps<{
  width?: string | number
}>()
// use
const { t } = useI18n({
  messages: {
    en: {
      operate: 'operate'
    },
    zh: {
      operate: '操作'
    }
  }
})
</script>

<style scoped lang="scss">
.column-operate {
  display: flex;
  align-items: center;
  width: 100%;
}
</style>
