import { Model } from 'sequelize'

export type UserRoles = 'USER' | 'ADMIN'
export type OrderStatus = 'Товар собирается' | 'Товар доставляется' | 'Товар доставлен'

// Users
export interface IUser extends Model {
  id: number
  name: string
  surname?: string
  fullName: string
  email: string
  phone?: string
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
  status: OrderStatus
  comment?: string
  userId?: number
}

export interface IOrderProduct extends Model {
  id: number
  name: string
  slug: string
  price: number
  totalPrice: number
  count: number
  image: string
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
  categoryId?: number
  productId?: number
}

export interface IProductAttribute extends Model {
  id: number
  attributeValueId?: number
  productId?: number
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