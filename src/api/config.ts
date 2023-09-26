import API from './base'
import type { ConfigItem, Restful, ConfigCreateParam } from '@/types'
import qs from 'qs'

export const getUserConfig = () => API.get<Restful<ConfigItem[]>>('/config/')

export const createConfig = (data: ConfigCreateParam) =>
  API.post<Restful<ConfigItem>>('/config/', qs.stringify(data))
