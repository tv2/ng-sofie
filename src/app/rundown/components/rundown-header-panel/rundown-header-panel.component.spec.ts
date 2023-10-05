import { ComponentFixture, TestBed } from '@angular/core/testing'

import { RundownHeaderPanelComponent } from './rundown-header-panel.component'

describe('RundownHeaderPanelComponent', () => {
  let component: RundownHeaderPanelComponent
  let fixture: ComponentFixture<RundownHeaderPanelComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RundownHeaderPanelComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(RundownHeaderPanelComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
