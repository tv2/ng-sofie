import { TestBed } from '@angular/core/testing'
import { Segment } from 'src/app/core/models/segment'

import { SegmentComponent } from './segment.component'
import { instance, mock, when } from '@typestrong/ts-mockito'
import { Tv2OutputLayerService } from '../../../shared/services/tv2-output-layer.service'
import { SegmentEntityService } from '../../../core/services/models/segment-entity.service'
import { PartEntityService } from '../../../core/services/models/part-entity.service'
import { RundownService } from '../../../core/abstractions/rundown.service'
import { SharedModule } from '../../../shared/shared.module'
import { Logger } from '../../../core/abstractions/logger.service'
import { TestLoggerFactory } from '../../../test/factories/test-logger.factory'

describe('SegmentComponent', () => {
  it('should create', async () => {
    await configureTestBed()
    const fixture = TestBed.createComponent(SegmentComponent)
    const component = fixture.componentInstance
    const mockedSegment = getMockedSegment()
    component.segment = instance(mockedSegment)
    expect(component).toBeTruthy()
  })
})

function getMockedSegment(): Segment {
  const mockedSegment = mock<Segment>()
  when(mockedSegment.id).thenReturn('some-part-id')
  when(mockedSegment.rundownId).thenReturn('some-rundown-id')
  when(mockedSegment.name).thenReturn('some-segment-name')
  when(mockedSegment.isOnAir).thenReturn(false)
  when(mockedSegment.isNext).thenReturn(false)
  when(mockedSegment.parts).thenReturn([])
  return mockedSegment
}

async function configureTestBed(): Promise<void> {
  const mockedOutputLayerService: Tv2OutputLayerService = mock<Tv2OutputLayerService>()
  const mockedSegmentEntityService: SegmentEntityService = mock<SegmentEntityService>()
  const mockedPartEntityService: PartEntityService = mock<PartEntityService>()
  const mockedRundownService: RundownService = mock<RundownService>()
  await TestBed.configureTestingModule({
    declarations: [SegmentComponent],
    providers: [
      { provide: Tv2OutputLayerService, useValue: instance(mockedOutputLayerService) },
      { provide: SegmentEntityService, useValue: instance(mockedSegmentEntityService) },
      { provide: PartEntityService, useValue: instance(mockedPartEntityService) },
      { provide: RundownService, useValue: instance(mockedRundownService) },
      { provide: Logger, useValue: createLogger() },
    ],
    imports: [SharedModule],
  }).compileComponents()
}

function createLogger(): Logger {
  const testLoggerFactory: TestLoggerFactory = new TestLoggerFactory()
  return testLoggerFactory.createLogger()
}
