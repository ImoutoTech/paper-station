import { ref, reactive } from 'vue'
import { toast } from 'vue-sonner'
import { type ConfigItem, type PaginationChange } from '@/types'
import { getUserConfig, delConfig } from '@/api/config'

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

  const onPageChange = (pagination: PaginationChange) => {
    configPagination.size = pagination.pageSize
    configPagination.current = pagination.current
    refreshConfigList()
  }

  const handleSearch = () => {
    configPagination.current = 1
    refreshConfigList()
  }

  const handleDelete = (slug: string) => {
    delConfig(slug)
      .then((res) => {
        if (res.data.code !== 0) {
          throw new Error(res.data.msg)
        }
        toast.success('删除成功')
        refreshConfigList()
      })
      .catch((e) => {
        toast.error(e.message)
      })
  }

  return {
    configList,
    configPagination,
    configLoading,
    configSearchText,
    refreshConfigList,
    onPageChange,
    handleSearch,
    handleDelete
  }
}
