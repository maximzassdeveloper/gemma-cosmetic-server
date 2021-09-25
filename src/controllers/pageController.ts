import { Request, Response, NextFunction } from 'express'
import { Page } from '../models'
import { CreateError } from '../services/errorService'

export const getPages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const pages = await Page.findAll()

    res.status(200).json(pages)
  } catch(e) {
    next(CreateError.internal(e.message))
  }
}

export const getPage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params

    const page = await Page.findOne({ where: { slug } })
    if (!page) return next(CreateError.badRequest('Page not found'))

    res.status(200).json(page)
  } catch(e) {
    next(CreateError.internal(e.message || 'Page not received'))
  }
}

export const createPage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, slug, body, metaTitle, metaDesc, metaKeywords, metaRobots, tags } = req.body

    const blockedArr = ['catalog', 'reviews', 'cart', 'login', 'register', 'admin', 'blog', 'user']
    if (blockedArr.includes(slug)) return next('Invalid slug')

    const page = await Page.create({ name, slug, body, metaTitle, metaDesc, metaKeywords, metaRobots, tags })

    res.status(201).json(page)
  } catch(e) {
    next(CreateError.internal(e.message || 'The page was not created'))
  }
}

export const updatePage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, slug, body, metaTitle, metaDesc, metaKeywords, metaRobots, tags } = req.body
    const { id } = req.params

    const page = await Page.findByPk(id)
    if (!page) return next(CreateError.badRequest('Page not found'))

    const updatedPage = await page.update({ name, slug, body, metaTitle, metaDesc, metaKeywords, metaRobots, tags })

    res.status(200).json(updatedPage)
  } catch(e) {
    next(CreateError.internal(e.message || 'Page not updated'))
  }
}

export const deletePage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params

    await Page.destroy({ where: { id } })
    res.status(200).json('Page deleted')
  } catch(e) {
    next(CreateError.internal(e.message || 'Page not deleted'))
  }
}

