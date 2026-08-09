import API from './base'
import type { Restful, UserData } from '@/types'

export const getUserData = () => API.get<Restful<UserData>>('/user/data')

export const userLogout = () => API.post('/user/logout')
