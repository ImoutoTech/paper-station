import { ref, reactive } from 'vue'
import { type SiteItem } from '@/types'
import { getUserSite, delSite } from '@/api/site'
import { MessagePlugin, type PageInfo } from 'tdesign-vue-next'

export const useSiteList = () => {
  const siteList = ref<SiteItem[]>([])
  const siteLoading = ref(false)
  const siteSearchText = ref('')
  const sitePagination = reactive({
    total: 0,
    current: 1,
    size: 10
  })

  const refreshSiteList = async () => {
    siteLoading.value = true
    const res = await getUserSite(
      (sitePagination.current - 1) * sitePagination.size,
      sitePagination.size,
      siteSearchText.value
    )
    siteList.value = res?.data?.data?.items || []
    sitePagination.total = res?.data?.data?.total ?? 0
    siteLoading.value = false
    return res
  }

  const onPageChange = (pagination: PageInfo) => {
    sitePagination.size = pagination.pageSize
    sitePagination.current = pagination.current
    refreshSiteList()
  }

  const handleSearch = () => {
    sitePagination.current = 1
    refreshSiteList()
  }

  const handleDelete = (id: number) => {
    delSite(id)
      .then((res) => {
        if (res.data.code !== 0) {
          throw new Error(res.data.msg)
        }
        MessagePlugin.success('删除成功')
        refreshSiteList()
      })
      .catch((e) => {
        MessagePlugin.error(e.message)
      })
  }

  return {
    siteList,
    sitePagination,
    siteLoading,
    siteSearchText,
    refreshSiteList,
    onPageChange,
    handleSearch,
    handleDelete
  }
}
