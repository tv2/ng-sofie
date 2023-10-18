import { ComponentFixture, TestBed } from '@angular/core/testing'

import { Tv2ActionPanelComponent } from './tv2-action-panel.component'

describe('ActionPanelComponent', () => {
  let component: Tv2ActionPanelComponent
  let fixture: ComponentFixture<Tv2ActionPanelComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Tv2ActionPanelComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(Tv2ActionPanelComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
