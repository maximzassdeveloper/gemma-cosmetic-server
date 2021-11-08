import { DataTypes } from 'sequelize'
import sequelize from '../db'
import { IFile } from './types'

export const File = sequelize.define<IFile>('file', {
  id: { type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true },
  url: { type: DataTypes.STRING, unique: true, allowNull: false },
  type: { type: DataTypes.STRING, allowNull: false }
})