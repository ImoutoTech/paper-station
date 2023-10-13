import { ref, reactive } from 'vue'
import { type ConfigItem } from '@/types'
import { getUserConfig } from '@/api/config'
import type { PageInfo } from 'tdesign-vue-next'

export const useConfigList = () => {
  const configList = ref<ConfigItem[]>([])
  const configLoading = ref(false)
  const configSearchText = ref('')
  const configPagination = reactive({
    total: 0,
    current: 1,
    size: 10
  })

  const refreshConfigList = async () => {
    configLoading.value = true
    const res = await getUserConfig(
      (configPagination.current - 1) * configPagination.size,
      configPagination.size,
      configSearchText.value
    )
    configList.value = res?.data?.data?.items || []
    configPagination.total = res?.data?.data?.total ?? 0
    configLoading.value = false
    return res
  }

  const onPageChange = (pagination: PageInfo) => {
    configPagination.size = pagination.pageSize
    configPagination.current = pagination.current
    refreshConfigList()
  }

  const handleSearch = () => {
    configPagination.current = 1
    refreshConfigList()
  }

  return {
    configList,
    configPagination,
    configLoading,
    configSearchText,
    refreshConfigList,
    onPageChange,
    handleSearch
  }
}
