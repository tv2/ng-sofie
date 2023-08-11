import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar'
import {RundownEventServiceInterface} from '../interfaces/rundown-event-service-interface';

const WEBSOCKET_URL: string = 'ws://localhost:3006/'

@Injectable()
export class RundownEventService implements RundownEventServiceInterface {

  constructor(private snackBar: MatSnackBar) {}

  public listenForRundownEvents(rundownId: string, onEvent: (event: any) => void): WebSocket {
    const webSocket = new WebSocket(WEBSOCKET_URL)
    webSocket.onopen = (event) => {
      console.log(`Connected to Socket!`)
      console.log(event)
      webSocket.send('startListening-angularFrontend')
    }

    webSocket.onerror = (event) => {
      console.log(`Error happened`)
      console.log(event)
      this.showWebSocketErrorSnackBar('An error happened to the connection with the server. Please refresh the page.')
    }

    webSocket.onmessage = (event) => {
      console.log(`Message received`)
      console.log(event)
      onEvent(JSON.parse(event.data))
    }

    webSocket.onclose= (event) => {
      // TODO: Setup 'framework' to reconnect if connection is lost
      console.log(`Socket closed`)
      console.log(event)
      this.showWebSocketErrorSnackBar('Lost connection to server. Refresh the page to connect again.')
    }

    return webSocket
  }

  private showWebSocketErrorSnackBar(message: string): void {
    this.snackBar.open(
      message,
      '',
      {
        duration: undefined,
        panelClass: 'snackbar-danger'
      }
    )
  }
}
