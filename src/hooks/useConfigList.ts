import { ref } from 'vue'
import { type ConfigItem } from '@/types'
import { getUserConfig } from '@/api/config'

export const useConfigList = () => {
  const configList = ref<ConfigItem[]>([])

  const refreshConfigList = async () => {
    const res = await getUserConfig()
    configList.value = res?.data?.data
    return res
  }

  return {
    configList,
    refreshConfigList
  }
}
