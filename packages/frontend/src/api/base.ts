import axios from 'axios'
import { ENV } from '@/utils/env'

let csrfToken = ''

const API = axios.create({
  baseURL: ENV.API,
  withCredentials: true
})

API.interceptors.request.use((req) => {
  if (csrfToken && !['get', 'head', 'options'].includes(req.method || 'get')) {
    req.headers['X-CSRF-Token'] = csrfToken
  }
  return req
})

API.interceptors.response.use(
  (response) => {
    const nextCsrfToken = response.headers['x-csrf-token']
    if (typeof nextCsrfToken === 'string') csrfToken = nextCsrfToken
    return response
  },
  (config) => {
    return Promise.reject(config)
  }
)

export default API
