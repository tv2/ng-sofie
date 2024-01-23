import { ComponentFixture, TestBed } from '@angular/core/testing'
import { SettingsComponent } from './settings.component'

describe('SettingsComponent', () => {
  it('should create', async () => {
    const component = await configureTestBed()
    expect(component).toBeTruthy()
  })
})

async function configureTestBed(): Promise<SettingsComponent> {
  await TestBed.configureTestingModule({
    providers: [],
    declarations: [SettingsComponent],
  }).compileComponents()

  const fixture: ComponentFixture<SettingsComponent> = TestBed.createComponent(SettingsComponent)
  return fixture.componentInstance
}
