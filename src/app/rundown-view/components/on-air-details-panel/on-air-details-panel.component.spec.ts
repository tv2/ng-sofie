import { OnAirDetailsPanelComponent } from './on-air-details-panel.component'
import { TestEntityFactory } from '../../../test/factories/test-entity.factory'
import { ComponentFixture, TestBed } from '@angular/core/testing'

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
    providers: [],
    declarations: [OnAirDetailsPanelComponent],
  }).compileComponents()
  const fixture: ComponentFixture<OnAirDetailsPanelComponent> = TestBed.createComponent(OnAirDetailsPanelComponent)
  return fixture.componentInstance
}
