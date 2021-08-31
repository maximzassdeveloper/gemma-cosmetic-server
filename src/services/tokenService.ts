import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { IUserPayload } from '../types/user'
dotenv.config()

export const generateTokens = (payload: IUserPayload) => {
  const accessToken = jwt.sign(
    { payload },
    process.env.JWT_ACCESS_SECRET as string,
    { expiresIn: '30m' }
  )
  const refreshToken = jwt.sign(
    { payload },
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: '30d' }
  )

  return {
    accessToken,
    refreshToken
  }
}

export const verifyAccessToken = (token: string): IUserPayload | null => {
  try {
    const userPayload = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string) as jwt.JwtPayload
    return userPayload.payload
  } catch(e) {
    return null
  }
}

export const verifyRefreshToken = (token: string): IUserPayload | null => {
  try {
    const userPayload = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string) as jwt.JwtPayload
    return userPayload.payload
  } catch(e) {
    return null
  }
}