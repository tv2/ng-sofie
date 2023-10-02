import {Component} from '@angular/core'
import { ConnectionErrorService } from './shared/services/connection-error.service'

@Component({
  selector: 'sofie-root',
  templateUrl: './app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(private readonly connectionErrorService: ConnectionErrorService) {}
}
