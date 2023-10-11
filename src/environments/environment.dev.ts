import { Environment } from './environment-interface'
import { LogLevel } from '../app/core/abstractions/logger.service'

export const environment: Environment = {
  production: false,
  apiBaseUrl: 'http://localhost:3005/api',
  logLevel: LogLevel.DEBUG,
}
