import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useMenuStore } from './useMenu'
import { useUserStore } from './useUser'
import { useStorageStore } from './useStorage'

export const useGlobalStore = defineStore('global', () => {
  const menuStore = useMenuStore()
  const userStore = useUserStore()
  const storageStore = useStorageStore()

  const isLoading = ref(false)

  const setLoading = (val: boolean) => (isLoading.value = val)

  return { menuStore, userStore, storageStore, isLoading, setLoading }
})
