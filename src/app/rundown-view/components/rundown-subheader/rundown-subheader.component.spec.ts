import { RundownSubheaderComponent } from './rundown-subheader.component'
import { TestEntityFactory } from '../../../test/factories/test-entity.factory'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { PartEntityService } from '../../../core/services/models/part-entity.service'
import { instance, mock } from '@typestrong/ts-mockito'
import { TimerPipe } from '../../pipes/timer/timer.pipe'

describe(RundownSubheaderComponent.name, () => {
  it('should create', async () => {
    const testEntityFactory: TestEntityFactory = new TestEntityFactory()
    const component: RundownSubheaderComponent = await configureTestBed()
    component.rundown = testEntityFactory.createRundown()
    expect(component).toBeTruthy()
  })
})

async function configureTestBed(): Promise<RundownSubheaderComponent> {
  await TestBed.configureTestingModule({
    providers: [{ provide: PartEntityService, useValue: instance(mock<PartEntityService>()) }],
    declarations: [RundownSubheaderComponent, TimerPipe],
  }).compileComponents()
  const fixture: ComponentFixture<RundownSubheaderComponent> = TestBed.createComponent(RundownSubheaderComponent)
  return fixture.componentInstance
}
