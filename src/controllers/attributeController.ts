import { Request, Response, NextFunction } from 'express'
import { Attribute, AttributeValue } from '../models'
import { CreateError } from '../services/errorService'

export const getAttrs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const attrs = await Attribute.findAll({
      include: { model: AttributeValue }
    })
    res.status(200).json(attrs)
  } catch(e) {
    next(CreateError.internal(e.message))
  }
}

interface CreateAttr {
  name: string
  slug: string
  values?: [{ name: string, slug?: string }]
}

export const createAttr = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, slug, values = [] } = req.body as CreateAttr

    const attr = await Attribute.create({ name, slug })
    if (values.length) {
      values.forEach(async v => {
        await AttributeValue.create({ name: v.name, slug: v.slug, attributeId: attr.id })
      })
    }

    res.status(200).json(attr)
  } catch(e) {
    next(CreateError.internal(e.message))
  }
}

export const deleteAttr = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params

    await Attribute.destroy({ where: { id } })
    await AttributeValue.destroy({ where: { attributeId: id } })

    res.status(200).json({ message: 'Attribute Deleted' })
  } catch(e) {
    next(CreateError.internal(e.message))
  }
}

export const deleteAttrValue = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params

    await AttributeValue.destroy({ where: { id } })

    res.status(200).json({ message: 'Attribute Value Deleted' })
  } catch(e) {
    next(CreateError.internal(e.message))
  }
}