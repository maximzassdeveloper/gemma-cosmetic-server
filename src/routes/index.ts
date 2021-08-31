import { Application } from 'express'
import userRouter from './userRouter'
import productRouter from './productRouter'
import cartRouter from './cartRouter'
import categoryRouter from './categoryRouter'
import commentRouter from './commentRouter'
import orderRouter from './orderRouter'
import attributeRouter from './attributeRouter'

export const createRoutes = (app: Application) => {
  app.use('/api/users', userRouter)
  app.use('/api/products', productRouter)
  app.use('/api/cart', cartRouter)
  app.use('/api/comments', commentRouter)
  app.use('/api/categories', categoryRouter)
  app.use('/api/orders', orderRouter)
  app.use('/api/attributes', attributeRouter)
}