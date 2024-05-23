import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useMenuStore } from './useMenu'
import { useUserStore } from './useUser'
import { useStorageStore } from './useStorage'
import { useMediaQuery } from '@vueuse/core'

export const useGlobalStore = defineStore('global', () => {
  const menuStore = useMenuStore()
  const userStore = useUserStore()
  const storageStore = useStorageStore()

  const isLoading = ref(false)

  const setLoading = (val: boolean) => (isLoading.value = val)

  const isMobile = useMediaQuery('(max-width: 768px)')

  return { menuStore, userStore, storageStore, isLoading, isMobile, setLoading }
})
