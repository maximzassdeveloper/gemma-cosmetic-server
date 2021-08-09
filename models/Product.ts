import { DataTypes } from 'sequelize'
import slugify from 'slugify'
import sequelize from '../db'
import { IProduct, IProductCategory } from './types'

import { Category } from './Category'
import { Attribute } from './Attribute'
import { Comment } from './Comment'

export const Product = sequelize.define<IProduct>('product', {
  id: { type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  slug: { type: DataTypes.STRING, unique: true, allowNull: false },
  price: { type: DataTypes.INTEGER, allowNull: false },
  shortDesc: { type: DataTypes.STRING, allowNull: true },
  desc: { type: DataTypes.STRING, allowNull: true },
  images: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false }
}, {
  hooks: {
    beforeValidate: (product: IProduct) => {
      if (!product.slug) {
        product.slug = slugify(product.name, { lower: true })
      }
    }
  }
})

export const ProductCategory = sequelize.define<IProductCategory>('product_category', {
  id: { type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true }
})

export const ProductAttribute = sequelize.define<IProductCategory>('product_attribute', {
  id: { type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true }
})


Product.addScope('defaultScope', {
  attributes: {
    exclude: ['createdAt', 'updatedAt']
  }
})

Product.belongsToMany(Category, {
  through: ProductCategory,
})

Product.belongsToMany(Attribute, {
  through: ProductAttribute,
})

Product.hasMany(Comment)

export default Product