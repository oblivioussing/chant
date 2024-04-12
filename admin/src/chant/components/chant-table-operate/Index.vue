<template>
  <div class="toolbar chant-table-operation">
    <div class="all-box">
      <el-checkbox
        v-if="props.showCheckedAll"
        class="all-box"
        @change="onChange">
        <span>{{ t('chant.all') }}:</span>
        <span class="p-l-5"> {{ vModel.total }}{{ t('chant.record') }} </span>
      </el-checkbox>
    </div>
    <div class="button-box" ref="groupsRef">
      <slot name="alone"></slot>
      <!-- 自定义按钮(组) -->
      <el-button-group class="m-l-10">
        <slot></slot>
      </el-button-group>
      <div :class="{ 'm-l-10': props.options?.length }">
        <el-button-group class="flex">
          <!-- 新增 -->
          <chant-icon-button
            v-if="show('add')"
            :content="gt('button.add')"
            icon-type="plus"
            type="primary"
            @click="emits('add')">
          </chant-icon-button>
          <!-- 批量设置 -->
          <el-dropdown
            v-if="show('set')"
            :disabled="!isSelected"
            @command="emits('set', $event)">
            <el-button
              class="dropdown-button edit"
              :disabled="!isSelected"
              type="primary">
              <el-icon><Setting /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <slot name="edit-option"></slot>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <!-- 批量删除 -->
          <chant-icon-button
            v-if="show('delete')"
            :content="t('chant.batchDelete')"
            :disabled="!isSelected"
            icon-type="delete"
            type="danger"
            @click="emits('delete')">
          </chant-icon-button>
          <!-- 更多操作 -->
          <el-dropdown v-if="show('more')" @command="emits('more', $event)">
            <el-button class="dropdown-button" type="primary">
              <el-icon><More /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <slot name="more-option"></slot>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-button-group>
      </div>
      <el-button-group class="m-l-10">
        <!-- 表单操作方式 -->
        <chant-button :content="t('chant.formType')" @click="onFormType">
          <chant-icon-font :icon="formTypeIcon"></chant-icon-font>
        </chant-button>
        <!-- 字段筛选 -->
        <field-filter
          v-if="vModel.columns && props.showFilter"
          v-model="vModel"
          :lang="props.lang"
          :parent-node="groupsRef">
        </field-filter>
      </el-button-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, type ModelRef } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Setting, More } from '@element-plus/icons-vue'
import type { FormType, Lang, ListState } from '@/chant'
import chantLang from '@/lang/chant'
import { core } from '@/utils'
import FieldFilter from './FieldFilter.vue'

// type
type Option = 'add' | 'set' | 'delete' | 'more'
interface Props {
  lang?: Lang // 国际化
  options?: Option[] // 按钮选项
  showCheckedAll?: boolean // 是否显示全选
  showFilter?: boolean // 是否显示过滤按钮
}
// props
const props = withDefaults(defineProps<Props>(), {
  showFilter: true
})
// emits
const emits = defineEmits(['add', 'set', 'delete', 'more'])
// model
const vModel = defineModel() as ModelRef<ListState>
// use
const en = { ...props.lang?.en, chant: chantLang.en }
const zh = { ...props.lang?.zh, chant: chantLang.zh }
const { t } = useI18n({ messages: { en, zh } })
const { t: gt } = useI18n({ useScope: 'global' })
const route = useRoute()
// ref
const groupsRef = ref()
// computed
const formTypeIcon = computed(() => {
  const map = {
    page: '13',
    dialog: 'popup'
  } as any
  return map[vModel.value.formType]
})
const isSelected = computed(() => {
  const { selections, allFlag } = vModel.value
  return selections.length > 0 || allFlag === 1
})
// onMounted
onMounted(() => {
  // 按钮组
  buttonGroup()
  // 获取缓存formType
  getStorageFormType()
})
// 按钮组
function buttonGroup() {
  setTimeout(() => {
    const groups = groupsRef.value?.querySelectorAll(
      '.el-button-group'
    ) as NodeListOf<Element>
    groups?.forEach((item) => {
      if (item.children.length === 1) {
        item.removeAttribute('class')
      }
    })
  }, 300)
}
// 获取缓存formType
function getStorageFormType() {
  const obj = core.getPageStorage(route.path)
  const formType = obj?.formType
  if (formType) {
    vModel.value.formType = formType as FormType
  }
}
// 显示按钮
function show(type: Option) {
  return props.options?.includes(type)
}
// checkbox change
function onChange(val: any) {
  vModel.value.allFlag = val ? 1 : 0
}
// 表单操作方式
function onFormType() {
  let formType: FormType
  if (vModel.value.formType === 'dialog') {
    formType = 'page'
  } else {
    formType = 'dialog'
  }
  vModel.value.formType = formType
  core.setPageStorage(route.path, 'formType', formType)
}
</script>

<style scoped lang="scss">
.chant-table-operation {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 5px;
  position: relative;
  .all-box {
    font-size: 12px;
    font-weight: normal;
    padding-left: 1px;
  }
  .button-box {
    display: flex;
    align-items: center;
    .flex {
      display: flex;
    }
    .dropdown-seat {
      position: absolute;
      top: 10px;
      right: -5px;
    }
  }
  :deep(.dropdown-button) {
    &.edit {
      border-radius: 0;
    }
    border-right: none;
    padding: 0;
    height: 28px;
    width: 28px;
  }
  .p-l-5 {
    padding-left: 5px;
  }
  .m-l-5 {
    margin-left: 5px;
  }
  .m-l-10 {
    margin-left: 10px;
  }
  :deep(.el-button) {
    height: 28px;
  }
  :deep(.el-button:focus) {
    outline: 0;
    outline-offset: 0;
  }
}
</style>
