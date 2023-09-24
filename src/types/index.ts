export * from './config'
export * from './user'
export * from './editor'

export interface Restful<T> {
  code: number
  msg: string
  data: T
}
