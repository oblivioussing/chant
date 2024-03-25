<template>
  <!-- search -->
  <chant-table-search
    v-model="state"
    :dict="dict"
    :lang="lang"
    @query="getList"
    @reset="getList">
    <!-- 销售员 -->
    <template #userName>
      <user-picker
        v-model:id="state.query.userId"
        :title="t('userName')"
        @change="getList">
      </user-picker>
    </template>
    <!-- 所属人 -->
    <template #belongName>
      <user-picker
        v-model:id="state.query.belongId"
        :title="t('belongName')"
        @change="getList">
      </user-picker>
    </template>
  </chant-table-search>
  <!-- operate -->
  <chant-table-operate
    v-model="state"
    :options="['add', 'alter', 'delete']"
    :lang="lang"
    show-checked-all
    @add="lister.add(state)"
    @delete="onDeletes">
  </chant-table-operate>
  <!-- table -->
  <chant-table v-model="state" :dict="dict" :lang="lang">
    <!-- 操作 -->
    <chant-column-operate :width="100">
      <template #="{ row }">
        <!-- 编辑 -->
        <chant-button link @click="lister.edit(state, row)">
          {{ tg('button.edit') }}
        </chant-button>
        <!-- 删除 -->
        <chant-button link type="danger" @click="onDelete(row)">
          {{ tg('button.delete') }}
        </chant-button>
      </template>
    </chant-column-operate>
  </chant-table>
  <!-- pagination -->
  <chant-pagination
    v-model="state.pages"
    :total="state.total"
    @change="getList">
  </chant-pagination>
  <!-- 新增/编辑 -->
  <chant-dialog v-model="state.editVisible" :title="lister.title(state)">
    <add-edit
      v-if="state.editVisible"
      :copy-flag="state.copyFlag"
      :page-type="state.editType"
      :selection="state.selection"
      @close="state.editVisible = false">
    </add-edit>
  </chant-dialog>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import lang from '@/lang/trade'
import { useLister } from '@/use'
import { columns, dict } from './share'
import AddEdit from './components/AddEdit.vue'

// use
const { t } = useI18n({ messages: lang })
const { t: tg } = useI18n({ useScope: 'global' })
const lister = useLister()
// state
const state = reactive({
  ...lister.state,
  columns: columns()
})
// created
lister.created(() => {
  // 获取列表
  getList()
})
// 获取列表
function getList() {
  lister.getData('trade/list', state)
}
// 删除
function onDelete({ id }: any) {
  lister.remove('trade/delete', state, { id })
}
// 批量删除
function onDeletes() {
  lister.removes('trade/deletes', state)
}
</script>

<style scoped lang="scss"></style>
