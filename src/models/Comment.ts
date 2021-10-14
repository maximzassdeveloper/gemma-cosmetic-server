import { DataTypes } from 'sequelize'
import { Product } from './Product'
import sequelize from '../db'
import { IComment } from './types'

export const Comment = sequelize.define<IComment>('comment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  message: { type: DataTypes.STRING(1500), allowNull: false },
  rating: { type: DataTypes.INTEGER, allowNull: false },
  videos: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true },
  images: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true }
})

Product.hasMany(Comment)
Comment.belongsTo(Product)

Comment.addScope('defaultScope', {
  include: [{
    model: Product
  }]
})
