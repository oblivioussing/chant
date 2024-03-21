<template>
  <div class="toolbar chant-table-operation">
    <div class="all-box">
      <el-checkbox
        v-if="props.showCheckedAll"
        class="all-box"
        @change="onChange">
        <span>{{ t('all') }}:</span>
        <span style="padding-left: 5px">
          {{ vModel.total }}{{ t('record') }}
        </span>
      </el-checkbox>
    </div>
    <div class="button-box" ref="groupsRef">
      <slot name="group"></slot>
      <!-- 自定义按钮(组) -->
      <el-button-group class="m-l-10">
        <slot></slot>
      </el-button-group>
      <!-- 批量编辑 -->
      <div v-if="show('alter')" class="m-l-10">
        <el-dropdown
          v-if="slots['alter-option']"
          :disabled="!isSelected"
          :split-button="props.splitButton"
          type="primary"
          @click="emits('alter')"
          @command="emits('command', $event)">
          <template v-if="props.splitButton">
            {{ t('batch') + tg('button.alter') }}
          </template>
          <el-button v-else type="primary">
            {{ t('batch') + tg('button.alter') }}
            <el-icon class="m-l-5"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <slot name="alter-option"></slot>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-button v-else type="primary" @click="emits('alter')">
          {{ t('batch') + tg('button.alter') }}
        </el-button>
      </div>
      <!-- 新增,批量删除 -->
      <div :class="{ 'm-l-10': props.options?.length }">
        <el-button-group>
          <!-- 新增 -->
          <chant-icon-button
            v-if="show('add')"
            :content="tg('button.add')"
            icon-type="plus"
            type="primary"
            @click="emits('add')">
          </chant-icon-button>
          <!-- 批量删除 -->
          <chant-icon-button
            v-if="show('delete')"
            :content="t('batch') + tg('button.delete')"
            :disabled="!isSelected"
            icon-type="delete"
            type="danger"
            @click="emits('delete')">
          </chant-icon-button>
        </el-button-group>
      </div>
      <el-button-group class="m-l-10">
        <!-- 表单操作方式 -->
        <chant-button :content="t('formType')" @click="onFormType">
          <icon-font :icon="formTypeIcon"></icon-font>
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
import { computed, onMounted, ref, useSlots, type ModelRef } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ArrowDown } from '@element-plus/icons-vue'
import { type FormType, type ListState } from '@/chant'
import lang from '@/lang/chant'
import { core } from '@/utils'
import FieldFilter from './FieldFilter.vue'

// type
type Option = 'add' | 'alter' | 'delete'
interface Props {
  lang?: any // 国际化
  options?: Option[] // 按钮选项
  showCheckedAll?: boolean // 是否显示全选
  showFilter?: boolean // 是否显示过滤按钮
  splitButton?: boolean // 下拉触发元素呈现为按钮组(仅批量修改按钮生效)
}
// props
const props = withDefaults(defineProps<Props>(), {
  showFilter: true
})
// emits
const emits = defineEmits(['add', 'alter', 'command', 'delete'])
// model
const vModel = defineModel() as ModelRef<ListState>
// use
const { t } = useI18n({ messages: lang })
const { t: tg } = useI18n({ useScope: 'global' })
const route = useRoute()
const slots = useSlots()
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
  }, 100)
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
