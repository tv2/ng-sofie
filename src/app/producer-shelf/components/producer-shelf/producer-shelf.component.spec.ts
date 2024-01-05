import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ProducerShelfComponent } from './producer-shelf.component'
import { anyString, instance, mock, when } from '@typestrong/ts-mockito'
import { ActionStateService } from '../../../shared/services/action-state.service'
import { Tv2ActionValidator } from '../../../shared/abstractions/tv2-action-validator.service'
import { ActionService } from '../../../shared/abstractions/action.service'
import { Logger } from '../../../core/abstractions/logger.service'
import { TestEntityFactory } from '../../../test/factories/test-entity.factory'
import { TestLoggerFactory } from '../../../test/factories/test-logger.factory'
import { Observable } from 'rxjs'
import { Action } from '../../../shared/models/action'

describe(ProducerShelfComponent.name, () => {
  let component: ProducerShelfComponent
  let fixture: ComponentFixture<ProducerShelfComponent>

  beforeEach(async () => {
    const mockedActionStateService: ActionStateService = mock<ActionStateService>()
    when(mockedActionStateService.subscribeToRundownActions(anyString())).thenResolve({
      subscribe: () => ({
        closed: false,
        unsubscribe: (): void => {
          return
        },
      }),
    } as Observable<Action[]>)
    await TestBed.configureTestingModule({
      declarations: [ProducerShelfComponent],
      providers: [
        { provide: ActionStateService, useValue: instance(mockedActionStateService) },
        { provide: Tv2ActionValidator, useValue: instance(mock<Tv2ActionValidator>()) },
        { provide: ActionService, useValue: instance(mock<ActionService>()) },
        { provide: Logger, useValue: createLogger() },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(ProducerShelfComponent)
    component = fixture.componentInstance
    const testEntityFactory: TestEntityFactory = new TestEntityFactory()
    component.keystrokes = []
    component.keyBindings = []
    component.rundown = testEntityFactory.createRundown()
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})

function createLogger(): Logger {
  const testLoggerFactory: TestLoggerFactory = new TestLoggerFactory()
  return testLoggerFactory.createLogger()
}
