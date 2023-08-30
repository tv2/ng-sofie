import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdLibPieceIdentifierComponent } from './ad-lib-piece-identifier.component';
import { instance, mock } from '@typestrong/ts-mockito'
import { Identifier } from '../../../core/models/identifier'

describe('AdLibPieceIdentifierComponent', () => {
  let component: AdLibPieceIdentifierComponent;
  let fixture: ComponentFixture<AdLibPieceIdentifierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdLibPieceIdentifierComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdLibPieceIdentifierComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    const mockedIdentifier = mock<Identifier>()
    component.adLibPieceIdentifier = instance(mockedIdentifier)
    expect(component).toBeTruthy();
  });
});
