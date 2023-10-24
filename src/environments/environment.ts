// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { Environment } from './environment-interface'
import { LogLevel } from '../app/core/abstractions/logger.service'

export const environment: Environment = {
  production: false,
  apiBaseUrl: 'http://localhost:3005/api',
  logLevel: LogLevel.DEBUG,
  eventStreamUrl: 'ws://localhost:3006',
}

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
