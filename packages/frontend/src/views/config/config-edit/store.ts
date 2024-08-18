import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', () => {
  const meta = reactive({
    name: '',
    slug: ''
  })

  const content = ref('')

  const validate = ref(true)

  const loading = ref(false)

  const getConfigData = () => ({
    ...meta,
    data: content.value
  })

  const updateContent = (str: string) => (content.value = str)

  const updateName = (str: string) => (meta.name = str)

  const updateSlug = (str: string) => (meta.slug = str)

  const updateMeta = (name: string, slug: string) => {
    meta.name = name
    meta.slug = slug
  }

  const setLoading = (v: boolean) => (loading.value = v)

  const setValidate = (v: boolean) => (validate.value = v)

  const clear = () => {
    meta.name = ''
    meta.slug = ''
    content.value = ''
    setValidate(true)
  }

  return {
    meta,
    content,
    loading,
    validate,
    getConfigData,
    updateContent,
    updateMeta,
    updateName,
    updateSlug,
    setLoading,
    clear,
    setValidate
  }
})
