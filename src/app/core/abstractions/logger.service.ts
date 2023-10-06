import { Level as LogLevel } from '@tv2media/logger'
export { Level as LogLevel } from '@tv2media/logger'

export abstract class Logger {
    public abstract error(message: string, metadata?: object): void
    public abstract warn(message: string, metadata?: object): void
    public abstract info(message: string, metadata?: object): void
    public abstract debug(message: string, metadata?: object): void
    public abstract trace(message: string, metadata?: object): void
    public abstract metadata(metadata: object): Logger
    public abstract tag(tag: string): Logger
    public abstract data(data: unknown): Logger
    public abstract setLevel(level: LogLevel): void
}
