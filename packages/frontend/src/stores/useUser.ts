import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'

import type { UserData } from '@/types'

export const useUserStore = defineStore('user', () => {
  const isLogin = ref(false)

  const loginLoading = ref(false)

  const userInfo = reactive({
    avatar: '',
    email: '',
    id: 0
  })

  const login = (data: UserData) => {
    userInfo.avatar = data.avatar
    userInfo.email = data.email
    userInfo.id = data.id
    isLogin.value = true
  }

  const logout = () => {
    userInfo.avatar = ''
    userInfo.email = ''
    userInfo.id = 0
    isLogin.value = false
    localStorage.removeItem('PS_TOKEN')
  }

  const setLoading = (val: boolean) => (loginLoading.value = val)

  return { isLogin, login, loginLoading, setLoading, userInfo, logout }
})
