import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core'
import { Subject, takeUntil } from 'rxjs'
import { ShelfActionPanelConfiguration, ShelfActionPanelConfigurationWithId, ShelfConfiguration } from 'src/app/shared/models/shelf-configuration'
import { ShelfConfigurationStateService } from 'src/app/core/services/shelf-configuration-state.service'

@Component({
  selector: 'sofie-action-panel',
  templateUrl: './action-panel.component.html',
  styleUrls: ['./action-panel.component.scss'],
})
export class ActionPanelComponent implements OnInit, OnDestroy {
  public selectedActionPanels?: ShelfActionPanelConfiguration[] = []
  public isLoading: boolean = true
  public shelfConfiguration: ShelfConfiguration<ShelfActionPanelConfigurationWithId>

  private readonly unsubscribe$: Subject<null> = new Subject<null>()

  constructor(
    private readonly shelfConfigurationStateService: ShelfConfigurationStateService,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {}

  public ngOnInit(): void {
    this.setIsLoading(true)
    this.shelfConfigurationStateService
      .getShelfConfigurationObservable()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(shelfConfiguration => {
        this.shelfConfiguration = {
          id: shelfConfiguration.id,
          actionPanelConfigurations: shelfConfiguration.actionPanelConfigurations.map((panelConfiguration, index) => {
            return { ...panelConfiguration, id: index.toString() }
          }),
        }
        this.setIsLoading(false)
        this.changeDetectorRef.detectChanges()
      })
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.unsubscribe()
  }

  public setIsLoading(isLoading: boolean): void {
    this.isLoading = isLoading
  }
}
