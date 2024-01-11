import { ComponentFixture, TestBed } from '@angular/core/testing'
import { MinishelfComponent } from './minishelf.component'
import { Logger } from '../../../core/abstractions/logger.service'
import { TestLoggerFactory } from '../../../test/factories/test-logger.factory'
import { RundownViewModule } from '../../rundown-view.module'

describe('MinishelfComponent', () => {
  it('should create', async () => {
    const component: MinishelfComponent = await configureTestBed()
    expect(component).toBeTruthy()
  })
})
async function configureTestBed(): Promise<MinishelfComponent> {
  await TestBed.configureTestingModule({
    declarations: [MinishelfComponent],
    providers: [{ provide: Logger, useValue: createLogger() }],
    imports: [RundownViewModule],
  }).compileComponents()

  const fixture: ComponentFixture<MinishelfComponent> = TestBed.createComponent(MinishelfComponent)
  return fixture.componentInstance
}
function createLogger(): Logger {
  const testLoggerFactory: TestLoggerFactory = new TestLoggerFactory()
  return testLoggerFactory.createLogger()
}