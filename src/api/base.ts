import axios from 'axios'
import { ENV } from '@/utils/env'
import { MessagePlugin } from 'tdesign-vue-next'

const API = axios.create({
  baseURL: ENV.API
})

API.interceptors.request.use((req) => {
  if (localStorage.getItem('PS_TOKEN')) req.headers.Authorization = localStorage.getItem('PS_TOKEN')
  return req
})

API.interceptors.response.use(
  (config) => config,
  (config) => {
    if (config.response.data.msg === 'jwt expired') {
      localStorage.removeItem('PS_TOKEN')
      MessagePlugin.error('登录态已失效，即将刷新页面')
      setTimeout(() => {
        window.location.reload()
      }, 3000)
    }

    return config.response
  }
)

export default API
