import { ComponentFixture, TestBed } from '@angular/core/testing'
import { SegmentContextMenuComponent } from './segment-context-menu.component'
import { RundownService } from '../../../core/abstractions/rundown.service'
import { instance, mock } from '@typestrong/ts-mockito'

describe('SegmentContextMenuComponent', () => {
  let component: SegmentContextMenuComponent
  let fixture: ComponentFixture<SegmentContextMenuComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SegmentContextMenuComponent],
      providers: [{ provide: RundownService, useValue: instance(mock<RundownService>()) }],
    }).compileComponents()

    fixture = TestBed.createComponent(SegmentContextMenuComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
