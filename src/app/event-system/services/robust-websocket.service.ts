import { ReconnectStrategy } from '../abstractions/reconnect-strategy.service'
import { Logger } from '../../core/abstractions/logger.service'

type MessageConsumer = (event: MessageEvent) => void
type ErrorConsumer = (event: Event) => void
type OpenConsumer = (event: Event) => void
type CloseConsumer = (event: CloseEvent) => void

export class RobustWebSocket {
  private readonly logger: Logger
  private readonly socket: WebSocket
  private messageConsumer?: MessageConsumer
  private errorConsumer?: ErrorConsumer
  private openConsumer?: OpenConsumer
  private closeConsumer?: CloseConsumer

  constructor(
    private readonly url: string,
    private readonly reconnectStrategy: ReconnectStrategy,
    logger: Logger
  ) {
    this.logger = logger.tag('RobustWebSocket')
    this.socket = this.connect()
  }

  private connect(): WebSocket {
    if (this.socket) {
      this.socket.close()
    }
    this.logger.debug('Connecting to WebSocket...')
    const socket: WebSocket = new WebSocket(this.url)
    socket.addEventListener('open', this.openEventHandler.bind(this))
    socket.addEventListener('message', this.messageEventHandler.bind(this))
    socket.addEventListener('error', this.errorEventHandler.bind(this))
    socket.addEventListener('close', this.closeEventHandler.bind(this))
    return socket
  }

  private openEventHandler(event: Event): void {
    this.reconnectStrategy.connected()
    this.logger.info(`Connected to WebSocket at ${this.url}.`)
    this.logger.data(event).trace('Received an opening event.')
    this.openConsumer?.(event)
  }

  private messageEventHandler(event: MessageEvent): void {
    this.logger.data(event).trace('Received an event.')
    this.messageConsumer?.(event)
  }

  private errorEventHandler(event: Event): void {
    this.logger.data(event).debug('A WebSocket error occurred.')
    this.errorConsumer?.(event)
  }

  private closeEventHandler(event: CloseEvent): void {
    this.logger.data(event).warn('WebSocket connection is closed.')
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
