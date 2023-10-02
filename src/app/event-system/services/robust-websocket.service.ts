import { ReconnectStrategy } from '../abstractions/reconnect-strategy.service'

type MessageConsumer = (event: MessageEvent) => void
type ErrorConsumer = (event: Event) => void
type OpenConsumer = (event: Event) => void
type CloseConsumer = (event: CloseEvent) => void

export class RobustWebSocket {
  private readonly socket: WebSocket
  private messageConsumer?: MessageConsumer
  private errorConsumer?: ErrorConsumer
  private openConsumer?: OpenConsumer
  private closeConsumer?: CloseConsumer

  constructor(private readonly url: string, private readonly reconnectStrategy: ReconnectStrategy) {
    this.socket = this.connect()
  }

  private connect(): WebSocket {
    if (this.socket) {
      this.socket.close()
    }
    console.log('[info] Connecting to WebSocket...')
    const socket: WebSocket = new WebSocket(this.url)
    socket.addEventListener('open', this.openEventHandler.bind(this))
    socket.addEventListener('message', this.messageEventHandler.bind(this))
    socket.addEventListener('error', this.errorEventHandler.bind(this))
    socket.addEventListener('close', this.closeEventHandler.bind(this))
    return socket
  }

  private openEventHandler(event: Event): void {
    this.reconnectStrategy.connected()
    console.log('[info]', 'Connected to WebSocket.')
    console.log('[debug]', 'Received an opening event.', event)
    this.openConsumer?.(event)
  }

  private messageEventHandler(event: MessageEvent): void {
    console.log('[debug]', 'Received an event.', event)
    this.messageConsumer?.(event)
  }

  private errorEventHandler(event: Event): void {
    console.log('[debug]', 'A WebSocket error occurred.', event)
    this.errorConsumer?.(event)
  }

  private closeEventHandler(event: CloseEvent): void {
    console.error('[error]', 'WebSocket connection is closed.', event)
    this.reconnectStrategy.disconnected(this.connect.bind(this))
    this.closeConsumer?.(event)
  }

  public onMessage(consumer: MessageConsumer): void {
    this.messageConsumer = consumer
  }

  public onError(consumer: ErrorConsumer): void {
    this.errorConsumer = consumer
  }

  public onOpen(consumer: OpenConsumer): void {
    this.openConsumer = consumer
  }

  public onClose(consumer: CloseConsumer): void {
    this.closeConsumer = consumer
  }
}
