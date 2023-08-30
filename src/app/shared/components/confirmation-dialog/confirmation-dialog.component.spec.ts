import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import { MatDialogModule } from '@angular/material/dialog'

describe('ConfirmationDialogComponent', () => {
  let component: ConfirmationDialogComponent;
  let fixture: ComponentFixture<ConfirmationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDialogModule],
      declarations: [ConfirmationDialogComponent],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
