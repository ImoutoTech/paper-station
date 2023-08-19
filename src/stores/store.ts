import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useMenuStore } from './useMenu'
import { useUserStore } from './useUser'

export const useGlobalStore = defineStore('global', () => {
  const menuStore = useMenuStore()
  const userStore = useUserStore()

  const isLoading = ref(false)

  const setLoading = (val: boolean) => (isLoading.value = val)

  return { menuStore, userStore, isLoading, setLoading }
})
