import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Segment } from 'src/app/core/models/segment';

import { SegmentComponent } from './segment.component';
import { instance, mock, when } from '@typestrong/ts-mockito'

describe('SegmentComponent', () => {
  let component: SegmentComponent;
  let fixture: ComponentFixture<SegmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SegmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SegmentComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    const mockedSegment = getMockedSegment()
    component.segment = instance(mockedSegment)
    expect(component).toBeTruthy();
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
