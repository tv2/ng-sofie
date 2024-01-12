import { ComponentFixture, TestBed } from '@angular/core/testing'
import { MiniShelfComponent } from './mini-shelf.component'
import { Logger } from '../../../core/abstractions/logger.service'
import { TestLoggerFactory } from '../../../test/factories/test-logger.factory'
import { RundownViewModule } from '../../rundown-view.module'

describe('MiniShelfComponent', () => {
  it('should create', async () => {
    const component: MiniShelfComponent = await configureTestBed()
    expect(component).toBeTruthy()
  })
})
async function configureTestBed(): Promise<MiniShelfComponent> {
  await TestBed.configureTestingModule({
    declarations: [MiniShelfComponent],
    providers: [{ provide: Logger, useValue: createLogger() }],
    imports: [RundownViewModule],
  }).compileComponents()

  const fixture: ComponentFixture<MiniShelfComponent> = TestBed.createComponent(MiniShelfComponent)
  return fixture.componentInstance
}
function createLogger(): Logger {
  const testLoggerFactory: TestLoggerFactory = new TestLoggerFactory()
  return testLoggerFactory.createLogger()
}
