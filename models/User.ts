import { DataTypes } from 'sequelize'
import sequelize from '../db'
import { IUser } from './types'

import { Cart } from './Cart'
import { Order } from './Order'
import { Comment } from './Comment'

export const User = sequelize.define<IUser>('user', {
  id: { type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  surname: { type: DataTypes.STRING, allowNull: true },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, defaultValue: 'USER', allowNull: false },
  img: { type: DataTypes.STRING, allowNull: true }
})

User.addScope('defaultScope', {
  attributes: {
    exclude: ['createdAt', 'updatedAt']
  }
})

User.hasOne(Cart)
User.hasMany(Order)
User.hasMany(Comment)