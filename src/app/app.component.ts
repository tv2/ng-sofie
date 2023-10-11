import { Component, OnDestroy } from '@angular/core'
import { ConnectionErrorService } from './shared/services/connection-error.service'

@Component({
  selector: 'sofie-root',
  templateUrl: './app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnDestroy {
  constructor(private readonly connectionErrorService: ConnectionErrorService) {}

  public ngOnDestroy(): void {
    this.connectionErrorService.ngOnDestroy()
  }
}
