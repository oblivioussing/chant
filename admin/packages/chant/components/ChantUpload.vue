<template>
  <!-- list upload -->
  <el-upload
    v-bind="uploadAttrs"
    :file-list="showFileList ? vModel : undefined"
    :limit="props.limit"
    :list-type="props.uploader === 'picture-card' ? 'picture-card' : 'text'"
    :multiple="props.multiple"
    :on-change="onChange"
    :on-exceed="onExceed"
    :on-preview="onPreview"
    :show-file-list="showFileList"
    @update:file-list="updateFileList">
    <!-- single-image -->
    <template v-if="props.uploader === 'single-image'">
      <el-image v-if="vModel" class="image" fit="cover" :src="vModel">
      </el-image>
      <el-icon v-else class="uploader-icon"><Plus /></el-icon>
    </template>
    <!-- file-list -->
    <el-button v-if="props.uploader === 'file-list'" type="primary">
      {{ t('clickUpload') }}
    </el-button>
    <!-- picture-card -->
    <el-icon v-else-if="props.uploader === 'picture-card'">
      <Plus />
    </el-icon>
    <!-- file -->
    <template v-if="props.uploader === 'file-list'" #file="{ file }">
      <div class="file-item">
        <el-icon><Document /></el-icon>
        <div>{{ file.name }}</div>
        <div class="flex-1"></div>
        <el-icon
          v-if="file.filePath"
          class="file-icon"
          @click="onDownload(file)">
          <Download />
        </el-icon>
        <el-icon class="file-icon close" @click="onDelete(file)">
          <Close />
        </el-icon>
      </div>
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
import { computed, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Close, Document, Download, Plus } from '@element-plus/icons-vue'
import { base, shiki, type FileBizType, type Uploader } from '@chant'
import { chant as lang } from '@chant/lang'

// type
type DataItem = {
  id: string
  filename: string
  filenameOriginal: string
  filePath: string
  uid?: number
}
type Props = {
  accept?: string // 接受上传的文件类型
  disabled?: boolean // 禁用
  fileBizType?: FileBizType // 文件业务类型
  fileSize?: number // 允许上传文件的大小(MB)
  limit?: number // 允许上传文件的最大数量
  multiple?: boolean // 是否支持多选文件
  uploader: Uploader // 风格样式
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
  const list: Uploader[] = ['file-list', 'picture-card']
  return list.includes(props.uploader)
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
    class: ['chant-upload', props.uploader],
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
// update file list
function updateFileList(val: any) {
  if (showFileList.value) {
    vModel.value = val
  }
}
// 文件超出限制
function onExceed(files: File[]) {
  if (props.uploader === 'single-image' || props.limit === 1) {
    uploadRef.value!.clearFiles()
    const file = files[0] as UploadRawFile
    file.uid = genFileId()
    uploadRef.value!.handleStart(file)
    return
  }
  ElMessage.warning(t('limitTips'))
}
// 下载
function onDownload(row: DataItem) {
  const url = row.filePath + row.filename
  base.downloadByUrl({ url })
}
// 删除
function onDelete(row: DataItem) {
  const list = vModel.value as DataItem[]
  const index = list.findIndex((item) => {
    if (item.uid) {
      return item.uid === row.uid
    } else {
      return item.id === row.id
    }
  })
  list.splice(index, 1)
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
  .file-item {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 0 5px;
    .file-icon {
      color: var(--main-color);
      cursor: pointer;
      &:active {
        opacity: 0.5;
      }
      &.close {
        color: var(--red-color);
      }
    }
  }
  .tip {
    color: var(--red-color);
  }
}
@container (min-width: 600px) {
  .el-upload-list--text {
    width: 45%;
  }
}
</style>
