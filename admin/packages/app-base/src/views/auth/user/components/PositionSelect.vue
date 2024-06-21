<template>
  <el-select
    v-model="vModel"
    clearable
    filterable
    placeholder="请选择职位"
    @change="onChange">
    <el-option
      v-for="item in state.list"
      :key="item.id"
      :label="item.name"
      :value="item.id">
    </el-option>
  </el-select>
</template>

<script setup lang="ts">
import { onMounted, reactive, watch } from 'vue'
import { shiki } from 'chant'

// props
const props = defineProps<{
  orgId?: string
}>()
// emits
const emits = defineEmits(['change'])
// model
const vModel = defineModel<string>()
// state
const state = reactive({
  list: [] as any[]
})
// onMounted
onMounted(() => {
  // 获取职位列表
  getList()
})
// watch
watch(
  () => props.orgId,
  () => {
    // 获取职位列表
    getList()
  }
)
// 获取职位列表
async function getList() {
  const orgId = props.orgId
  const { data } = await shiki.get('position/list', { orgId })
  state.list = data
}
// change
function onChange(val: string) {
  const row = state.list.find((item) => item.id === val)
  emits('change', row)
}
</script>

<style scoped lang="scss"></style>
