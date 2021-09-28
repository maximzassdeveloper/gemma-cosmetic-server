import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import { Cart, User } from '../models'
import { genereateData } from '../services/userService'
import { CreateError } from '../services/errorService'
import { generateTokens, verifyRefreshToken } from '../services/tokenService'
import { UserDto } from '../services/dtos'
import { IRequest } from '../types'

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, surname, email, password } = req.body

    // Check if user exists
    const candidate = await User.findOne({ where: { email } })
    if (candidate) return next(CreateError.badRequest('User exists'))

    // Crate User and Cart
    const hashPassword = await bcrypt.hash(password, 12)
    const user = await User.create({ name, surname, email, password: hashPassword })
    await Cart.create({ userId: user.id })

    // Genereate data transfer
    const data = genereateData(res, user)
    res.status(201).json(data)
    
  } catch(e) {
    next(CreateError.internal(e.message || 'Register Failed'))
  }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body

    // Check if user exists
    const user = await User.findOne({ where: { email } })
    if (!user) return next(CreateError.badRequest('Email or Password are incorrect'))

    const passEquals = await bcrypt.compare(password, user.password)
    if (!passEquals) return next(CreateError.badRequest('Email or Password are incorrect'))

    // Genereate data transfer
    const data = genereateData(res, user)
    res.status(201).json(data)

  } catch (e) {
    next(CreateError.internal(e.message || 'Login Failed'))
  }
}

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie('refreshtoken')
    res.status(200).json({ message: 'Logout Success' })
  } catch(e) {
    next(CreateError.internal('Logout Failed'))
  }
}

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshtoken } = req.cookies

    if (!refreshtoken) return next(CreateError.unauthorized())

    const userPayload = verifyRefreshToken(refreshtoken)
    if (!userPayload) return next(CreateError.unauthorized())

    const user = await User.findOne({ where: { id: userPayload.id } })
    if (!user) return next(CreateError.unauthorized())

    const userDto = new UserDto(user)
    const tokens = generateTokens(userPayload)

    res.status(200).json({ user: userDto, ...tokens })

  } catch(e) {
    next(CreateError.internal('Refresh Failed'))
  }
}

export const getUsers = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const users = await User.findAll()
    res.status(200).json(users)

  } catch(e) {
    next(CreateError.internal(e.message || 'Getting Users Failed'))
  }
}

export const getUser = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const user = await User.findByPk(id)
    if (!user) return next(CreateError.badRequest('User Not Found'))

    res.status(200).json(user)
  } catch(e) {
    next(CreateError.internal(e.message || 'Getting User Failed'))
  }
}

export const deleteUser = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const { user } = req
    if (!user) return next(CreateError.unauthorized())

    await User.destroy({ where: { id: user.id } })

    res.status(200).json({ message: 'User Deleted' })
  } catch(e) {
    next(CreateError.internal(e.message || 'Deleting User Failed'))
  }
}

export const updateUser = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const { name, surname, email, phone } = req.body
    const { user } = req
    if (!user) return next(CreateError.unauthorized())

    const founded = await User.findOne({ where: { id: user.id } })
    if (!founded) return next(CreateError.badRequest('User Not Found'))

    const updated = await founded.update({ name, surname, email, phone })
    res.status(200).json(updated)
  } catch(e) {
    next(CreateError.internal(e.message || 'Updating User Failed'))
  }
}