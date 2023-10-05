import { Environment } from './environment-interface'

export const environment: Environment = {
  production: true,
  apiBaseUrl: `${window.location.origin}/api`,
}
