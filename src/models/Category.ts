import { DataTypes } from 'sequelize'
import slugify from 'slugify'
import sequelize from '../db'
import { ICategory } from './types'

export const Category = sequelize.define<ICategory>('category', {
  id: { type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
  slug: { type: DataTypes.STRING, unique: true, allowNull: false }
}, {
  hooks: {
    beforeValidate: (category: ICategory) => {
      if (!category.slug) {
        category.slug = slugify(category.name, { lower: true })
      }
    }
  }
})

// Category.addScope('defaultScope', {
//   attributes: {
//     exclude: ['createdAt', 'updatedAt']
//   }
// })