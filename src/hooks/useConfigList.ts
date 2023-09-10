import { ref } from 'vue'
import { type ConfigItem } from '@/types'
import { getUserConfig } from '@/api/config'

export const useConfigList = () => {
  const configList = ref<ConfigItem[]>([])
  const configLoading = ref(false)

  const refreshConfigList = async () => {
    configLoading.value = true
    const res = await getUserConfig()
    configList.value = res?.data?.data
    configLoading.value = false
    return res
  }

  return {
    configList,
    configLoading,
    refreshConfigList
  }
}
