import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ConfirmationDialogComponent } from './confirmation-dialog.component'
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog'

describe('ConfirmationDialogComponent', () => {
  it('should create', async () => {
    const component = await configureTestBed()
    expect(component).toBeTruthy()
  })
})
async function configureTestBed(): Promise<ConfirmationDialogComponent> {
  await TestBed.configureTestingModule({
    imports: [MatDialogModule],
    providers: [
      { provide: MAT_DIALOG_DATA, useValue: {} },
      { provide: MatDialogRef, useValue: {} },
    ],
    declarations: [ConfirmationDialogComponent],
  }).compileComponents()

  const fixture: ComponentFixture<ConfirmationDialogComponent> = TestBed.createComponent(ConfirmationDialogComponent)
  return fixture.componentInstance
}
