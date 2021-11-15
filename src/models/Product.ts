import { DataTypes } from 'sequelize'
import slugify from 'slugify'
import sequelize from '../db'
import { IProduct, IProductCategory, IProductAttribute } from './types'

import { Category } from './Category'
import { AttributeValue } from './Attribute'
import { File } from './File'

export const Product = sequelize.define<IProduct>('product', {
  id: { type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  slug: { type: DataTypes.STRING, unique: true, allowNull: false },
  price: { type: DataTypes.INTEGER, allowNull: false },
  shortDesc: { type: DataTypes.STRING(400), allowNull: true },
  desc: { type: DataTypes.STRING(5000), allowNull: true },
  // images: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false },
  metaDesc: { type: DataTypes.STRING(500), allowNull: true },
  metaTitle: { type: DataTypes.STRING(300), allowNull: true },
  metaKeywords: { type: DataTypes.STRING, allowNull: true },
  metaRobots: { type: DataTypes.STRING, allowNull: true }, 
  tags: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true }
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

export const ProductAttribute = sequelize.define<IProductAttribute>('product_attribute', {
  id: { type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true }
})

Product.addScope('defaultScope', {
  include: [{
    model: File,
    as: 'images'
  }]
})

Product.hasMany(File, {
  onDelete: 'cascade',
  as: 'images'
}) 

Product.belongsToMany(Category, {
  through: ProductCategory,
})

Product.belongsToMany(AttributeValue, {
  as: 'attrs',
  through: ProductAttribute,
})

export default Product