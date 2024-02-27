import { ComponentFixture, TestBed } from '@angular/core/testing'
import { SofieTableHeaderComponent } from './sofie-table-header.component'

describe('SofieTableHeaderComponent', () => {
  let component: SofieTableHeaderComponent
  let fixture: ComponentFixture<SofieTableHeaderComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SofieTableHeaderComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(SofieTableHeaderComponent)
    component = fixture.componentInstance
    component.headerData = {
      key: 'Test',
    }
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
