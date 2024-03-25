import { ComponentFixture, TestBed } from '@angular/core/testing'
import { SettingsMenuComponent } from './settings-menu.component'

describe('SettingsMenuComponent', () => {
  it('should create', async () => {
    const component = await configureTestBed()
    expect(component).toBeTruthy()
  })
})

async function configureTestBed(): Promise<SettingsMenuComponent> {
  await TestBed.configureTestingModule({
    providers: [],
    declarations: [SettingsMenuComponent],
  }).compileComponents()

  const fixture: ComponentFixture<SettingsMenuComponent> = TestBed.createComponent(SettingsMenuComponent)
  return fixture.componentInstance
}
