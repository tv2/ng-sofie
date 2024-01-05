import { ComponentFixture, TestBed } from '@angular/core/testing'
import { SingleActionTriggerBoxComponent } from './single-action-trigger-box.component'

describe('SingleActionTriggerBoxComponent', () => {
  it('should create', async () => {
    const component = await configureTestBed()
    expect(component).toBeTruthy()
  })
})

async function configureTestBed(): Promise<SingleActionTriggerBoxComponent> {
  await TestBed.configureTestingModule({
    providers: [],
    declarations: [SingleActionTriggerBoxComponent],
  }).compileComponents()

  const fixture: ComponentFixture<SingleActionTriggerBoxComponent> = TestBed.createComponent(SingleActionTriggerBoxComponent)
  return fixture.componentInstance
}
