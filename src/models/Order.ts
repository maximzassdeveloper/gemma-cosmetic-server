import { DataTypes } from 'sequelize'
import { User } from './User'
import sequelize from '../db'
import { IOrder, IOrderProduct } from './types'

export const Order = sequelize.define<IOrder>('order', {
  id: { type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true },
  status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'Товар собирается' },
  comment: { type: DataTypes.STRING, allowNull: true }
})

export const OrderProduct= sequelize.define<IOrderProduct>('order_product', {
  id: { type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  slug: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.INTEGER, allowNull: false },
  totalPrice: { type: DataTypes.INTEGER, allowNull: false },
  image: { type: DataTypes.STRING, allowNull: false },
  count: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 } 
})

Order.hasMany(OrderProduct, {
  onDelete: 'cascade'
})

Order.addScope('defaultScope', {
  attributes: {
    exclude: ['createdAt', 'updatedAt']
  },
  include: [{
    model: OrderProduct
  }, {
    model: User
  }]
})

OrderProduct.addScope('defaultScope', {
  attributes: {
    exclude: ['createdAt', 'updatedAt']
  }
})

Order.belongsTo(User)