import { Request } from 'express'
import { FileArray } from 'express-fileupload'
import { IUserPayload } from './user'

export interface IRequest extends Request {
  user?: IUserPayload
  files?: FileArray
}
