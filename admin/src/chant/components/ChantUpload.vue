<template>
  <!-- upload -->
  <el-upload
    action="/"
    :accept="props.accept"
    :auto-upload="false"
    class="chant-upload"
    :class="[props.type]"
    :disabled="props.disabled"
    :file-list="fileList"
    :limit="props.type === 'single-image' ? 1 : props.limit"
    :list-type="props.type === 'picture-card' ? 'picture-card' : 'text'"
    :multiple="props.multiple"
    ref="uploadRef"
    :show-file-list="showFileList"
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
    <!-- single-image -->
    <template v-else-if="props.type === 'single-image'">
      <el-image
        v-if="state.imageUrl"
        class="image"
        fit="cover"
        :src="state.imageUrl">
      </el-image>
      <el-icon v-else class="uploader-icon"><Plus /></el-icon>
    </template>
    <!-- tip -->
    <template #tip>
      <div class="tip">limit 1 file, new file will cover the old file</div>
    </template>
  </el-upload>
  <!-- preview -->
  <el-dialog v-model="state.preview" append-to-body>
    <img style="width: 100%" :src="state.previewUrl" />
  </el-dialog>
</template>

<script setup lang="ts">
import { genFileId, ElMessage } from 'element-plus'
import type {
  UploadFile,
  UploadInstance,
  UploadRawFile,
  UploadUserFile
} from 'element-plus'
import { computed, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Plus } from '@element-plus/icons-vue'
import { shiki, type FileBizType, type UploadType } from '@/chant'
import { type RequestConfig } from '@/api/ryougi'
import { chant as lang } from '@/lang'

// type
type DataItem = {
  id: string
  filename: string
  filenameOriginal: string
  filePath: string
  name?: string
}
// props
const props = defineProps<{
  accept?: string // 接受上传的文件类型
  disabled?: boolean // 禁用
  fileBizType?: FileBizType // 文件业务类型
  fileSize?: number // 允许上传文件的大小(MB)
  limit?: number // 允许上传文件的最大数量
  multiple?: boolean // 是否支持多选文件
  type: UploadType // 文件上传类型
}>()
// emits
const emits = defineEmits(['upload'])
// model
const vModel = defineModel<any>()
// use
const { t } = useI18n({ messages: lang })
// ref
const uploadRef = ref<UploadInstance>()
// state
const state = reactive({
  imageUrl: '', // 图片地址
  preview: false, // 预览
  previewUrl: '' // 预览图片地址
})
// computed
const fileList = computed(() => {
  if (showFileList.value) {
    return vModel.value?.map((item: DataItem) => {
      item.name = item.filenameOriginal
      return item
    }) as UploadUserFile[]
  } else {
    return []
  }
})
const showFileList = computed(() => {
  const list: UploadType[] = ['file-list', 'picture-card']
  return list.includes(props.type)
})
// file change
async function onChange(row: UploadFile) {
  if (props.type === 'single-image') {
    state.imageUrl = URL.createObjectURL(row.raw!)
    const data = await upload(row.raw!)
    if (data) {
      vModel.value = data.filePath + data.filename
    }
  }
}
// 文件超出限制
function onExceed(files: File[]) {
  if (props.type === 'single-image') {
    uploadRef.value!.clearFiles()
    const file = files[0] as UploadRawFile
    file.uid = genFileId()
    uploadRef.value!.handleStart(file)
    return
  }
  const count = fileList.value.length + files.length
  if (props.limit && count > props.limit) {
    ElMessage.warning(t('limitTips'))
  }
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
  const requestConfig = {
    url: 'fs/upload',
    body: formData,
    method: 'POST'
  } as RequestConfig
  const { data } = await shiki.request(requestConfig)
  return data as DataItem
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
