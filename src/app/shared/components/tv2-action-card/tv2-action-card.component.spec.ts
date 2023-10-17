import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tv2ActionCardComponent } from './tv2-action-card.component';

describe('ActionCardComponent', () => {
  let component: Tv2ActionCardComponent;
  let fixture: ComponentFixture<Tv2ActionCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Tv2ActionCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Tv2ActionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
