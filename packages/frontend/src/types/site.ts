export interface SiteBaseContent {
  domains: string[]
  configs: string[]
  name: string
}

export interface SiteItem extends SiteBaseContent {
  _id: string
  updated_at: string
  owner: number
  created_at: string
}

export type SiteCreateParam = SiteBaseContent
