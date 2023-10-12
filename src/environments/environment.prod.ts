import { Environment } from './environment-interface'
import { LogLevel } from '../app/core/abstractions/logger.service'

export const environment: Environment = {
  production: true,
  apiBaseUrl: `${window.location.origin}/api`,
  logLevel: LogLevel.INFO,
  eventStreamUrl: `ws://${window.location.hostname}:3006`,
}
