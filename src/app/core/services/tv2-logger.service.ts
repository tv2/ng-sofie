import { DefaultLogger } from '@tv2media/logger/web'
import { environment } from '../../../environments/environment'

export class Tv2LoggerService extends DefaultLogger {
    constructor() {
        ensureWindowEnv({
            ENV: getExecutionEnvFromUrl() ?? (environment.production ? 'production' : 'development'),
            LOG_LEVEL: getLogLevelFromUrl() ?? environment.logLevel,
        })
        super()
    }
}

function ensureWindowEnv(fallbackEnv: Record<string, string> = {}): void {
    if ('env' in window) {
        return
    }
    ;(window as unknown as { env: Record<string, string> }).env = fallbackEnv
}

function getExecutionEnvFromUrl(): string | undefined {
    const urlParameters: URLSearchParams = new URLSearchParams(window.location.search)

    const env: string | undefined = urlParameters.get('ENV') ?? undefined
    if (!env) {
        return
    }
    return env
}

function getLogLevelFromUrl(): string | undefined {
    const urlParameters: URLSearchParams = new URLSearchParams(window.location.search)

    const logLevel: string | undefined = urlParameters.get('LOG_LEVEL') ?? undefined
    if (!logLevel) {
        return
    }
    return logLevel
}
