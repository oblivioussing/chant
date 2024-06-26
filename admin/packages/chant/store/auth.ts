import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { shiki } from '@chant'
import { useUserStore } from './user'

type MenuItem = {
  children?: MenuItem[]
  meta: {
    funs?: string[]
    title?: string
  }
  icon?: string
  id: string
  path: string
  threeMenu?: 0 | 1
}

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
  }
  return { state, getAuth }
})
