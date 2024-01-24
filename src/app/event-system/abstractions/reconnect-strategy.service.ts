export abstract class ReconnectStrategy {
  public abstract connected(): void
  public abstract disconnected(connect: () => void): void
}
