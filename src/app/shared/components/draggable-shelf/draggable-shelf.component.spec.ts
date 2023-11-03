import { ComponentFixture, TestBed } from '@angular/core/testing'

import { DraggableShelfComponent } from './draggable-shelf.component'

describe('DraggableShelfComponent', () => {
  let component: DraggableShelfComponent
  let fixture: ComponentFixture<DraggableShelfComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DraggableShelfComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(DraggableShelfComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
