export abstract class ReconnectStrategy {
    public abstract connected(): void
    public abstract disconnected(): void
    public abstract reconnect(connect: () => void): number
}
