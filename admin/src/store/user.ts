import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { StorageEnum } from '../enum'
import { storage } from '../utils'

export type User = {
  id: string
  loginName: string
  name: string
}

const token = storage.getLocal(StorageEnum.Token) || ''
const user: User = storage.getLocal(StorageEnum.User) || {}

export const useUserStore = defineStore('user', () => {
  const state = reactive({
    token,
    user
  })
  return { state }
})
