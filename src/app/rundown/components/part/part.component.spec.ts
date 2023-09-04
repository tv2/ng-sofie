import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartComponent } from './part.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { instance, mock, when } from '@typestrong/ts-mockito'
import { Part } from '../../../core/models/part'

describe('PartComponent', () => {
  let component: PartComponent;
  let fixture: ComponentFixture<PartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule],
      declarations: [ PartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    const mockedPart = getMockedPart()
    component.part = instance(mockedPart)
    fixture.detectChanges()
    expect(component).toBeTruthy();
  });
});

function getMockedPart(): Part {
  const mockedPart = mock<Part>()
  when(mockedPart.id).thenReturn('some-part-id')
  when(mockedPart.segmentId).thenReturn('some-segment-id')
  when(mockedPart.isOnAir).thenReturn(false)
  when(mockedPart.isNext).thenReturn(false)
  when(mockedPart.pieces).thenReturn([])
  when(mockedPart.adLibPieces).thenReturn([])
  return mockedPart
}
