import { TestBed } from '@angular/core/testing';
import { Segment } from 'src/app/core/models/segment';

import { SegmentComponent } from './segment.component';
import { instance, mock, when } from '@typestrong/ts-mockito'
import { PieceLayerService } from '../../../shared/services/piece-layer.service'
import { SegmentEntityService } from '../../../core/services/models/segment-entity.service'
import { PartEntityService } from '../../../core/services/models/part-entity.service'
import {RundownService} from "../../../core/abstractions/rundown.service";
import {SharedModule} from "../../../shared/shared.module";

describe('SegmentComponent', () => {
  it('should create', async () => {
    await configureTestBed()
    const fixture = TestBed.createComponent(SegmentComponent)
    const component = fixture.componentInstance
    const mockedSegment = getMockedSegment()
    component.segment = instance(mockedSegment)
    expect(component).toBeTruthy()
  });
});


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
  const mockedPieceLayerService: PieceLayerService = mock<PieceLayerService>()
  const mockedSegmentEntityService: SegmentEntityService = mock<SegmentEntityService>()
  const mockedPartEntityService: PartEntityService = mock<PartEntityService>()
  const mockedRundownService: RundownService = mock<RundownService>()
  await TestBed.configureTestingModule({
    declarations: [ SegmentComponent ],
    providers: [
      { provide: PieceLayerService, useValue: instance(mockedPieceLayerService) },
      { provide: SegmentEntityService, useValue: instance(mockedSegmentEntityService) },
      { provide: PartEntityService, useValue: instance(mockedPartEntityService) },
      { provide: RundownService, useValue: instance(mockedRundownService) },
    ],
    imports: [ SharedModule ]
  }).compileComponents()
}
