import { StatusCode } from '../enums/status-code'

export interface Notification {
  id: string
  message: string
  statusCode: StatusCode
  isPersistent: boolean
}
