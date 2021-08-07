import { NextFunction, Request, Response } from 'express'
import { Category, Product, Attribute } from '../models'
import { CreateError } from '../services/errorService'
import { IRequest } from '../types'
import { genereateAttrs, generateCats, generateImages } from '../services/productService'
import dotenv from 'dotenv'
dotenv.config()

export const getProducts = async (req: Request, res: Response) => {
  const products = await Product.findAll({
    include: [{
      model: Category,
      as: 'categories',
      // through: { attributes: [] }
    }]
  })

  res.status(200).json({ products })
}

export const getProductByCategory = async (req: Request, res: Response) => {
  const { id } = req.params

  const products = await Product.findAll({
    include: [{
      model: Category,
      attributes: [ 'id', 'slug', 'name' ],
      where: { id },
      through: { attributes: [] }
    }]
  })

  res.status(200).json({ products })
}

export const getProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params

    const product = await Product.findOne({
      where: { slug },
      include: [
        { 
          model: Category, 
          as: 'categories',
          through: { attributes: [] }
        },
        {
          model: Attribute,
          as: 'attributes',
          through: { attributes: [] }
        }
      ]
    })
    if (!product) return next(CreateError.badRequest('Product not found'))

    res.status(200).json({ product })
  } catch(e) {
    next(CreateError.interanl('Getting Product Failed'))
  }
}

interface CreateProductBody {
  name?: string
  slug?: string
  price?: number
  categories?: string[]
  attributes?: [
    { name: string, value: string }
  ]
  desc?: string
  shortDesc?: string
}

export const createProduct = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const { name, slug, price, categories, attributes, desc, shortDesc } = req.body as CreateProductBody
    let files = req.files?.img
    const images = generateImages(files)

    const newProduct = await Product.create({ name, slug, price, desc, shortDesc, images })

    generateCats(categories, newProduct.id)
    genereateAttrs(attributes, newProduct.id)

    res.status(201).json({ newProduct })
  } catch(e) {
    next(CreateError.interanl('Creating Product Failed'))
  }
}

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    await Product.destroy({ where: { id } })

    res.status(200).json({ message: 'Product delete' })
  } catch(e) {
    next(CreateError.interanl('Delete Product Failed'))
  }
}

export const updateProduct = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const { name, slug, price, categories, attributes, desc, shortDesc } = req.body as CreateProductBody
    const { id } = req.params
    let files = req.files?.img
    const images = generateImages(files)

    const product = await Product.findOne({ where: { id } })
    if (!product) return next(CreateError.badRequest('Product not found'))

    generateCats(categories, product.id)
    genereateAttrs(attributes, product.id)

    const updatedProduct = await product.update({ name, slug, price, desc, shortDesc, images })

    res.status(200).json({ product: updatedProduct })
  } catch(e) {
    next(CreateError.interanl('Updating Product Failed'))
  }
}