import { Router, Request, Response, NextFunction } from 'express'
import nodemailer from 'nodemailer'
import { CreateError } from '../services/errorService'
const router = Router()

const transporter = nodemailer.createTransport({
  port: Number(process.env.MAIL_PORT),
  host: process.env.MAIL_HOST,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  },
  secure: true
})

router.post('/mail-partner', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, name } = req.body
    const mailData = {
      from: process.env.MAIL_USER,
      to: process.env.MAIL_TO,
      subject: 'Заявка с gemmainrussia.ru',
      text: `Имя: ${name}, Почта: ${email}`,
      html: '<b>Новый партнер</b><br> Ответь ему<br/>',
    }

    transporter.sendMail(mailData, (error, info) => {
      if (error) return next(CreateError.badRequest(error.message || 'Mail not sent'))
      return res.status(200).json({ success: true })
    })
  } catch(e) {
    next(e || 'Mail not sent')
  }
})

export default router