import { ComponentFixture, TestBed } from '@angular/core/testing'
import { OffsetablePieceComponent } from './offsetable-piece.component'
import { instance, mock } from '@typestrong/ts-mockito'
import { MediaStateService } from '../../../shared/services/media-state.service'
import { ChangeDetectorRef } from '@angular/core'
import { TestEntityFactory } from 'src/app/test/factories/test-entity.factory'

describe(OffsetablePieceComponent.name, () => {
  let component: OffsetablePieceComponent
  let fixture: ComponentFixture<OffsetablePieceComponent>

  beforeEach(async () => {
    const mockMediaStateService: MediaStateService = mock<MediaStateService>()
    const mockChangeDetectorRef: ChangeDetectorRef = mock<ChangeDetectorRef>()
    await TestBed.configureTestingModule({
      declarations: [OffsetablePieceComponent],
      providers: [
        { provide: MediaStateService, useValue: instance(mockMediaStateService) },
        { provide: ChangeDetectorRef, useValue: instance(mockChangeDetectorRef) },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(OffsetablePieceComponent)
    component = fixture.componentInstance
  })

  it('should NOT render text inside label div when isSpanning is true', () => {
    const mockedPiece = TestEntityFactory.createPiece({ isSpanning: true, metadata: { type: 'testing' } })
    component.piece = mockedPiece
    fixture.detectChanges()

    const isSpanning = fixture.componentInstance.piece.isSpanning
    const label = fixture.nativeElement.querySelector('div.label span')

    expect(label).toBeNull()
    expect(isSpanning).toBeTruthy()
  })

  it('should render text inside label div when isSpanning is undefined', () => {
    const mockedPiece = TestEntityFactory.createPiece({ isSpanning: undefined, metadata: { type: 'testing' } })
    component.piece = mockedPiece
    fixture.detectChanges()

    const isSpanning = fixture.componentInstance.piece.isSpanning
    const label = fixture.nativeElement.querySelector('div.label span')

    expect(label).toBeTruthy()
    expect(isSpanning).toBeFalsy()
  })
})
