import { Environment } from './environment-interface'
import { LogLevel } from '../app/core/abstractions/logger.service'

export const environment: Environment = {
  production: false,
  apiBaseUrl: `http://${window.location.hostname}:3005/api`,
  logLevel: LogLevel.DEBUG,
  eventStreamUrl: `ws://${window.location.hostname}:3006`,
  oldSofieBaseUrl: 'http://localhost:3000',
}
