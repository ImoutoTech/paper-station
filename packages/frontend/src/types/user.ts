export interface UserData {
  avatar: string
  created_at: string
  email: string
  id: number
  _id: string
}

export interface LoginData {
  token: string
  user: UserData
}
