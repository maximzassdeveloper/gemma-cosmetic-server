export interface CommentResponse {
  name: string
  message: string
  rating: number
  productId: number
  files?: string[]
}