import { Response, NextFunction } from 'express'
import { Comment, Product } from '../models'
import { CreateError } from '../services/errorService'
import { IRequest } from '../types'
import { deleteImages, generateName } from '../services/productService'
import path from 'path'

export const getComments = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.query
    let coms: any[] = []

    if (productId) coms = await Comment.findAll({ where: { productId } })
    else coms = await Comment.findAll()

    res.status(200).json(coms)
  } catch(e) {
    next(CreateError.internal(e.message || 'Comments not get'))
  }
}

export const createComment = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const { name, message, rating, productId } = req.body
    const { files } = req

    const user = req.user
    if (!user) return next(CreateError.unauthorized())

    const videos: string[] = []
    const images: string[] = []
    if (files) {
      Object.values(files).forEach(file => {
        if (!Array.isArray(file)) {
          const fileName = generateName(file.name)
          file.mv(path.resolve(__dirname, '..', 'static', fileName))
          switch (file.mimetype.split('/')[0]) {
            case 'image':
              images.push(process.env.SERVER_URL + '/' + fileName)
              break
            case 'video':
              videos.push(process.env.SERVER_URL + '/' + fileName)
              break
            default: break
          }
        }
      })
    }

    const newComment = await Comment.create({ name, message, rating, videos, images, userId: user.id, productId })
    const comment = await Comment.findByPk(newComment.id)
    res.status(201).json(comment)

  } catch(e) {
    next(CreateError.internal(e.message))
  }
}

export const updateComment = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const { name, message, rating } = req.body
    const { id } = req.params

    const user = req.user
    if (!user) return next(CreateError.unauthorized())

    const comment = await Comment.findOne({ where: { id } })
    if (!comment) return next(CreateError.notFound('Comment not found'))

    const updated = await comment.update({ name, message, rating })

    res.status(200).json({ comment: updated })

  } catch(e) {
    next(CreateError.internal(e.message))
  }
}

export const deleteComment = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params

    const comment = await Comment.findOne({ where: { id } })
    if (!comment) return next(CreateError.badRequest('Comment Not Found'))
    
    const files: string[] = [...comment.images || [], ...comment.videos || []]
    deleteImages(files)

    await Comment.destroy({ where: { id } })

    res.status(200).json({ message: 'Comment Deleted' })
  } catch(e) {
    next(CreateError.internal(e.message || 'Comment Not Deleted'))
  }
}