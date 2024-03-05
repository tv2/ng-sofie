import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ReactiveFormsModule } from '@angular/forms'
import { instance, mock } from '@typestrong/ts-mockito'
import { ActionPanelComponent } from './action-panel.component'
import { ShelfConfigurationStateService } from 'src/app/core/services/shelf-configuration-state.service'

describe('ActionPanelComponent', () => {
  it('should create', async () => {
    const component = await configureTestBed()
    expect(component).toBeTruthy()
  })
})

async function configureTestBed(): Promise<ActionPanelComponent> {
  const mockedShelfConfigurationStateService: ShelfConfigurationStateService = mock<ShelfConfigurationStateService>()
  await TestBed.configureTestingModule({
    providers: [{ provide: ShelfConfigurationStateService, useValue: instance(mockedShelfConfigurationStateService) }],
    declarations: [ActionPanelComponent],
    imports: [ReactiveFormsModule],
  }).compileComponents()

  const fixture: ComponentFixture<ActionPanelComponent> = TestBed.createComponent(ActionPanelComponent)
  return fixture.componentInstance
}
