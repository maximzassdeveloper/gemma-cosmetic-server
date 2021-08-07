import { DataTypes } from 'sequelize'
import sequelize from '../db'
import { IOrder } from './types'

export const Order = sequelize.define<IOrder>('order', {
  id: { type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true }
})