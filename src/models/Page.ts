import { DataTypes } from 'sequelize'
import slugify from 'slugify'
import sequelize from '../db'
import { IPage } from './types'

export const Page = sequelize.define<IPage>('page', {
  id: { type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  slug: { type: DataTypes.STRING, unique: true, allowNull: false },
  body: { type: DataTypes.STRING(5000), allowNull: false },
  metaDesc: { type: DataTypes.STRING(500), allowNull: true },
  metaTitle: { type: DataTypes.STRING(300), allowNull: true },
  metaKeywords: { type: DataTypes.STRING, allowNull: true },
  metaRobots: { type: DataTypes.STRING, allowNull: true },
  tags: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true }
}, {
  hooks: {
    beforeValidate: (page: IPage) => {
      if (!page.slug) {
        page.slug = slugify(page.name, { lower: true })
      }
      if (!page.metaTitle) {
        page.metaTitle = page.name
      }
    }
  }
})