<template>
  <div class="column-box">
    <role-tree ref="treeRef" @node-click="onNode"></role-tree>
    <div class="column-item flex-1">
      <chant-table
        v-model="state"
        :show-selection="false"
        :span-method="spanMerge">
        <!-- 一级菜单 -->
        <template #first="{ row }">
          <el-checkbox
            v-model="row.first.checked"
            :label="row.first.name"
            :false-value="0"
            :true-value="1"
            @change="onFun(row, 'first')">
          </el-checkbox>
        </template>
        <!-- 二级级菜单 -->
        <template #second="{ row }">
          <el-checkbox
            v-model="row.second.checked"
            :label="row.second.name"
            :false-value="0"
            :true-value="1"
            @change="onFun(row, 'second')">
          </el-checkbox>
        </template>
        <!-- 三级级菜单 -->
        <template #third="{ row }">
          <el-checkbox
            v-if="row.third?.id"
            v-model="row.third.checked"
            :label="row.third.name"
            :false-value="0"
            :true-value="1"
            @change="onFun(row, 'third')">
          </el-checkbox>
        </template>
        <!-- 功能 -->
        <template #funs="{ row }">
          <div v-for="item in row.funs" :key="item.id" class="fun-item">
            <el-checkbox
              v-model="item.checked"
              :label="item.name"
              :false-value="0"
              :true-value="1"
              @change="onFun(row, 'funs')">
            </el-checkbox>
          </div>
        </template>
      </chant-table>
      <div class="footer toolbar">
        <el-checkbox
          v-model="state.allChecked"
          label="全选"
          :false-value="0"
          :true-value="1"
          @change="onAll">
        </el-checkbox>
        <el-button :loading="state.loading" type="primary" @click="onSave">
          保存
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="tsx">
import { reactive, ref } from 'vue'
import { base, shiki, useLister } from 'chant'
import { columns } from './share'
import RoleTree from './components/RoleTree.vue'

type Fun = {
  checked: 0 | 1
  id: string
  name: string
}
type Item = {
  first: Fun
  second: Fun
  third?: Fun
  funs?: Fun[]
}
type Type = keyof Item

// use
const lister = useLister()
// ref
const treeRef = ref()
// state
let state = reactive({
  ...lister.state,
  list: [] as Item[],
  columns: columns(),
  allChecked: 0 as 0 | 1, // 全选
  span1Arr: [] as number[], // 第一列合并规则
  span2Arr: [] as number[] // 第二列合并规则
})
// 获取列表
async function getList() {
  await lister.getData('role/router', state, { limit: false })
  // 获取合并数
  getSpanArr()
  // 是否全选
  hasAllChecked()
}
// 保存
async function onSave() {
  const id = state.keepQuery.id
  const routerIds = getCheckedIds()
  state.loading = true
  await shiki.post('role/updateRouter', { id, routerIds })
  state.loading = false
}
// 获取选中的ids
function getCheckedIds() {
  const ids = state.list.reduce((acc: string[], cur) => {
    const { first, second, third, funs } = cur
    first?.checked && acc.push(first.id)
    second?.checked && acc.push(second.id)
    third?.checked && acc.push(third.id)
    funs?.forEach((item) => {
      item.checked && acc.push(item.id)
    })
    return acc
  }, [])
  return base.sole(ids)
}
// tree节点
function onNode(row: { id: string }) {
  state.keepQuery.id = row.id
  // 获取列表
  getList()
}
// 全选
function onAll() {
  const checked = state.allChecked
  state.list.forEach((item) => {
    item.first.checked = checked
    item.second.checked = checked
    if (item.third) {
      item.third.checked = checked
    }
    item.funs?.forEach((item1) => {
      item1.checked = checked
    })
  })
}
// 功能change
function onFun(row: Item, type: Type) {
  let checked = 0 as 0 | 1
  if (type === 'funs') {
    const status = row.funs?.some((item) => item.checked)
    checked = status ? 1 : 0
  } else {
    checked = row[type]?.checked ? 1 : 0
  }
  state.list.forEach((item) => {
    // funs
    if (type === 'funs') {
      if (item.first && item.first.id === row.first?.id) {
        item.first.checked = 1
      }
      if (item.second && item.second.id === row.second.id) {
        item.second.checked = 1
      }
      if (item.third && item.third.id === row.third?.id) {
        item.third.checked = 1
      }
    }
    // third
    if (type === 'third') {
      if (item.first && item.first.id === row.first?.id) {
        item.first.checked = 1
      }
      if (item.second && item.second.id === row.second.id) {
        item.second.checked = 1
      }
      if (item.third && item.third.id === row.third?.id) {
        item.funs?.forEach((item1) => {
          item1.checked = checked
        })
      }
    }
    // second
    if (type === 'second') {
      if (item.first && item.first.id === row.first?.id) {
        item.first.checked = 1
      }
      if (item.second && item.second.id === row.second.id) {
        item.second.checked = checked
        if (item.third) {
          item.third.checked = checked
        }
        item.funs?.forEach((item1) => {
          item1.checked = checked
        })
      }
    }
    // first
    if (type === 'first') {
      if (item.first && item.first.id === row.first?.id) {
        item.first.checked = checked
        item.second.checked = checked
        if (item.third) {
          item.third.checked = checked
        }
        item.funs?.forEach((item1) => {
          item1.checked = checked
        })
      }
    }
  })
  // 是否全选
  hasAllChecked()
}
// 是否全选
function hasAllChecked() {
  const checked = state.list.every((item) => {
    if (item.first.checked === 0) {
      return false
    }
    if (item.second.checked === 0) {
      return false
    }
    if (item.third?.checked === 0) {
      return false
    }
    if (item.funs) {
      const checked = item.funs.every((item1) => item1.checked === 1)
      return checked
    }
    return true
  })
  state.allChecked = checked ? 1 : 0
}
// 获取合并数
function getSpanArr() {
  let pos1 = 0
  let pos2 = 0
  state.span1Arr = []
  state.span2Arr = []
  state.list.forEach((item, index) => {
    if (index === 0) {
      state.span1Arr.push(1)
      state.span2Arr.push(1)
      return
    }
    const pre = state.list[index - 1]
    if (item.first.id === pre.first.id) {
      state.span1Arr[pos1] += 1
      state.span1Arr.push(0)
    } else {
      pos1 = index
      state.span1Arr.push(1)
    }
    if (item.second.id === pre.second.id) {
      state.span2Arr[pos2] += 1
      state.span2Arr.push(0)
    } else {
      pos2 = index
      state.span2Arr.push(1)
    }
  })
}
// 行合并
function spanMerge({ rowIndex, columnIndex }: any) {
  const { span1Arr, span2Arr } = state
  if (span1Arr.length && columnIndex === 0) {
    const rowspan = span1Arr[rowIndex]
    const colspan = rowspan > 0 ? 1 : 0
    if (rowspan) {
      return { rowspan, colspan }
    }
    return { rowspan: 0, colspan: 0 }
  }
  if (span2Arr.length && columnIndex === 1) {
    const rowspan = span2Arr[rowIndex]
    const colspan = rowspan > 0 ? 1 : 0
    if (rowspan) {
      return { rowspan, colspan }
    }
    return { rowspan: 0, colspan: 0 }
  }
}
</script>

<style scoped lang="scss">
.fun-item + .fun-item {
  margin-left: 10px;
}
.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 5px;
}
</style>
