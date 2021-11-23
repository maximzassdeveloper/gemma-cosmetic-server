import { DataTypes } from 'sequelize'
import { Product } from './Product'
import { File } from './File'
import sequelize from '../db'
import { IComment } from './types'

export const Comment = sequelize.define<IComment>('comment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  message: { type: DataTypes.STRING(1500), allowNull: false },
  rating: { type: DataTypes.INTEGER, allowNull: false },
})

Product.hasMany(Comment)
Comment.belongsTo(Product)

Comment.hasMany(File)

Comment.addScope('defaultScope', {
  include: [{
    model: Product
  }, {
    model: File
  }]
})
