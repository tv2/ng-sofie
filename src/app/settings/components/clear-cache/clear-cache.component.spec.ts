import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ClearCacheComponent } from './clear-cache.component'

describe('ClearCacheComponent', () => {
  it('should create', async () => {
    const component = await configureTestBed()
    expect(component).toBeTruthy()
  })
})

async function configureTestBed(): Promise<ClearCacheComponent> {
  await TestBed.configureTestingModule({
    providers: [],
    declarations: [ClearCacheComponent],
  }).compileComponents()

  const fixture: ComponentFixture<ClearCacheComponent> = TestBed.createComponent(ClearCacheComponent)
  return fixture.componentInstance
}
