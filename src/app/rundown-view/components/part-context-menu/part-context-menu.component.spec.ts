import { ComponentFixture, TestBed } from '@angular/core/testing'
import { PartContextMenuComponent } from './part-context-menu.component'
import { RundownService } from '../../../core/abstractions/rundown.service'
import { instance, mock } from '@typestrong/ts-mockito'
import { TestEntityFactory } from '../../../test/factories/test-entity.factory'

describe('PartContextMenuComponent', () => {
  let component: PartContextMenuComponent
  let fixture: ComponentFixture<PartContextMenuComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PartContextMenuComponent],
      providers: [{ provide: RundownService, useValue: instance(mock<RundownService>()) }],
    }).compileComponents()

    fixture = TestBed.createComponent(PartContextMenuComponent)
    component = fixture.componentInstance
    const testEntityFactory: TestEntityFactory = new TestEntityFactory()
    component.part = testEntityFactory.createPart()
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
