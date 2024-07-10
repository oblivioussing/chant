<template>
  <!-- button -->
  <el-button type="primary" @click="state.visible = true">
    <chant-icon-font v-if="state.icon" :icon="state.icon"></chant-icon-font>
    <template v-else>选择</template>
  </el-button>
  <!-- dialog -->
  <chant-dialog
    v-model="state.visible"
    append-to-body
    style="width: 800px"
    title="选择图标">
    <div class="icon-box">
      <div
        v-for="(item, index) in state.list"
        :key="index"
        class="icon-item"
        :class="{ active: item === state.icon }"
        @click="onPick(item)">
        <div v-if="item === state.icon" class="checked">
          <el-icon class="checked-icon">
            <Check />
          </el-icon>
        </div>
        <chant-icon-font class="iconfont" :icon="item"></chant-icon-font>
        <el-text truncated>{{ item }}</el-text>
      </div>
    </div>
  </chant-dialog>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { Check } from '@element-plus/icons-vue'

// props
const props = defineProps<{
  modelValue: any
}>()
// emit
const emit = defineEmits(['update:modelValue'])
// state
const state = reactive({
  icon: props.modelValue,
  list: [] as string[],
  loading: false,
  visible: false
})
// onMounted
onMounted(() => {
  // 获取图标
  getIcon()
})
// 获取图标
async function getIcon() {
  state.loading = true
  const response = await fetch('/js/iconfont.js')
  const content = await response.text()
  const regex = /id="([^"]*)"/g
  const matches = content.match(regex)
  const list = matches
    ? matches.map((match) => match.replace(/id="icon-([^"]*)"/, '$1'))
    : []
  state.loading = false
  state.list = list
}
// 选中
function onPick(icon: string) {
  state.icon = icon
  emit('update:modelValue', icon)
  state.visible = false
}
</script>

<style scoped lang="scss">
.icon-box {
  --border-color: #eee;
  border-color: var(--border-color) transparent transparent var(--border-color);
  border-style: solid;
  border-width: 1px 0 0 1px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  grid-auto-rows: 100px;
  overflow: auto;
  .icon-item {
    border-color: transparent var(--border-color) var(--border-color)
      transparent;
    border-style: solid;
    border-width: 0 1px 1px 0;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    &:hover,
    &.active {
      border: 1px solid var(--main-color);
      color: var(--main-color);
      .el-text {
        color: var(--main-color);
      }
    }
    &:hover {
      .iconfont,
      .el-text {
        transform: scale(1.2);
      }
    }
    .iconfont {
      font-size: 26px;
      margin-bottom: 3px;
    }
    .checked {
      border-color: var(--main-color) var(--main-color) transparent transparent;
      border-style: solid;
      border-width: 20px;
      height: 0;
      position: absolute;
      right: 0;
      top: 0;
      width: 0;
      .checked-icon {
        color: #fff;
        font-size: 20px;
        position: absolute;
        top: -17px;
        right: -18px;
      }
    }
  }
}
</style>
