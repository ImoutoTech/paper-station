export * from './config'
export * from './user'

export interface Restful<T> {
  code: number
  msg: string
  data: T
}
