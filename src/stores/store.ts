import { defineStore } from 'pinia'
import { useMenuStore } from './useMenu'
import { useUserStore } from './useUser'

export const useGlobalStore = defineStore('global', () => {
  const menuStore = useMenuStore()
  const userStore = useUserStore()

  return { menuStore, userStore }
})
