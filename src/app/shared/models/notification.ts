import { StatusCode } from '../enums/status-code'

export interface Notification {
  message: string
  statusCode: StatusCode
  isPersistent?: boolean
}
