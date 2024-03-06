import { ComponentFixture, TestBed } from '@angular/core/testing'
import { MultiSelectOldComponent } from './multi-select-component-old.component'
import { MatMenuModule } from '@angular/material/menu'

describe('MultiSelectComponent', () => {
  let component: MultiSelectOldComponent
  let fixture: ComponentFixture<MultiSelectOldComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MultiSelectOldComponent],
      imports: [MatMenuModule],
    }).compileComponents()

    fixture = TestBed.createComponent(MultiSelectOldComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
