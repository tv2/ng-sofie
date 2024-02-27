import { ComponentFixture, TestBed } from '@angular/core/testing'
import { MultiSelectComponent } from './multi-select.component'
import { MatMenuModule } from '@angular/material/menu'

describe('MultiSelectComponent', () => {
  let component: MultiSelectComponent
  let fixture: ComponentFixture<MultiSelectComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MultiSelectComponent],
      imports: [MatMenuModule],
    }).compileComponents()

    fixture = TestBed.createComponent(MultiSelectComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
