import { Environment } from './environment-interface'
import { LogLevel } from '../app/core/abstractions/logger.service'

const SOFIE_CORE_SUBDOMAIN: string = 'old'

export const environment: Environment = {
  production: true,
  apiBaseUrl: `${window.location.origin}/api`,
  logLevel: LogLevel.INFO,
  eventStreamUrl: `ws://${window.location.hostname}/events`,
  oldSofieBaseUrl: `http://${SOFIE_CORE_SUBDOMAIN}.${window.location.hostname}`,
}
