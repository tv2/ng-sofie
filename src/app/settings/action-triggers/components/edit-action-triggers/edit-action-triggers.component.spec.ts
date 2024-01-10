import { ComponentFixture, TestBed } from '@angular/core/testing'
import { EditActionTriggersComponent } from './edit-action-triggers.component'
import { ReactiveFormsModule } from '@angular/forms'
import { mock } from '@typestrong/ts-mockito'
import { ActionTriggerService } from 'src/app/shared/abstractions/action-trigger.service'
import { ShortcutPipe } from 'src/app/shared/pipes/shortcut.pipe'

describe('EditActionTriggersComponent', () => {
  it('should create', async () => {
    const component = await configureTestBed()
    expect(component).toBeTruthy()
  })
})

async function configureTestBed(): Promise<EditActionTriggersComponent> {
  const mockedActionTriggerService: ActionTriggerService = mock<ActionTriggerService>()

  await TestBed.configureTestingModule({
    providers: [{ provide: ActionTriggerService, useValue: mockedActionTriggerService }],
    declarations: [EditActionTriggersComponent, ShortcutPipe],
    imports: [ReactiveFormsModule],
  }).compileComponents()

  const fixture: ComponentFixture<EditActionTriggersComponent> = TestBed.createComponent(EditActionTriggersComponent)
  return fixture.componentInstance
}
