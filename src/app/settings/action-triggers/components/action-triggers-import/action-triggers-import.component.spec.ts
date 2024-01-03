import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ActionTriggersImportComponent } from './action-triggers-import.component'
import { anything, instance, mock, when } from '@typestrong/ts-mockito'
import { Observable, Subscription } from 'rxjs'
import { ActionTriggerParser } from 'src/app/shared/abstractions/action-trigger-parser.service'
import { ActionTriggerStateService } from 'src/app/core/services/action-trigger-state.service'
import { MatSnackBar } from '@angular/material/snack-bar'

describe('ActionTriggersImportComponent', () => {
  it('should create', async () => {
    const component = await configureTestBed()
    expect(component).toBeTruthy()
  })
})

async function configureTestBed(): Promise<ActionTriggersImportComponent> {
  const mockedActionTriggerStateService: ActionTriggerStateService = instance(createMockOfActionTriggersService())
  const mockedActionTriggerParser: ActionTriggerParser = instance(createMockOfActionTriggerParserService())
  const mockedMatSnackBar = mock<MatSnackBar>()
  await TestBed.configureTestingModule({
    providers: [
      { provide: ActionTriggerStateService, useValue: mockedActionTriggerStateService },
      { provide: ActionTriggerParser, useValue: mockedActionTriggerParser },
      { provide: MatSnackBar, useValue: mockedMatSnackBar },
    ],
    declarations: [ActionTriggersImportComponent],
  }).compileComponents()

  const fixture: ComponentFixture<ActionTriggersImportComponent> = TestBed.createComponent(ActionTriggersImportComponent)
  return fixture.componentInstance
}

function createMockOfActionTriggersService(): ActionTriggerStateService {
  const mockedActionTriggersService = mock<ActionTriggerStateService>()

  const mockedSubscription = mock<Subscription>()
  const mockedObservable = mock<Observable<void>>()
  when(mockedObservable.subscribe(anything)).thenReturn(instance(mockedSubscription))
  return mockedActionTriggersService
}

function createMockOfActionTriggerParserService(): ActionTriggerParser {
  const mockedActionTriggerParser = mock<ActionTriggerParser>()
  const mockedSubscription = mock<Subscription>()
  const mockedObservable = mock<Observable<void>>()
  when(mockedObservable.subscribe(anything)).thenReturn(instance(mockedSubscription))
  return mockedActionTriggerParser
}
