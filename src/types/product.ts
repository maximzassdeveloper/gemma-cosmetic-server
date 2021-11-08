export interface ProductCreateData {
  name: string
  slug?: string
  price: number
  images: string[]
  categories?: string[]
  attrs?: number[]
  desc?: string
  tags?: string[]
  metaTitle?: string
  metaDesc?: string
  metaKeywords?: string
  metaRobots?: string
}