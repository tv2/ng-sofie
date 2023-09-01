import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PieceComponent } from './piece.component';
import { Piece } from '../../../core/models/piece'
import { instance, mock } from '@typestrong/ts-mockito'

describe('PieceComponent', () => {
  let component: PieceComponent;
  let fixture: ComponentFixture<PieceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PieceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PieceComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    const mockedPiece = mock<Piece>()
    component.piece = instance(mockedPiece)
    expect(component).toBeTruthy();
  });
});
