import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ProducerShelfComponent } from './producer-shelf.component'
import { anyString, instance, mock, when } from '@typestrong/ts-mockito'
import { ActionStateService } from '../../../shared/services/action-state.service'
import { Tv2ActionParser } from '../../../shared/abstractions/tv2-action-parser.service'
import { ActionService } from '../../../shared/abstractions/action.service'
import { Logger } from '../../../core/abstractions/logger.service'
import { TestEntityFactory } from '../../../test/factories/test-entity.factory'
import { TestLoggerFactory } from '../../../test/factories/test-logger.factory'
import { Observable } from 'rxjs'
import { Action } from '../../../shared/models/action'
import { ConfigurationService } from '../../../shared/services/configuration.service'
import { ShelfConfiguration } from '../../../shared/models/shelf-configuration'
import { ConfigurationEventObserver } from '../../../core/services/configuration-event-observer'

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

    const mockedConfigurationService: ConfigurationService = mock<ConfigurationService>()
    when(mockedConfigurationService.getShelfConfiguration()).thenReturn(instance(mock<Observable<ShelfConfiguration>>()))

    await TestBed.configureTestingModule({
      declarations: [ProducerShelfComponent],
      providers: [
        { provide: ActionStateService, useValue: instance(mockedActionStateService) },
        { provide: Tv2ActionParser, useValue: instance(mock<Tv2ActionParser>()) },
        { provide: ActionService, useValue: instance(mock<ActionService>()) },
        { provide: ConfigurationService, useValue: instance(mockedConfigurationService) },
        { provide: ConfigurationEventObserver, useValue: instance(mock<ConfigurationEventObserver>()) },
        { provide: Logger, useValue: createLogger() },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(ProducerShelfComponent)
    component = fixture.componentInstance

    component.keystrokes = []
    component.keyBindings = []
    component.rundown = TestEntityFactory.createRundown()
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
