import { NextFunction, Response } from 'express'
import { IRequest } from '../types'
import { CreateError } from '../services/errorService'
import { Cart, CartProduct } from '../models'

export const getCart = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const user = req.user
    if (!user) return next(CreateError.unauthorized())

    const cart = await Cart.findOne({ where: { userId: user.id } })
    if (!cart) return next(CreateError.notFound('Cart not found'))

    const products = await CartProduct.findAll({ where: { cartId: cart.id } })
    res.status(200).json(products)
  } catch(e) {
    next(CreateError.interanl(e.message))
  }
}

export const addProduct = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const { name, slug, price, totalPrice, image, count } = req.body

    const user = req.user
    if (!user) return next(CreateError.unauthorized())

    const cart = await Cart.findOne({ where: { userId: user.id } })
    if (!cart) return next(CreateError.badRequest('Cart not found'))

    const newProduct = await CartProduct.create({ name, slug, price, totalPrice, image, count, cartId: cart.id })

    return res.status(200).json(newProduct)
  } catch(e) {
    next(CreateError.interanl(e.message))
  }
}

export const deleteProduct = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    
    const user = req.user
    if (!user) return next(CreateError.unauthorized())

    await CartProduct.destroy({ where: { id } })

    return res.status(200).json({ message: 'Deleted Cart Product' })
  } catch(e) {
    next(CreateError.interanl(e.message))
  }
}

export const updateProduct = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const { count } = req.body
    const { slug } = req.params
    const user = req.user

    const cart = await Cart.findOne({ where: { userId: user?.id } })
    if (!cart) return next(CreateError.badRequest('Cart Not Found'))

    const cartProduct = await CartProduct.findOne({ where: { slug, cartId: cart.id } })
    if (!cartProduct) return next(CreateError.notFound('Cart Product Not Found'))

    const updated = await cartProduct.update({ count, totalPrice: cartProduct.price * count })

    res.status(200).json({ product: updated })
  } catch(e) {
    next(CreateError.interanl(e.message))
  }
}