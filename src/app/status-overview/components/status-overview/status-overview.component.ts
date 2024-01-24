import { Component } from '@angular/core'
import { environment } from '../../../../environments/environment'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'

@Component({
  selector: 'sofie-status-overview-overview',
  templateUrl: './status-overview.component.html',
  styleUrls: ['./status-overview.component.scss'],
})
export class StatusOverviewComponent {
  public readonly oldStatusOverviewUrl: SafeResourceUrl

  constructor(domSanitizer: DomSanitizer) {
    this.oldStatusOverviewUrl = domSanitizer.bypassSecurityTrustResourceUrl(`${environment.oldSofieBaseUrl}/status/system`)
  }
}
