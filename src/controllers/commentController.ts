import { Response, NextFunction } from 'express'
import { Comment } from '../models'
import { CreateError } from '../services/errorService'
import { IRequest } from '../types'

export const createComment = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const { name, message, rating, productId } = req.body

    const user = req.user
    if (!user) return next(CreateError.unauthorized())

    const comment = await Comment.create({ name, message, rating, userId: user.id, productId })
    res.status(201).json(comment)

  } catch(e) {
    next(CreateError.interanl(e.message))
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
    next(CreateError.interanl(e.message))
  }
}