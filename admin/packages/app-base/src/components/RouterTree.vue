<template>
  <div class="tree-box">
    <div class="toolbar">
      <el-input v-model="state.name" clearable placeholder="路由名称">
      </el-input>
    </div>
    <div class="tree-container" ref="scrollRef">
      <el-tree :data="state.list"></el-tree>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onActivated, onMounted, ref, reactive } from 'vue'
import { useScroll } from '@vueuse/core'
import { shiki } from 'chant'

// ref
const scrollRef = ref<HTMLElement | null>()
// use
const { y } = useScroll(scrollRef)
// state
const state = reactive({
  name: '',
  list: []
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
  const { data } = await shiki.get('router/tree')
  console.log(data)
}
</script>

<style scoped lang="scss"></style>
