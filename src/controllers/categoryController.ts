import { NextFunction, Request, Response } from 'express'
import { Category } from '../models'
import { CreateError } from '../services/errorService'
import { IRequest } from '../types'

export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await Category.findAll()
    res.status(200).json(categories)
  } catch(e) {
    next(CreateError.internal(e.message || 'Getting Categories Failed'))
  }
}

export const createCategory = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const { name, slug } = req.body
    const newCategory = await Category.create({ name, slug })
  
    res.status(201).json(newCategory)
  } catch(e) {
    next(CreateError.internal(e.message || 'Creating Category Failed'))
  }
}

export const deleteCategory = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    await Category.destroy({ where: { id } })
  
    res.status(200).json({ message: 'Category deleted' })
  } catch(e) {
    next(CreateError.internal(e.message || 'Deleting Category Failed'))
  }
}

export const updateCategory = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const { name, slug } = req.body
    const { id } = req.params

    const category = await Category.findOne({ where: { id } })
    if (!category) return next(CreateError.notFound('Category Not Found'))

    const updated = await category.update({ name, slug })
    res.status(200).json(updated)
  } catch(e) {
    next(CreateError.internal(e.message || 'Updating Product Failed'))
  }
}