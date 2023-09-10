import API from './base'
import type { Restful, UserData, LoginData } from '@/types'

export const getUserData = () => API.get<Restful<UserData>>('/user/data')

export const userLogin = (ticket: string) =>
  API.get<Restful<LoginData>>('/user/login', { params: { ticket } })
