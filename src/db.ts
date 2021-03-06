import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'
dotenv.config()

export default new Sequelize({
  database: process.env.POSTGRES_DB,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT) || 5432,
  dialect: 'postgres'
})
