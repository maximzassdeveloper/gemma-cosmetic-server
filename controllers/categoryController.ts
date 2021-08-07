import { Request, Response } from 'express'
import { Category } from '../models'
import { IRequest } from '../types/user'

export const getCategories = async (req: Request, res: Response) => {
  const categories = await Category.findAll()

  res.status(200).json({ categories })
}

export const addCategory = async (req: IRequest, res: Response) => {
  const { category } = req.body
  const newCategory = await Category.create({...category})

  res.status(201).json({ category: newCategory })
}

export const deleteCategory = async (req: IRequest, res: Response) => {
  const { id } = req.params
  await Category.destroy({ where: { id } })

  res.status(200).json({ message: 'Category deleted' })
}