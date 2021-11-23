import { Response, NextFunction } from 'express'
import { Comment, File } from '../models'
import { CreateError } from '../services/errorService'
import { IRequest } from '../types'
import { CommentResponse } from '../types/responses'

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
    const { name, message, rating, productId, files } = req.body as CommentResponse

    const user = req.user
    if (!user) return next(CreateError.unauthorized())

    const newComment = await Comment.create({ name, message, rating, userId: user.id, productId })

    files?.forEach(async url => {
      const file = await File.findOne({ where: { url } })
      if (file) await file.update({ commentId: newComment.id })
    })

    const comment = await Comment.findByPk(newComment.id)

    res.status(201).json(comment)
  } catch(e) {
    next(CreateError.internal(e.message))
  }
}

export const updateComment = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const { name, message, rating, productId, files } = req.body as CommentResponse
    const { id } = req.params

    const user = req.user
    if (!user) return next(CreateError.unauthorized())

    const comment = await Comment.findOne({ where: { id } })
    if (!comment) return next(CreateError.notFound('Comment not found'))

    files?.forEach(async url => {
      const file = await File.findOne({ where: { url } })
      if (file) await file.update({ commentId: comment.id })
    })

    const updated = await comment.update({ name, message, rating, productId })

    res.status(200).json(updated)

  } catch(e) {
    next(CreateError.internal(e.message))
  }
}

export const deleteComment = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params

    const comment = await Comment.findOne({ where: { id } })
    if (!comment) return next(CreateError.badRequest('Comment Not Found'))

    await Comment.destroy({ where: { id } })

    res.status(200).json({ message: 'Comment Deleted' })
  } catch(e) {
    next(CreateError.internal(e.message || 'Comment Not Deleted'))
  }
}