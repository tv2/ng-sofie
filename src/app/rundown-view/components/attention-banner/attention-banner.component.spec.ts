import { ComponentFixture, TestBed } from '@angular/core/testing'

import { AttentionBannerComponent } from './attention-banner.component'

describe('AttentionBannerComponent', () => {
  let component: AttentionBannerComponent
  let fixture: ComponentFixture<AttentionBannerComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AttentionBannerComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(AttentionBannerComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
