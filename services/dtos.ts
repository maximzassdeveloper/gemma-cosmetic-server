import { IUser } from '../models/types'
import { IUserDto, IUserPayload } from '../types/user'

export class UserDto implements IUserDto {
  id
  name
  surname
  email
  role
  img
  constructor(user: IUser) {
    this.id = user.id
    this.email = user.email
    this.role = user.role
    this.name = user.name
    this.surname = user.surname
    this.img = user.img
  }
}

export class UserPayloadDto implements IUserPayload {
  id
  role
  constructor(user: IUser) {
    this.id = user.id
    this.role = user.role
  }
}