import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  selector: 'sofie-loading',
  template: '<mat-spinner class="c-loader" [diameter]="40"></mat-spinner>',
  styleUrls: ['./loading.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingComponent {}
