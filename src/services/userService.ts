import { Response } from 'express'
import { IUser } from '../models/types'
import { IUserPayload } from '../types/user'
import { IRequest } from '../types'
import { UserDto, UserPayloadDto } from './dtos'
import { generateTokens, verifyAccessToken } from './tokenService'

export const checkAuth = (req: IRequest): IUserPayload | null => {
  const authHeader = req.headers.authorization
  if (!authHeader) return null

  try {
    const accessToken = authHeader.split(' ')[1]

    const userPayload = verifyAccessToken(accessToken)
    if (!userPayload) return null

    return userPayload
  } catch(e) {
    return null
  }
}

export const genereateData = (res: Response, user: IUser) => {
  const userDto = new UserDto(user)
  const userPayload = new UserPayloadDto(user)
  const tokens = generateTokens(userPayload)

  res.cookie('refreshtoken', tokens.refreshToken, {
    maxAge: 30*24*60*60*1000,
    httpOnly: true,
    sameSite: 'strict',
    // secure: true
  })

  return { user: userDto, ...tokens }
}