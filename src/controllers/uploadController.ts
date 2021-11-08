import { Request, Response, NextFunction } from 'express'
import { File } from '../models'
import { CreateError } from '../services/errorService'
import { generateName } from '../services/productService'
import path from 'path'
import fs from 'fs'

export const add = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { files } = req
    if (!files || !files.file || Array.isArray(files.file)) {
      return next(CreateError.badRequest('The file was transmitted incorrectly'))
    }

    const { file } = files
    const fileName = generateName(file.name)
    const fileType = file.mimetype.split('/')[0]
    
    const newFile = await File.create({ url: fileName, type: fileType })
    if (!newFile) return next(CreateError.badRequest('File not created'))

    file.mv(path.resolve(__dirname, '..', 'static', fileName))

    res.status(200).json({
      success: 1,
      file: newFile
    })
  } catch(e) {
    next(CreateError.internal(e.message))
  }
}

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { url } = req.body

    const file = await File.findOne({ where: { url } })
    if (!file) return next(CreateError.badRequest('File not found'))

    await file.destroy()
    fs.unlink(path.resolve(__dirname, '..', 'static', url), e => console.log(e))

    res.status(200).json('File deleted success')
  } catch(e) {
    next(CreateError.internal(e.message))
  }
}