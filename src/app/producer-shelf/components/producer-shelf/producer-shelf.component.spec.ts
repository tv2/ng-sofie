import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ProducerShelfComponent } from './producer-shelf.component'

describe(ProducerShelfComponent.name, () => {
  let component: ProducerShelfComponent
  let fixture: ComponentFixture<ProducerShelfComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProducerShelfComponent],
      providers: [],
    }).compileComponents()

    fixture = TestBed.createComponent(ProducerShelfComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
