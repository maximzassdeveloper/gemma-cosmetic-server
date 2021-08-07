import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'
dotenv.config()

export default new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  dialect: 'postgres'
})