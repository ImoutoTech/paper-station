import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useMenuStore = defineStore('menu', () => {
  const value = ref('/')

  const setMenuValue = (val: string) => (value.value = val)

  return { value, setMenuValue }
})
