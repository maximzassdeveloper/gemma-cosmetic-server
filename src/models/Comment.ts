import { DataTypes } from 'sequelize'
import sequelize from '../db'
import { IComment } from './types'

export const Comment = sequelize.define('comment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  message: { type: DataTypes.STRING(1500), allowNull: false },
  rating: { type: DataTypes.INTEGER, allowNull: false }
})

Comment.addScope('defaultScope', {
  attributes: {
    exclude: ['createdAt', 'updatedAt']
  }
})
