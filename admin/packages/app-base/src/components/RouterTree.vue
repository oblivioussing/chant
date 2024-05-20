<template>
  <div class="tree-box">
    <div class="toolbar">
      <el-input
        v-model="state.query.name"
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
              <!-- 新增 -->
              <el-button
                :icon="Plus"
                link
                type="primary"
                @click="onAdd(data, 'add')">
              </el-button>
              <!-- 编辑 -->
              <el-button :icon="Edit" link type="primary"></el-button>
              <!-- 删除 -->
              <el-button :icon="Delete" link type="danger"></el-button>
            </div>
          </div>
        </template>
      </el-tree>
    </div>
  </div>
  <!-- 新增/编辑 -->
  <chant-dialog v-model="state.mixForm" :title="lister.title(state)">
    <mix-form
      v-if="state.mixForm"
      :page-type="state.pageType"
      :selection="state.selection"
      @close="state.mixForm = false">
    </mix-form>
  </chant-dialog>
</template>

<script setup lang="ts">
import { onActivated, onMounted, reactive, ref } from 'vue'
import { Delete, Edit, Plus } from '@element-plus/icons-vue'
import { useScroll } from '@vueuse/core'
import { useLister, type PageType } from 'chant'
import { type Model } from '@app-base/views/auth/router/share'
import MixForm from '@app-base/views/auth/router/components/MixForm.vue'

// ref
const scrollRef = ref<HTMLElement | null>()
// use
const lister = useLister()
const { y } = useScroll(scrollRef)
// state
const state = reactive({
  ...lister.state
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
function getList() {
  lister.getData('router/tree', state, { limit: false })
}
// 新增
function onAdd(row: Model, type: PageType) {
  state.selection = row
  state.pageType = type
  state.mixForm = true
}
</script>

<style scoped lang="scss"></style>
