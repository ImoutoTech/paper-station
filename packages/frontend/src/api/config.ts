import API from './base'
import type { ConfigItem, Restful, ConfigCreateParam, RestfulPage } from '@/types'
import qs from 'qs'

export const getUserConfig = (offset: number, limit: number, search?: string) =>
  API.get<RestfulPage<ConfigItem>>('/config/', {
    params: {
      offset,
      limit,
      search
    }
  })

export const createConfig = (data: ConfigCreateParam) =>
  API.post<Restful<ConfigItem>>('/config/', qs.stringify(data))

export const getConfig = (slug: string) => API.get<Restful<ConfigItem>>(`/config/${slug}`)

export const updateConfig = (slug: string, data: ConfigCreateParam) =>
  API.put<Restful<ConfigItem>>(`/config/${slug}`, qs.stringify(data))

export const delConfig = (slug: string) => API.delete<Restful<null>>(`/config/${slug}`)

export const readConfig = (slug: string) => API.get(`/config/get`, { params: { slug } })
