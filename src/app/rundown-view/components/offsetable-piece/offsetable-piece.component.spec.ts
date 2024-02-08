import { ComponentFixture, TestBed } from '@angular/core/testing'

import { OffsetablePieceComponent } from './offsetable-piece.component'
import { instance, mock } from '@typestrong/ts-mockito'
import { Tv2Piece } from 'src/app/core/models/tv2-piece'
import { MediaStateService } from '../../../shared/services/media-state.service'
import { ChangeDetectorRef } from '@angular/core'

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

  it('should create', () => {
    const mockedPiece = mock<Tv2Piece>()
    component.piece = instance(mockedPiece)
    expect(component).toBeTruthy()
  })
})
