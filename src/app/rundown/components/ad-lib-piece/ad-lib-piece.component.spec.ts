import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdLibPieceComponent } from './ad-lib-piece.component';

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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
