<template>
  <!-- pure-button -->
  <el-button
    v-if="isPureButton"
    :disabled="props.disabled"
    type="primary"
    @click="onTrigger">
    {{ props.buttonText || t('import') }}
  </el-button>
  <!-- upload -->
  <el-upload
    v-model:file-list="state.fileList"
    action="/"
    :auto-upload="false"
    class="chant-upload"
    :class="[props.type]"
    :disabled="props.disabled"
    :limit="props.limit"
    :list-type="props.type === 'picture-card' ? 'picture-card' : 'text'"
    :multiple="props.multiple"
    ref="uploadRef"
    :show-file-list="showFileList"
    :on-change="onChange"
    :on-preview="onPreview">
    <!-- file-list -->
    <el-button v-if="props.type === 'file-list'" type="primary">
      {{ t('upload') }}
    </el-button>
    <!-- picture-card -->
    <el-icon v-else-if="props.type === 'picture-card'">
      <Plus />
    </el-icon>
    <!-- single-image -->
    <template v-else-if="props.type === 'single-image'">
      <el-image v-if="state.imageUrl" class="image" :src="state.imageUrl">
      </el-image>
      <el-icon v-else class="uploader-icon"><Plus /></el-icon>
    </template>
  </el-upload>
  <!-- preview -->
  <el-dialog v-model="state.previewVisible" append-to-body>
    <img style="width: 100%" :src="state.previewUrl" />
  </el-dialog>
</template>

<script setup lang="ts">
import type { UploadFile, UploadRawFile } from 'element-plus'
import { computed, onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Plus } from '@element-plus/icons-vue'
import { shiki, type UploadType } from '@/chant'
import { type RequestConfig } from '@/api/ryougi'
import lang from '@/lang/chant'

// type
interface Props {
  buttonText?: string // 按钮文本
  disabled?: boolean
  limit?: number // 允许上传文件的最大数量
  multiple?: boolean // 是否支持多选文件
  type: UploadType // 文件上传类型
}
// props
const props = withDefaults(defineProps<Props>(), {
  type: 'pure-button'
})
// use
const { t } = useI18n({ messages: lang })
// var
const isPureButton = props.type === 'pure-button'
// ref
const uploadRef = ref()
// state
const state = reactive({
  imageUrl: '', // 图片地址
  fileList: [], // 文件列表
  previewUrl: '', // 预览图片地址
  previewVisible: false // 预览visible
})
// computed
const showFileList = computed(() => {
  const list: UploadType[] = ['file-list', 'picture-card']
  const status = list.includes(props.type)
  return status
})
// onMounted
onMounted(() => {
  if (isPureButton) {
    // 挪动元素
    movingElement()
  }
})
// 挪动元素(主要是解决el-button-group样式问题)
function movingElement() {
  const uploadEl = uploadRef.value.$el as HTMLElement
  const parentEl = uploadEl.parentElement
  const classList = parentEl?.classList
  const status = classList?.contains('el-button-group')
  if (status) {
    parentEl?.parentElement?.appendChild(uploadEl)
  }
}
// file change
function onChange(row: UploadFile) {
  // 上传文件
  upload(row.raw!)
}
// 按钮出发文件选择
function onTrigger() {
  const el = uploadRef.value.$el as HTMLElement
  const uploadEL = el.querySelector('.el-upload') as HTMLElement
  uploadEL?.click()
}
// 预览
function onPreview(row: any) {
  if (row.url) {
    state.previewUrl = row.url
    state.previewVisible = true
  }
}
// 上传文件
async function upload(file: UploadRawFile) {
  const formData = new FormData()
  formData.append('test', '123')
  formData.append('file', file)
  const requestConfig = {
    url: 'fs/upload',
    body: formData,
    method: 'POST'
  } as RequestConfig
  const { data } = await shiki.request(requestConfig)
  console.log(data)
}
</script>

<style lang="scss">
.chant-upload {
  --picture-size: 100px;
  container-type: inline-size;
  flex: 1;
  &.pure-button {
    container-type: normal;
    display: inline-block;
  }
  &.single-image {
    .image {
      display: block;
      height: var(--picture-size);
      width: var(--picture-size);
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      overflow: hidden;
      position: relative;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .uploader-icon {
      color: #8c939d;
      font-size: 28px;
      text-align: center;
      height: var(--picture-size);
      width: var(--picture-size);
    }
  }
  &.picture-card {
    .el-upload-list--picture-card {
      .el-upload--picture-card,
      .el-upload-list__item {
        height: var(--picture-size) !important;
        width: var(--picture-size) !important;
      }
    }
  }
}
@container (min-width: 600px) {
  .el-upload-list--text {
    width: 45%;
  }
}
</style>
