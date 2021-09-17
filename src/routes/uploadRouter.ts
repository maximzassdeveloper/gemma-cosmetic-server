import { Router } from 'express'
import { generateImages } from '../services/productService'
const router = Router()

router.post('/', (req, res) => {
  const images = generateImages(req.files)
  res.status(200).json({ success: 1, file: { url: images[0] }})
})

export default router