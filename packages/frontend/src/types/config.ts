export interface ConfigBaseContent {
  slug: string
  name: string
  data: string
}

export interface ConfigItem extends ConfigBaseContent {
  _id: string
  updated_at: string
  owner: number
  created_at: string
}

export type ConfigCreateParam = ConfigBaseContent
