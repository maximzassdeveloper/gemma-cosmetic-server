import { Request, Response, NextFunction } from 'express'
import { CreateError } from '../services/errorService'

export const errorHandler = (error: CreateError, req: Request, res: Response, next: NextFunction) => {
  console.log('--------------------------------------------------------')
  console.log('Error: ', error.message)
  // console.log('--------------------------------------------------------')
  res.status(error.status || 500)
  res.json({
    status: error.status,
    message: error.message
  })
}