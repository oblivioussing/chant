import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { LangEnum, StorageEnum } from '../enum'
import storage from '../utils/storage'

// 语言
const lang = storage.getLocal(StorageEnum.Lang) as LangEnum

export const useAppStore = defineStore('app', () => {
  // state
  const state = reactive({
    lang: lang || LangEnum.Zh // 语言
  })
  return { state }
})
