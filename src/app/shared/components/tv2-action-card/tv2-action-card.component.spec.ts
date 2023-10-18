import { ComponentFixture, TestBed } from '@angular/core/testing'

import { Tv2ActionCardComponent } from './tv2-action-card.component'
import { Tv2ActionContentType } from '../../models/tv2-action'
import { PartActionType } from '../../models/action-type'

describe('ActionCardComponent', () => {
  let component: Tv2ActionCardComponent
  let fixture: ComponentFixture<Tv2ActionCardComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Tv2ActionCardComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(Tv2ActionCardComponent)
    component = fixture.componentInstance
    component.action = {
      id: 'some-camera-action',
      metadata: { contentType: Tv2ActionContentType.CAMERA },
      name: '',
      type: PartActionType.INSERT_PART_AS_ON_AIR,
    }
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
