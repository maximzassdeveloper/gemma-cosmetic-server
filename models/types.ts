import { Model } from 'sequelize'

export type UserRoles = 'USER' | 'ADMIN'

// Users
export interface IUser extends Model {
  id: number
  name: string
  surname?: string
  email: string
  password: string
  role: UserRoles
  desc?: string
  img?: string
}

export interface ICart extends Model {
  id: number
}

export interface ICartProduct extends Model {
  id: number
  name: string
  slug: string
  price: number
  totalPrice: number
  count: number
  image: string
  cartId?: number
}

export interface IOrder extends Model {
  id: number
}

// Products
export interface IProduct extends Model {
  id: number
  name: string
  slug: string
  price: number
  shortDesc?: string
  desc?: string
  images: string[]
}

export interface ICategory extends Model {
  id: number
  name: string
  slug: string
}

export interface IProductCategory extends Model {
  id: number
}

export interface IAttribute extends Model {
  id: number
  name: string
  slug: string
}

export interface IAttributeValue extends Model {
  id: number
  name: string
  slug: string
}

export interface IComment extends Model {
  id: number
  name: string
  message: string
  rating: number
}