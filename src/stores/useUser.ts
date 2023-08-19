import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const isLogin = ref(false)

  const loginLoading = ref(false)

  const userInfo = reactive({
    avatar: '',
    email: '',
    id: ''
  })

  const login = (data: Record<string, string>) => {
    userInfo.avatar = data.avatar
    userInfo.email = data.email
    userInfo.id = data.id
    isLogin.value = true
  }

  const logout = () => {
    userInfo.avatar = ''
    userInfo.email = ''
    userInfo.id = ''
    isLogin.value = false
    localStorage.removeItem('PS_TOKEN')
  }

  const setLoading = (val: boolean) => (loginLoading.value = val)

  return { isLogin, login, loginLoading, setLoading, userInfo, logout }
})
