export * from './config'
export * from './user'
export * from './editor'
export * from './site'

export interface Restful<T> {
  code: number
  msg: string
  data: T
}

export interface PageList<T> {
  total: number
  items: T[]
}

export type RestfulPage<T> = Restful<PageList<T>>
