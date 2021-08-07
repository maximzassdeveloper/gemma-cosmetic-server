import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import { Cart, User } from '../models'
import { genereateData } from '../services/userService'
import { CreateError } from '../services/errorService'
import { generateTokens, verifyRefreshToken } from '../services/tokenService'
import { UserDto } from '../services/dtos'

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
    next(CreateError.interanl('Register Failed'))
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
    next(CreateError.interanl('Login Failed'))
  }
}

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie('refreshtoken')
    res.status(200).json({ message: 'Logout Success' })
  } catch(e) {
    next(CreateError.interanl('Logout Failed'))
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
    next(CreateError.interanl('Refresh Failed'))
  }
}