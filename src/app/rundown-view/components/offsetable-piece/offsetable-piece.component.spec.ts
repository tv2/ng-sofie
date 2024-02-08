import { ComponentFixture, TestBed } from '@angular/core/testing'

import { OffsetablePieceComponent } from './offsetable-piece.component'
import { instance, mock } from '@typestrong/ts-mockito'
import { Tv2Piece } from 'src/app/core/models/tv2-piece'

describe(OffsetablePieceComponent.name, () => {
  let component: OffsetablePieceComponent
  let fixture: ComponentFixture<OffsetablePieceComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OffsetablePieceComponent],
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
