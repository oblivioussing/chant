import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { shiki } from '../api'
import factory from '../router/factory'
import type { MenuItem } from '../type'
import { useUserStore } from './user'

export const useAuthStore = defineStore('menu', () => {
  // state
  const state = reactive({
    menu: [] as MenuItem[]
  })
  // 获取权限
  async function getAuth() {
    const userStore = useUserStore()
    if (!userStore.state.token) {
      return
    }
    const { data } = await shiki.get('user/auth')
    if (data) {
      state.menu = data.menu || []
    }
    // 构建路由
    factory()
  }
  return { state, getAuth }
})
