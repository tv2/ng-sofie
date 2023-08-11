import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdLibPieceIdentifierComponent } from './ad-lib-piece-identifier.component';

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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
