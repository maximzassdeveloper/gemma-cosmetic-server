import { NextFunction, Request, Response } from 'express'
import { Category, File, Product, AttributeValue, Comment, Attribute, ProductCategory, ProductAttribute } from '../models'
import { CreateError } from '../services/errorService'
import { IRequest } from '../types'
import dotenv from 'dotenv'
import { ProductCreateData } from '../types/product'
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
    include: includeArr,
    order: [
      ['index', 'ASC']
    ]
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
          as: 'attrs',
          include: [{
            model: Attribute,
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
    const { name, slug, price, images = [], categories = [], attrs = [], tags = [], metaTitle = '', metaDesc = '', metaKeywords = '', metaRobots = '', desc = '' } = req.body as ProductCreateData

    const index = 0
    await Product.findAll().then(products => {
      products.forEach(async (product) => {
        await product.update({ index: product.index+1 })
      })
    })

    const newProduct = await Product.create({ name, slug, price, index, desc, tags, metaTitle, metaDesc, metaKeywords, metaRobots })
    if (!newProduct) return next(CreateError.badRequest('Product creation failed '))

    // Create categories 
    categories?.forEach(async catName => {
      try {
        const cat = await Category.findOne({ where: { name: catName } })
        if (!cat) return
  
        await ProductCategory.create({ categoryId: cat.id, productId: newProduct.id })
      } catch(e) {
        console.log(e)
      }
    })

    // Create attributes
    attrs?.forEach(async attrId => { 
      try {
        await ProductAttribute.create({ 
          attributeValueId: attrId, 
          productId: newProduct.id 
        })
      } catch(e) {
        console.log(e)
      }
    })

    // Update images
    images.forEach(async url => {
      const image = await File.findOne({ where: { url } })
      if (!image) return
      await image.update({ productId: newProduct.id })
    })

    res.status(201).json(newProduct)
  } catch(e) {
    next(CreateError.internal(e.message || 'Creating Product Failed'))
  }
}

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params

    const product = await Product.findByPk(id)
    if (!product) return next(CreateError.badRequest('Product Not Found'))

    await Product.destroy({ where: { id } })

    res.status(200).json({ message: 'Product deleted success' })
  } catch(e) {
    next(CreateError.internal('Delete Product Failed'))
  }
}

export const updateProduct = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const { name, slug, price, index, images = [], categories = [], attrs = [], tags = [], metaTitle = '', metaDesc = '', metaKeywords = '', metaRobots = '', desc = '' } = req.body as ProductCreateData

    const product = await Product.findByPk(id)
    if (!product) return next(CreateError.badRequest('Product not founded '))

    await product.update({ name, slug, price, index, desc, tags, metaTitle, metaDesc, metaKeywords, metaRobots })

    // Create categories   
    categories?.forEach(async catName => {
      try {
        const cat = await Category.findOne({ where: { name: catName } })
        if (!cat) return
  
        await ProductCategory.create({ categoryId: cat.id, productId: id })
      } catch(e) {
        console.log(e)
      }
    })
    const oldCategories = await ProductCategory.findAll({ where: { productId: id } })
    oldCategories.forEach(async i => {
      const cat = await Category.findOne({ where: { id: i.categoryId } })
      if (!cat) return

      if (!categories.includes(cat.name)) {
        await i.destroy()
      }
    })
 
    // Create attributes
    const oldAttrs = await ProductAttribute.findAll({ where: { productId: id } })
    oldAttrs.forEach(async attr => {
      if (!attrs.includes(attr.id)) {
        await ProductAttribute.destroy({ where: { id: attr.id } })
      }
    })
    attrs?.forEach(async attrId => { 
      try {
        await ProductAttribute.create({ 
          attributeValueId: attrId, 
          productId: product.id 
        })
      } catch(e) {
        console.log(e)
      }
    })

    // Update images
    images.forEach(async url => {
      const image = await File.findOne({ where: { url } })
      if (!image) return
      await image.update({ productId: product.id })
    })

    res.status(200).json(product)
  } catch(e) {
    next(CreateError.internal(e.message || 'Updating Product Failed'))
  }
}