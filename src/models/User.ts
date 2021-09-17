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
  fullName: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, defaultValue: 'USER', allowNull: false },
  img: { type: DataTypes.STRING, allowNull: true }
}, {
  hooks: {
    beforeUpdate: (user: IUser) => {
      user.fullName = `${user.name} ${user.surname || ''}`.trim()
    },
    beforeValidate: (user: IUser) => {
      if (!user.fullName) {
        user.fullName = `${user.name} ${user.surname || ''}`.trim()
      }
    }
  }
})

User.addScope('defaultScope', {
  attributes: {
    exclude: ['createdAt', 'updatedAt']
  }
})

User.hasOne(Cart, {
  onDelete: 'cascade'
})
// User.hasMany(Order)
User.hasMany(Comment)