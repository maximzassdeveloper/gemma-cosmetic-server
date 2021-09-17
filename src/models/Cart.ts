import { DataTypes } from 'sequelize'
import sequelize from '../db'
import { ICart, ICartProduct } from './types'

export const Cart = sequelize.define<ICart>('cart', {
  id: { type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true },
})

export const CartProduct = sequelize.define<ICartProduct>('cart_product', {
  id: { type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  slug: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.INTEGER, allowNull: false },
  totalPrice: { type: DataTypes.INTEGER, allowNull: false },
  image: { type: DataTypes.STRING, allowNull: false },
  count: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 }
})

Cart.hasMany(CartProduct, {
  onDelete: 'cascade'
})

CartProduct.addScope('defaultScope', {
  attributes: {
    exclude: ['createdAt', 'updatedAt']
  }
})