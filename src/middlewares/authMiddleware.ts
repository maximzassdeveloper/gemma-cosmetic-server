import { Response, NextFunction } from 'express'
import { CreateError } from '../services/errorService'
import { verifyAccessToken } from '../services/tokenService'
import { IRequest } from '../types'

export const authRequired = (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) return next(CreateError.unauthorized())

    const accessToken = authHeader.split(' ')[1]
    const userPayload = verifyAccessToken(accessToken) 
    if (!userPayload) return next(CreateError.unauthorized())

    req.user = userPayload
    next()
  } catch(e) {
    next(CreateError.unauthorized())
  }
}

export const adminRequired = (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) return next(CreateError.forriben())

    const accessToken = authHeader.split(' ')[1]
    const userPayload = verifyAccessToken(accessToken)
    if (!userPayload) return next(CreateError.forriben())

    if (userPayload.role !== 'ADMIN') {
      return next(CreateError.forriben())
    }
    req.user = userPayload
    next()
  } catch(e) {
    next(CreateError.forriben())
  }
}