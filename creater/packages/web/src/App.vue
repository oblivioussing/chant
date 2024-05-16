<template>
  <div v-loading="state.listLoading" class="page-box">
    <el-form :model="state.form" inline>
      <el-form-item label="类型:">
        <el-select v-model="state.form.type">
          <el-option label="前端" value="1"></el-option>
          <el-option label="后端" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="表名:">
        <el-select v-model="state.form.tableName" @change="getTableField">
          <el-option
            v-for="item in state.tableList"
            :key="item.tableName"
            :value="item.tableName">
            <div class="option-box">
              <div>{{ item.tableName }}</div>
              <div class="minor">{{ item.tableComment }}</div>
            </div>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="路由:">
        <el-input v-model="state.form.routePath"></el-input>
      </el-form-item>
    </el-form>
    <el-table
      :border="true"
      :data="state.list"
      ref="tableRef"
      row-key="columnName">
      <!-- 复选框 -->
      <el-table-column
        align="center"
        fixed="left"
        type="selection"
        width="35" />
      <!-- 字段 -->
      <el-table-column
        align="center"
        prop="columnName"
        label="字段"
        :width="columnWidth">
      </el-table-column>
      <!-- 字段名 -->
      <el-table-column
        align="center"
        prop="columnComment"
        label="字段名"
        :width="columnWidth">
      </el-table-column>
      <!-- 字段类型 -->
      <el-table-column
        align="center"
        prop="columnType"
        label="字段类型"
        :width="columnWidth">
      </el-table-column>
      <!-- 配置 -->
      <el-table-column
        v-if="state.form.type === '1'"
        align="center"
        label="配置">
        <template #="{ row }">
          <!-- 前端配置 -->
          <front-config v-show="state.form.type === '1'" :row="row">
          </front-config>
        </template>
      </el-table-column>
    </el-table>
    <div class="footer-box">
      <el-button
        :loading="state.loading"
        size="small"
        type="primary"
        @click="onStart">
        开始生成
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, type TableInstance } from 'element-plus'
// @ts-ignore
import Sortable from 'sortablejs'
import { computed, onMounted, reactive, ref } from 'vue'
import Ryougi, { type RequestConfig } from './api/ryougi'
import FrontConfig from './components/FrontConfig.vue'

const ryougi = new Ryougi()
ryougi.baseurl = 'http://10.168.1.194:7010/'

// ref
const tableRef = ref<TableInstance>()
// state
const state = reactive({
  form: {
    routePath: '',
    tableComment: '',
    tableName: '',
    type: '1'
  },
  tableList: [] as any[],
  list: [],
  loading: false,
  listLoading: false
})
// computed
const columnWidth = computed(() => {
  return state.form.type === '1' ? '140px' : undefined
})
// onMounted
onMounted(() => {
  // 获取表列表
  getTableList()
  // 初始化拖拽
  initSortable()
})
// 获取表列表
async function getTableList() {
  const config = {
    url: 'table/list',
    method: 'GET'
  } as RequestConfig
  let response = await ryougi.request(config)
  const { data } = await response?.json()
  state.tableList = data
}
// 初始化拖拽
function initSortable() {
  const el = tableRef.value?.$el.querySelector('.el-table__body > tbody')
  Sortable.create(el, {
    onEnd: (event: any) => {
      const { oldIndex, newIndex } = event
      const oldRow = state.list[oldIndex]
      const newRow = state.list[newIndex]
      state.list[oldIndex] = newRow
      state.list[newIndex] = oldRow
    }
  })
}
// 获取表字段
async function getTableField(val: string) {
  const row = state.tableList.find((item) => item.tableName === val)
  state.form.tableComment = row.tableComment
  state.form.routePath = row.tableName
  // 获取表字段
  getFidld()
}
// 获取表字段
async function getFidld() {
  const config = {
    url: 'table/field',
    method: 'GET',
    params: { tableName: state.form.tableName }
  } as RequestConfig
  state.listLoading = true
  try {
    let response = await ryougi.request(config)
    const { data } = await response?.json()
    state.list = data
  } catch (error) {
    console.log(error)
  }
  state.listLoading = false
  setTimeout(() => {
    tableRef.value?.toggleAllSelection()
  }, 0)
}
// 开始生成
async function onStart() {
  const selections = tableRef.value?.getSelectionRows() as any[]
  const list = state.list.filter((item: any) => {
    const row = selections.find((child) => {
      return child.columnName === item.columnName
    })
    return row
  })
  const config = {
    url: 'generate/start',
    method: 'POST',
    body: { ...state.form, list }
  } as RequestConfig
  try {
    state.loading = true
    let response = await ryougi.request(config)
    const { code } = await response?.json()
    if (code === '1') {
      ElMessage.success('生成成功')
    } else {
      ElMessage.error('生成失败')
    }
  } catch (error: any) {
    ElMessage.error(error)
  }
  state.loading = false
}
</script>

<style scoped lang="scss">
.page-box {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  padding: 10px;
}
.option-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .minor {
    color: var(--el-text-color-secondary);
  }
}
.footer-box {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-top: 10px;
}
</style>
