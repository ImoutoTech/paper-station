import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', () => {
  const meta = reactive({
    name: '',
    slug: ''
  })

  const content = ref('')

  const getConfigData = () => ({
    ...meta,
    content
  })

  const updateContent = (str: string) => (content.value = str)

  const updateName = (str: string) => (meta.name = str)

  const updateSlug = (str: string) => (meta.slug = str)

  const updateMeta = (name: string, slug: string) => {
    meta.name = name
    meta.slug = slug
  }

  return { meta, content, getConfigData, updateContent, updateMeta, updateName, updateSlug }
})
