export interface SiteBaseContent {
  domains: string[]
  configs: string[]
  name: string
}

export interface SiteItem extends SiteBaseContent {
  id: number
  updated_at: string
  owner: number
  created_at: string
}

export type SiteCreateParam = SiteBaseContent
