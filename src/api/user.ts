import API from './base'

export const getUserData = () => API.get('/user/data')

export const userLogin = (ticket: string) => API.get('/user/login', { params: { ticket } })
