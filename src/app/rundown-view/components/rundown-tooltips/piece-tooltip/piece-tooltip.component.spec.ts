import { ComponentFixture, TestBed } from '@angular/core/testing'
import { instance, mock } from '@typestrong/ts-mockito'
import { PieceTooltipComponent } from './piece-tooltip.component'
import { TestEntityFactory } from 'src/app/test/factories/test-entity.factory'
import { ChangeDetectorRef } from '@angular/core'

describe('PieceTooltipComponent', () => {
  let component: PieceTooltipComponent
  let fixture: ComponentFixture<PieceTooltipComponent>

  beforeEach(async () => {
    const mockChangeDetectorRef: ChangeDetectorRef = mock<ChangeDetectorRef>()
    await TestBed.configureTestingModule({
      declarations: [PieceTooltipComponent],
      providers: [{ provide: ChangeDetectorRef, useValue: instance(mockChangeDetectorRef) }],
    }).compileComponents()

    fixture = TestBed.createComponent(PieceTooltipComponent)
    component = fixture.componentInstance
  })

  it('should create', () => {
    const testEntityFactory: TestEntityFactory = new TestEntityFactory()
    const mockedPiece = testEntityFactory.createPiece()
    component.piece = mockedPiece
    expect(component).toBeTruthy()
  })
})
