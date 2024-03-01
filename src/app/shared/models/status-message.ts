import { StatusCode } from '../enums/status-code'

export interface StatusMessage {
  readonly id: string
  readonly title: string
  readonly message: string
  readonly statusCode: StatusCode
}
