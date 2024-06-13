import { ComponentFixture, TestBed } from '@angular/core/testing'
import { instance, mock } from '@typestrong/ts-mockito'
import { InvalidPartTooltipComponent } from './invalid-part-tooltip.component'
import { ChangeDetectorRef } from '@angular/core'
import { Tv2PieceTooltipContentFieldService } from '../../../services/tv2-piece-tooltip-content-field.service'

describe('InvalidPartTooltipComponent', () => {
  let component: InvalidPartTooltipComponent
  let fixture: ComponentFixture<InvalidPartTooltipComponent>

  beforeEach(async () => {
    const mockChangeDetectorRef: ChangeDetectorRef = mock<ChangeDetectorRef>()
    const mockPieceTooltipContentFieldService: Tv2PieceTooltipContentFieldService = mock<Tv2PieceTooltipContentFieldService>()
    await TestBed.configureTestingModule({
      declarations: [InvalidPartTooltipComponent],
      providers: [
        { provide: ChangeDetectorRef, useValue: instance(mockChangeDetectorRef) },
        { provide: Tv2PieceTooltipContentFieldService, useValue: instance(mockPieceTooltipContentFieldService) },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(InvalidPartTooltipComponent)
    component = fixture.componentInstance
  })

  it('should create', () => {
    component.invalidity = { reason: 'The invalidity reason' }
    expect(component).toBeTruthy()
  })
})
