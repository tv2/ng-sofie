import { ComponentFixture, TestBed } from '@angular/core/testing'
import { SharedModule } from '../../../shared/shared.module'
import { StickySegmentComponent } from './sticky-segment.component'
import { TestEntityFactory } from '../../../test/factories/test-entity.factory'

describe('SegmentComponent', () => {
  it('should create', async () => {
    await configureTestBed()
    const fixture: ComponentFixture<StickySegmentComponent> = TestBed.createComponent(StickySegmentComponent)
    const component: StickySegmentComponent = fixture.componentInstance
    component.segment = TestEntityFactory.createSegment()
    expect(component).toBeTruthy()
  })
})

async function configureTestBed(): Promise<void> {
  await TestBed.configureTestingModule({
    declarations: [StickySegmentComponent],
    providers: [],
    imports: [SharedModule],
  }).compileComponents()
}
