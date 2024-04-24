import { ComponentFixture, TestBed } from '@angular/core/testing'
import { instance, mock } from '@typestrong/ts-mockito'
import { PieceTooltipComponent } from './piece-tooltip.component'
import { TestEntityFactory } from 'src/app/test/factories/test-entity.factory'
import { ChangeDetectorRef } from '@angular/core'
import { Tv2PieceTooltipContentFieldService } from '../../../services/tv2-piece-tooltip-content-field.service'

describe('PieceTooltipComponent', () => {
  let component: PieceTooltipComponent
  let fixture: ComponentFixture<PieceTooltipComponent>

  beforeEach(async () => {
    const mockChangeDetectorRef: ChangeDetectorRef = mock<ChangeDetectorRef>()
    const mockPieceTooltipContentFieldService: Tv2PieceTooltipContentFieldService = mock<Tv2PieceTooltipContentFieldService>()
    await TestBed.configureTestingModule({
      declarations: [PieceTooltipComponent],
      providers: [
        { provide: ChangeDetectorRef, useValue: instance(mockChangeDetectorRef) },
        { provide: Tv2PieceTooltipContentFieldService, useValue: instance(mockPieceTooltipContentFieldService) },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(PieceTooltipComponent)
    component = fixture.componentInstance
  })

  it('should create', () => {
    component.piece = TestEntityFactory.createPiece()
    expect(component).toBeTruthy()
  })
})
