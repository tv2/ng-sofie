export interface RundownEventServiceInterface {
  listenForRundownEvents(rundownId: string, onEvent: (event: any) => void): WebSocket
}
