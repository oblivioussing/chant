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
            :label="item.tableName"
            :value="item.tableName">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-table :data="state.list" :border="true">
      <el-table-column
        align="center"
        prop="COLUMN_NAME"
        label="字段"
        width="140px">
      </el-table-column>
      <el-table-column
        align="center"
        prop="COLUMN_COMMENT"
        label="字段名"
        width="140px">
      </el-table-column>
      <el-table-column
        align="center"
        prop="COLUMN_TYPE"
        label="字段类型"
        width="140px">
      </el-table-column>
      <el-table-column align="center" prop="config" label="配置">
        <template #="{ row }">
          <div class="config-box">
            <!-- required -->
            <div class="config-item">
              <div class="label">required:</div>
              <el-select v-model="row.required" size="small">
                <el-option label="true" :value="1"></el-option>
                <el-option label="false" :value="0"></el-option>
              </el-select>
            </div>
            <!-- type -->
            <div class="config-item">
              <div class="label">type:</div>
              <el-select v-model="row.type" size="small">
                <el-option
                  v-for="item in typeList"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </div>
          </div>
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
import { ElMessage } from 'element-plus'
import { onMounted, reactive } from 'vue'
import Ryougi, { type RequestConfig } from './api/ryougi'

const ryougi = new Ryougi()
ryougi.baseurl = 'http://127.0.0.1:7200/'

// var
const typeList = [
  'date-picker',
  'input',
  'input-number',
  'input-number-range',
  'radio',
  'select',
  'time-picker',
  'upload'
]
// state
const state = reactive({
  form: {
    type: '1',
    tableName: ''
  },
  tableList: [] as any[],
  list: [],
  loading: false,
  listLoading: false
})
// onMounted
onMounted(() => {
  getTableList()
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
// 获取表字段
async function getTableField() {
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
}
// 开始生成
async function onStart() {
  const config = {
    url: 'generate/start',
    method: 'POST',
    body: state.list
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

<style lang="scss">
.page-box {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  padding: 10px;
}
.config-box {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .config-item {
    display: flex;
    align-items: center;
    .label {
      margin-right: 10px;
    }
  }
  .config-item + .config-item {
    margin-left: 10px;
  }
}
.footer-box {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-top: 10px;
}
</style>
