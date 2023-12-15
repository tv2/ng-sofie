import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ActionTriggersComponent } from './action-triggers.component'

describe('ActionTriggersComponent', () => {
  it('should create', async () => {
    const component = await configureTestBed()
    expect(component).toBeTruthy()
  })
})

async function configureTestBed(): Promise<ActionTriggersComponent> {
  await TestBed.configureTestingModule({
    providers: [],
    declarations: [ActionTriggersComponent],
  }).compileComponents()

  const fixture: ComponentFixture<ActionTriggersComponent> = TestBed.createComponent(ActionTriggersComponent)
  return fixture.componentInstance
}
