import { OnAirDetailsPanelComponent } from './on-air-details-panel.component'
import { TestEntityFactory } from '../../../test/factories/test-entity.factory'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { PartEntityService } from '../../../core/services/models/part-entity.service'
import { instance, mock } from '@typestrong/ts-mockito'
import { TimerPipe } from '../../../shared/pipes/timer/timer.pipe'
import { RundownTimingContextStateService } from '../../../core/services/rundown-timing-context-state.service'
import { Logger } from '../../../core/abstractions/logger.service'

describe(OnAirDetailsPanelComponent.name, () => {
  it('should create', async () => {
    const testEntityFactory: TestEntityFactory = new TestEntityFactory()
    const component: OnAirDetailsPanelComponent = await configureTestBed()
    component.rundown = testEntityFactory.createRundown()
    expect(component).toBeTruthy()
  })
})

async function configureTestBed(): Promise<OnAirDetailsPanelComponent> {
  await TestBed.configureTestingModule({
    providers: [
      { provide: PartEntityService, useValue: instance(mock<PartEntityService>()) },
      { provide: RundownTimingContextStateService, useValue: instance(mock<RundownTimingContextStateService>()) },
      { provide: Logger, useValue: instance(mock<Logger>()) },
    ],
    declarations: [OnAirDetailsPanelComponent, TimerPipe],
  }).compileComponents()
  const fixture: ComponentFixture<OnAirDetailsPanelComponent> = TestBed.createComponent(OnAirDetailsPanelComponent)
  return fixture.componentInstance
}
