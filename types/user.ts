import { UserRoles } from '../models/types'

export interface IUserPayload {
  id: number
  role: UserRoles
}

export interface IUserDto {
  id: number
  name: string
  surname?: string
  email: string
  role: UserRoles
  img?: string
}