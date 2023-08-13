import { defineStore } from 'pinia'
import { useMenuStore } from './useMenu'

export const useGlobalStore = defineStore('global', () => {
  const menuStore = useMenuStore()

  return { menuStore }
})
