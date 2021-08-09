import { Attribute, AttributeValue, ProductAttribute, Category, ProductCategory, Comment } from '../models'
import slugify from 'slugify'
import fileUpload from 'express-fileupload'
import path from 'path'
import { v4 } from 'uuid'

export const generateName = (name: string): string => {
  const p = name.split('.')
  return v4() + '.' + p[p.length-1]
}

interface Attr {
  name: string
  value: string
}

export const genereateAttrs = (attributes: Attr[] = [], productId: number) => {
  attributes.forEach(async (attr) => {
    const [newAttr] = await Attribute.findOrCreate({ 
      where: { name: attr.name },
      defaults: { slug: slugify(attr.name, { lower: true }) } 
    })
    await AttributeValue.findOrCreate({ 
      where: { name: attr.value },
      defaults: { 
        slug: slugify(attr.value, { lower: true }),
        attributeId: newAttr.id
      } 
    })
    await ProductAttribute.create({ productId, attributeId: newAttr.id })
  })
}

export const generateCats = (categories: string[] = [], productId: number) => {
  categories.forEach(async (catName: string) => {
    const [cat] = await Category.findOrCreate({ 
      where: { name: catName },
      defaults: { slug: slugify(catName, { lower: true }) } 
    })
    await ProductCategory.create({ productId, categoryId: cat.id })
  })
}

type Files = fileUpload.UploadedFile | fileUpload.UploadedFile[] | undefined

export const generateImages = (files: Files): string[] => {
  const images: string[] = []
  if (!files) return images

  if (!Array.isArray(files)) files = [files]
  files.forEach(img => {
    const fileName = generateName(img.name)
    img.mv(path.resolve(__dirname, '..', 'static', fileName))
    images.push(process.env.SERVER_URL + '/' + fileName)
  })

  return images
}