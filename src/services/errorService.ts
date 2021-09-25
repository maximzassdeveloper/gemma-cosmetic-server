export class CreateError extends Error {
  status: number = 400
  message: string = 'Something Wrong'

  constructor(status: number, message?: string) {
    super()
    this.status = status
    this.message = message || this.message
  }

  static badRequest(message: string = 'Bad Request') {
    return new CreateError(400, message)
  }

  static unauthorized(message: string = 'User Unauthorized') {
    return new CreateError(401, message)
  }

  static forriben(message: string = 'Forriben') {
    return new CreateError(403, message)
  }

  static notFound(message: string = 'Not Found') {
    return new CreateError(404, message)
  }

  static internal(message: string = 'Something Wrong') {
    return new CreateError(500, message)
  }
}