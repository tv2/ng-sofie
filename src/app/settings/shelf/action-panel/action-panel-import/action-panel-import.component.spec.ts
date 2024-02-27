import { ComponentFixture, TestBed } from '@angular/core/testing'
import { mock } from '@typestrong/ts-mockito'
import { MatSnackBar } from '@angular/material/snack-bar'
import { ActionPanelImportComponent } from './action-panel-import.component'
import { ConfigurationParser } from 'src/app/shared/abstractions/configuration-parser.service'
import { ConfigurationService } from 'src/app/shared/services/configuration.service'

describe('ActionPanelImportComponent', () => {
  it('should create', async () => {
    const component = await configureTestBed()
    expect(component).toBeTruthy()
  })
})

async function configureTestBed(): Promise<ActionPanelImportComponent> {
  const mockedConfigurationService: ConfigurationService = mock<ConfigurationService>()
  const mockedConfigurationParser: ConfigurationParser = mock<ConfigurationParser>()
  const mockedMatSnackBar = mock<MatSnackBar>()
  await TestBed.configureTestingModule({
    providers: [
      { provide: ConfigurationService, useValue: mockedConfigurationService },
      { provide: ConfigurationParser, useValue: mockedConfigurationParser },
      { provide: MatSnackBar, useValue: mockedMatSnackBar },
    ],
    declarations: [ActionPanelImportComponent],
  }).compileComponents()

  const fixture: ComponentFixture<ActionPanelImportComponent> = TestBed.createComponent(ActionPanelImportComponent)
  return fixture.componentInstance
}
