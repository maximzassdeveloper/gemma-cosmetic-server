import { NextFunction, Request, Response } from 'express'
import { Category, Product, AttributeValue, Comment, Attribute } from '../models'
import { CreateError } from '../services/errorService'
import { IRequest } from '../types'
import { genereateAttrs, generateCats, generateImages, deleteImages } from '../services/productService'
import dotenv from 'dotenv'
dotenv.config()

export const getProducts = async (req: Request, res: Response) => {
  const { attrs, cats } = req.query

  const includeArr = []
  if (attrs) {
    includeArr.push({
      model: AttributeValue,
      where: { slug: attrs.toString().split(',') }
    })
  }
  if (cats) {
    includeArr.push({
      model: Category,
      where: { slug: cats.toString().split(',') }
    })
  }

  const products = await Product.findAll({
    include: includeArr
  })

  res.status(200).json(products)
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

  res.status(200).json(products)
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
          model: AttributeValue,
          include: [{
            model: Attribute
          }],
          through: { attributes: [] }
        },
        {
          model: Comment,
          as: 'comments'
        }
      ]
    })
    if (!product) return next(CreateError.badRequest('Product not found'))

    res.status(200).json(product)
  } catch(e) {
    next(CreateError.internal(e.message || 'Getting Product Failed'))
  }
}

export const createProduct = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const { name, slug, price, categories, attributes, tags, metaTitle, metaDesc, metaKeywords, metaRobots, desc, shortDesc } = req.body
    let { files } = req

    const images = generateImages(files)

    const newProduct = await Product.create({ name, slug, price, desc, shortDesc, images, metaTitle, metaDesc, metaKeywords, metaRobots, tags: JSON.parse(tags) })

    generateCats(categories.split(','), newProduct.id)
    genereateAttrs(attributes.split(','), newProduct.id)

    res.status(201).json({ newProduct })
  } catch(e) {
    next(CreateError.internal(e.message || 'Creating Product Failed'))
  }
}

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params

    const product = await Product.findByPk(id)
    if (!product) return next(CreateError.badRequest('Product Not Found'))

    deleteImages(product.images)

    await Product.destroy({ where: { id } })

    res.status(200).json({ message: 'Product delete' })
  } catch(e) {
    next(CreateError.internal('Delete Product Failed'))
  }
}

export const updateProduct = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const { name, slug, price, categories = '', attributes = '', metaTitle, metaDesc, metaKeywords, metaRobots, desc, shortDesc, tags } = req.body
    const { id } = req.params
    let { files } = req

    let images = generateImages(files)

    const product = await Product.findOne({ where: { id } })
    if (!product) return next(CreateError.badRequest('Product not found'))

    if (images.length === 0) {
      images = product.images
    }

    generateCats(categories.split(','), product.id)
    genereateAttrs(attributes.split(','), product.id)

    const updatedProduct = await product.update({ name, slug, price, desc, shortDesc, images, metaTitle, metaDesc, metaKeywords, metaRobots, tags: JSON.parse(tags) })

    res.status(200).json({ product: updatedProduct })
  } catch(e) {
    next(CreateError.internal(e.message || 'Updating Product Failed'))
  }
}