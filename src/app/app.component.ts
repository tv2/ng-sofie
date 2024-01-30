import { Component, OnDestroy, OnInit } from '@angular/core'
import { ConnectionErrorService } from './shared/services/connection-error.service'
import { Title } from '@angular/platform-browser'
import { SystemInformationService } from './shared/services/system-information.service'

export const SOFIE: string = 'Sofie'

@Component({
  selector: 'sofie-root',
  templateUrl: './app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(
    private readonly connectionErrorService: ConnectionErrorService,
    private readonly titleService: Title,
    private readonly systemInformationService: SystemInformationService
  ) {}

  public ngOnInit(): void {
    this.systemInformationService.getSystemInformation().subscribe(systemInformation => {
      const title: string = `${SOFIE} - ${systemInformation.name}`
      this.titleService.setTitle(title)
    })
  }

  public ngOnDestroy(): void {
    this.connectionErrorService.ngOnDestroy()
  }
}
