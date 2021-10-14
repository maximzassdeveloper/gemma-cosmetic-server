import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import fileUpload from 'express-fileupload'
import path from 'path'

import sequelize from './db'
import { createRoutes } from './routes'
import { errorHandler } from './middlewares/errorMiddleware'

import dotenv from 'dotenv'
dotenv.config()

const app = express()

console.log('test1')

app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL
}))
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload({}))
app.use(cookieParser())
createRoutes(app)
app.use(errorHandler)

const start = async () => {
  try {
    await sequelize.authenticate()
    await sequelize.sync({ alter: true })

    const PORT = process.env.PORT || 5000
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
  } catch(e) {
    console.error(`Connection to PostgreSQL failed ${e}`)
  }
}

start()

