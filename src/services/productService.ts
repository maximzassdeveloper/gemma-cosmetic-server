import { Attribute, AttributeValue, ProductAttribute, Category, ProductCategory, Comment } from '../models'
import slugify from 'slugify'
import fileUpload from 'express-fileupload'
import path from 'path'
import fs from 'fs'
import { v4 } from 'uuid'

export const generateName = (name: string): string => {
  const p = name.split('.')
  return v4() + '.' + p[p.length-1]
}

export const genereateAttrs = async (attributes: string[] = [], productId: number) => {
  const oldAttrs = await ProductAttribute.findAll({ where: { productId } })
  oldAttrs.forEach(async x => {
    try {
      if (!attributes.includes(x.attributeValueId?.toString() || '')) {
        await ProductAttribute.destroy({ where: { id: x.id } })
      }
    } catch {}
  })

  attributes.forEach(async attr => {
    try {
      await ProductAttribute.findOrCreate({
        where: { attributeValueId: Number(attr), productId }
      })
    } catch {}
  })
}

export const generateCats = async (categories: string[] = [], productId: number) => {
  if (categories.length === 0) return

  categories.forEach(async (catName: string) => {
    if (catName === '') return
    const [cat] = await Category.findOrCreate({ 
      where: { name: catName },
      defaults: { slug: slugify(catName, { lower: true }) } 
    })
    await ProductCategory.findOrCreate({
      where: { categoryId: cat.id, productId },
    })
  })

  const oldCategories = await ProductCategory.findAll({ where: { productId } })
  oldCategories.forEach(async i => {
    const cat = await Category.findOne({ where: { id: i.categoryId } })
    if (!cat) return

    if (!categories.includes(cat.name)) {
      await i.destroy()
    }
  })
}

export const generateImages = (files: fileUpload.FileArray | undefined): string[] => {
  const images: string[] = []
  if (!files) return images

  Object.values(files).forEach(img => {
    if (!Array.isArray(img)) {
      const fileName = generateName(img.name)
      img.mv(path.resolve(__dirname, '..', 'static', fileName))
      images.push(process.env.SERVER_URL + '/' + fileName)
    }
  })
  return images
}

export const deleteImages = (files: string[] = []) => {
  files.forEach(file => {
    try {
      const fileName = file.split(`${process.env.SERVER_URL}/`)[1]
      fs.unlink(path.resolve(__dirname, '..', 'static', fileName), e => console.log(e))
    } catch(e) {
      console.log(e)
    }
  })
}