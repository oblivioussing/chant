<template>
  <!-- list upload -->
  <el-upload
    v-if="showFileList"
    v-model:file-list="vModel"
    v-bind="uploadAttrs"
    :limit="props.limit"
    :list-type="props.type === 'picture-card' ? 'picture-card' : 'text'"
    :multiple="props.multiple"
    :on-change="onChange"
    :on-exceed="onExceed"
    :on-preview="onPreview">
    <!-- file-list -->
    <el-button v-if="props.type === 'file-list'" type="primary">
      {{ t('clickUpload') }}
    </el-button>
    <!-- picture-card -->
    <el-icon v-else-if="props.type === 'picture-card'">
      <Plus />
    </el-icon>
    <!-- tip -->
    <template #tip>
      <div class="tip">{{ tip }}</div>
    </template>
  </el-upload>
  <!-- single upload -->
  <el-upload
    v-else
    v-bind="uploadAttrs"
    :show-file-list="false"
    :on-change="onChange"
    :on-exceed="onExceed">
    <!-- single-image -->
    <template v-if="props.type === 'single-image'">
      <el-image v-if="vModel" class="image" fit="cover" :src="vModel">
      </el-image>
      <el-icon v-else class="uploader-icon"><Plus /></el-icon>
    </template>
    <!-- tip -->
    <template #tip>
      <div class="tip">{{ tip }}</div>
    </template>
  </el-upload>
  <!-- preview -->
  <el-dialog v-model="state.preview" append-to-body>
    <img style="width: 100%" :src="state.previewUrl" />
  </el-dialog>
</template>

<script setup lang="ts">
import { genFileId, ElMessage } from 'element-plus'
import type { UploadFile, UploadInstance, UploadRawFile } from 'element-plus'
import { computed, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Plus } from '@element-plus/icons-vue'
import { shiki, type FileBizType, type UploadType } from '@chant'
import { chant as lang } from '@chant/lang'

// type
type DataItem = {
  id: string
  filename: string
  filenameOriginal: string
  filePath: string
}
type Props = {
  accept?: string // 接受上传的文件类型
  disabled?: boolean // 禁用
  fileBizType?: FileBizType // 文件业务类型
  fileSize?: number // 允许上传文件的大小(MB)
  limit?: number // 允许上传文件的最大数量
  multiple?: boolean // 是否支持多选文件
  type: UploadType // 文件上传类型
}
// props
const props = withDefaults(defineProps<Props>(), {
  fileSize: 20
})
// emits
const emits = defineEmits(['upload'])
// model
const vModel = defineModel<any>({
  get(value) {
    return value === null ? undefined : value
  }
})
// use
const { t } = useI18n({ messages: lang })
// ref
const uploadRef = ref<UploadInstance>()
// state
let state = reactive({
  preview: false, // 预览
  previewUrl: '' // 预览图片地址
})
// computed
const showFileList = computed(() => {
  const list: UploadType[] = ['file-list', 'picture-card']
  return list.includes(props.type)
})
const tip = computed(() => {
  const list = []
  if (props.limit) {
    list.push(t('countTips', [props.limit]))
  }
  if (props.fileSize) {
    const fileSize =
      props.fileSize < 1
        ? (props.fileSize * 1024).toFixed(0) + 'KB'
        : props.fileSize + 'MB'
    list.push(t('sizeTips', [fileSize]))
  }
  if (props.accept) {
    list.push(t('acceptTips', [props.accept?.replace(/\./g, '')]))
  }
  return list.join(', ')
})
const uploadAttrs = computed(() => {
  return {
    action: '/',
    accept: props.accept,
    autoUpload: false,
    class: ['chant-upload', props.type],
    disabled: props.disabled,
    ref: uploadRef
  }
})
// file change
async function onChange(row: UploadFile) {
  if (row.size! / 1024 > props.fileSize * 1024) {
    uploadRef.value!.handleRemove(row)
    ElMessage.warning(t('sizeExceedsTips'))
    return
  }
  if (!showFileList.value) {
    const data = await upload(row.raw!)
    if (data) {
      vModel.value = data.filePath + data.filename
    }
    emits('upload', data)
  }
}
// 文件超出限制
function onExceed(files: File[]) {
  if (props.type === 'single-image' || props.limit === 1) {
    uploadRef.value!.clearFiles()
    const file = files[0] as UploadRawFile
    file.uid = genFileId()
    uploadRef.value!.handleStart(file)
    return
  }
  ElMessage.warning(t('limitTips'))
}
// 预览
function onPreview(row: any) {
  if (row.url) {
    state.previewUrl = row.url
    state.preview = true
  }
}
// 上传文件
async function upload(file: UploadRawFile) {
  const formData = new FormData()
  formData.append('fileBizType', props.fileBizType || '')
  formData.append('file', file)
  const { data } = await shiki.post('fs/upload', formData)
  return data as DataItem
}
</script>

<style lang="scss">
.chant-upload {
  --picture-size: 100px;
  container-type: inline-size;
  flex: 1;
  &.file-list {
    .el-upload-list {
      margin-top: 0;
    }
  }
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
  .tip {
    color: #f87171;
  }
}
@container (min-width: 600px) {
  .el-upload-list--text {
    width: 45%;
  }
}
</style>
