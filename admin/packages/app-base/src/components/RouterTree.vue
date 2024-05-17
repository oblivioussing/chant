<template>
  <div class="tree-box">
    <div class="toolbar">
      <el-input
        v-model="state.name"
        clearable
        placeholder="路由名称"
        @keyup.enter="getList">
      </el-input>
    </div>
    <div v-loading="state.loading" class="tree-container" ref="scrollRef">
      <el-tree :data="state.list" node-key="id">
        <template #default="{ data }">
          <div class="tree-item">
            <div>{{ data.name }}</div>
            <div class="button-box">
              <el-button :icon="Plus" link type="primary"></el-button>
              <el-button :icon="Edit" link type="primary"></el-button>
              <el-button :icon="Delete" link type="danger"></el-button>
            </div>
          </div>
        </template>
      </el-tree>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onActivated, onMounted, reactive, ref } from 'vue'
import { Delete, Edit, Plus } from '@element-plus/icons-vue'
import { useScroll } from '@vueuse/core'
import { shiki } from 'chant'

// ref
const scrollRef = ref<HTMLElement | null>()
// use
const { y } = useScroll(scrollRef)
// state
const state = reactive({
  name: undefined,
  list: [],
  loading: false
})
// onMounted
onMounted(() => {
  // 获取列表
  getList()
})
// onActivated
onActivated(() => {
  scrollRef.value!.scrollTo({ top: y.value })
})
// 获取列表
async function getList() {
  const name = state.name
  state.loading = true
  const { data } = await shiki.get('router/tree', { name })
  state.loading = false
  state.list = data
}
</script>

<style scoped lang="scss"></style>
