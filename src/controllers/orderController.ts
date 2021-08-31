import { Request, Response, NextFunction } from 'express'
import { Order, OrderProduct } from '../models'
import { ICartProduct, IOrder } from '../models/types'
import { CreateError } from '../services/errorService'
import { IRequest } from '../types'

export const getOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user } = req.query
    let orders: IOrder[] = []
    if (user) {
      orders = await Order.findAll({ where: { userId: user } })
    } else {
      orders = await Order.findAll()
    }

    res.status(200).json(orders)
  } catch(e) {
    next(CreateError.interanl(e.message || 'Getting Orders Failed'))
  }
}

export const createOrder = async (req: IRequest, res: Response, next: NextFunction) => {
  try { 
    const { products } = req.body as { products: ICartProduct[] } 
    const { user } = req
    if (!user) return next(CreateError.unauthorized())

    const order = await Order.create({ userId: user.id })
    products.forEach(async ({ name, slug, price, totalPrice, image, count }) => {
      await OrderProduct.create({ name, slug, price, totalPrice, image, count, orderId: order.id })
    })
    
    const foundedOrder = await Order.findByPk(order.id)
    res.status(200).json(foundedOrder)

  } catch(e) {
    next(CreateError.interanl(e.message || 'Creating Order Failed'))
  }
}

export const deleteOrder = async (req: IRequest, res: Response, next: NextFunction) => {
  try { 
    const { id } = req.params
    await Order.destroy({ where: { id } })
    res.status(200).json({ message: 'Order Deleted' })    
  } catch(e) {
    next(CreateError.interanl(e.message || 'Deleting Order Failed'))
  }
}

export const updateOrder = async (req: IRequest, res: Response, next: NextFunction) => {
  try { 
    const { status, products = [] } = req.body as { status: string, products: ICartProduct[] } 
    const { id } = req.params

    const order = await Order.findOne({ where: { id } })
    if (!order) return next(CreateError.badRequest('Order Not Found'))
    
    await order.update({ status })
    products.forEach(async ({ name, slug, price, totalPrice, image, count }) => {
      await OrderProduct.findOrCreate({
        where: { slug, orderId: order.id },
        defaults: { name, slug, price, totalPrice, image, count, orderId: order.id }
      })
    })

    const foundedOrder = await Order.findByPk(order.id)
    res.status(200).json(foundedOrder)

  } catch(e) {
    next(CreateError.interanl(e.message || 'Deleting Order Failed'))
  }
}