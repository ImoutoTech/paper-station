import API from './base'
import type { SiteItem, Restful, SiteCreateParam, RestfulPage } from '@/types'
import qs from 'qs'

export const getUserSite = (offset: number, limit: number, search?: string) =>
  API.get<RestfulPage<SiteItem>>('/site/', {
    params: {
      offset,
      limit,
      search
    }
  })

export const createSite = (data: SiteCreateParam) => {
  const body = {
    ...data,
    domains: data.domains.join(','),
    configs: data.configs.join(',')
  }

  return API.post<Restful<SiteItem>>('/site/', qs.stringify(body))
}

export const getSite = (id: string) => API.get<Restful<SiteItem>>(`/site/${id}`)

export const updateSite = (id: string, data: SiteCreateParam) => {
  const body = {
    ...data,
    domains: data.domains.join(','),
    configs: data.configs.join(',')
  }

  return API.put<Restful<SiteItem>>(`/site/${id}`, qs.stringify(body))
}

export const delSite = (id: string) => API.delete<Restful<null>>(`/site/${id}`)
