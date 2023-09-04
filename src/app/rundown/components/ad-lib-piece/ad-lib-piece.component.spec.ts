import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdLibPieceComponent } from './ad-lib-piece.component';
import { AdLibPiece } from '../../../core/models/ad-lib-piece'
import { instance, mock } from '@typestrong/ts-mockito'

describe('AdLibPieceComponent', () => {
  let component: AdLibPieceComponent;
  let fixture: ComponentFixture<AdLibPieceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdLibPieceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdLibPieceComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    const mockedAdLibPiece = mock<AdLibPiece>()
    component.adLibPiece = instance(mockedAdLibPiece)
    expect(component).toBeTruthy();
  });
});
