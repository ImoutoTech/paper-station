import API from './base'
import type { ConfigItem, Restful } from '@/types'

export const getUserConfig = () => API.get<Restful<ConfigItem[]>>('/config/')
