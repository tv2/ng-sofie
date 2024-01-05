import { ComponentFixture, TestBed } from '@angular/core/testing'
import { SelectActionTriggerComponent } from './select-action-trigger.component'

describe('SelectActionTriggerComponent', () => {
  it('should create', async () => {
    const component = await configureTestBed()
    expect(component).toBeTruthy()
  })
})

async function configureTestBed(): Promise<SelectActionTriggerComponent> {
  await TestBed.configureTestingModule({
    providers: [],
    declarations: [SelectActionTriggerComponent],
  }).compileComponents()

  const fixture: ComponentFixture<SelectActionTriggerComponent> = TestBed.createComponent(SelectActionTriggerComponent)
  return fixture.componentInstance
}
