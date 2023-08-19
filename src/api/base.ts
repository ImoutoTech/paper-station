import axios from 'axios'
import { ENV } from '@/utils/env'

const API = axios.create({
  baseURL: ENV.API
})

API.interceptors.request.use((req) => {
  if (localStorage.getItem('PS_TOKEN')) req.headers.Authorization = localStorage.getItem('PS_TOKEN')
  return req
})

export default API
