import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
  selector: 'sofie-rundown-header-panel',
  templateUrl: './rundown-header-panel.component.html',
  styleUrls: ['./rundown-header-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RundownHeaderPanelComponent {
  @Input()
  public label: string
}
