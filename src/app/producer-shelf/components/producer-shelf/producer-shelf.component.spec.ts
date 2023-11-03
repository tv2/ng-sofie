import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ProducerShelfComponent } from './producer-shelf.component'
import { anyString, anything, instance, mock, when } from '@typestrong/ts-mockito'
import { ActionStateService } from '../../../shared/services/action-state.service'
import { Tv2ActionParser } from '../../../shared/abstractions/tv2-action-parser.service'
import { ActionService } from '../../../shared/abstractions/action.service'
import { Logger } from '../../../core/abstractions/logger.service'
import { TestEntityFactory } from '../../../test/factories/test-entity.factory'
import { TestLoggerFactory } from '../../../test/factories/test-logger.factory'

describe(ProducerShelfComponent.name, () => {
  let component: ProducerShelfComponent
  let fixture: ComponentFixture<ProducerShelfComponent>

  beforeEach(async () => {
    const mockedActionStateService: ActionStateService = mock<ActionStateService>()
    when(mockedActionStateService.subscribeToRundownActions(anyString(), anything())).thenResolve({
      closed: false,
      unsubscribe: () => {
        return
      },
    })
    await TestBed.configureTestingModule({
      declarations: [ProducerShelfComponent],
      providers: [
        { provide: ActionStateService, useValue: instance(mockedActionStateService) },
        { provide: Tv2ActionParser, useValue: instance(mock<Tv2ActionParser>()) },
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
