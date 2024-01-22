import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ReactiveFormsModule } from '@angular/forms'
import { instance, mock } from '@typestrong/ts-mockito'
import { ActionTriggerService } from 'src/app/shared/abstractions/action-trigger.service'
import { FormatKeyboardKeysPipe } from 'src/app/shared/pipes/format-keyboard-keys.pipe'
import { KeyboardKeysFieldComponent } from './keyboard-keys-field.component'

describe('KeyboardKeysFieldComponent', () => {
  it('should create', async () => {
    const component = await configureTestBed()
    expect(component).toBeTruthy()
  })
})

async function configureTestBed(): Promise<KeyboardKeysFieldComponent> {
  const mockedActionTriggerService: ActionTriggerService = mock<ActionTriggerService>()
  await TestBed.configureTestingModule({
    providers: [{ provide: ActionTriggerService, useValue: instance(mockedActionTriggerService) }],
    declarations: [KeyboardKeysFieldComponent, FormatKeyboardKeysPipe],
    imports: [ReactiveFormsModule],
  }).compileComponents()

  const fixture: ComponentFixture<KeyboardKeysFieldComponent> = TestBed.createComponent(KeyboardKeysFieldComponent)
  return fixture.componentInstance
}
