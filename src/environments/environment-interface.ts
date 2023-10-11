import { LogLevel } from '../app/core/abstractions/logger.service'

export interface Environment {
  production: boolean
  apiBaseUrl: string
  logLevel: LogLevel
}
