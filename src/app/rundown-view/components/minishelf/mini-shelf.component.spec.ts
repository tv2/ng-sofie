import { ComponentFixture, TestBed } from '@angular/core/testing'
import { MiniShelfComponent } from './mini-shelf.component'

describe('MiniShelfComponent', () => {
  it('should create', async () => {
    const component: MiniShelfComponent = await configureTestBed()
    expect(component).toBeTruthy()
  })
})
async function configureTestBed(): Promise<MiniShelfComponent> {
  await TestBed.configureTestingModule({
    declarations: [MiniShelfComponent],
  }).compileComponents()

  const fixture: ComponentFixture<MiniShelfComponent> = TestBed.createComponent(MiniShelfComponent)
  return fixture.componentInstance
}
