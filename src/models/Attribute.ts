import { DataTypes } from 'sequelize'
import sequelize from '../db'
import slugify from 'slugify'
import { IAttribute, IAttributeValue } from './types'

export const Attribute = sequelize.define<IAttribute>('attribute', {
  id: { type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
  slug: { type: DataTypes.STRING, unique: true, allowNull: false }
}, {
  hooks: {
    beforeValidate: (attr: IAttribute) => {
      if (!attr.slug) {
        attr.slug = slugify(attr.name, { lower: true })
      }
    }
  }
})

export const AttributeValue = sequelize.define<IAttributeValue>('attribute_value', {
  id: { type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true,  allowNull: false },
  slug: { type: DataTypes.STRING, unique: true, allowNull: false }
}, {
  hooks: {
    beforeValidate: (attr: IAttributeValue) => {
      if (!attr.slug) {
        attr.slug = slugify(attr.name, { lower: true })
      }
    }
  }
})

Attribute.addScope('defaultScope', {
  // include: [{
  //   model: AttributeValue,
  // }]
})

// AttributeValue.addScope('defaultScope', {
//   attributes: {
//     exclude: ['createdAt', 'updatedAt']
//   }
// })

Attribute.hasMany(AttributeValue, {
  onDelete: 'cascade'
})
AttributeValue.belongsTo(Attribute)