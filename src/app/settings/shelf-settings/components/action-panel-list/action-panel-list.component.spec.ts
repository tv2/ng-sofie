import { ComponentFixture, TestBed } from '@angular/core/testing'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { instance, mock } from '@typestrong/ts-mockito'
import { ActionPanelListComponent } from './action-panel-list.component'
import { ConfigurationService } from 'src/app/shared/services/configuration.service'
import { DialogService } from 'src/app/shared/services/dialog.service'
import { FileDownloadService } from 'src/app/shared/abstractions/file-download.service'
import { TranslationActionTypePipe } from 'src/app/shared/pipes/translation-known-values.pipe'

describe('ActionPanelListComponent', () => {
  it('should create', async () => {
    const component = await configureTestBed()
    expect(component).toBeTruthy()
  })
})

async function configureTestBed(): Promise<ActionPanelListComponent> {
  const mockedConfigurationService: ConfigurationService = mock<ConfigurationService>()
  const mockedDialogService: DialogService = mock<DialogService>()
  const mockedFileDownloadService: FileDownloadService = mock<FileDownloadService>()
  const mockedTranslationKnownValuesPipe: TranslationActionTypePipe = mock<TranslationActionTypePipe>()
  await TestBed.configureTestingModule({
    providers: [
      { provide: ConfigurationService, useValue: instance(mockedConfigurationService) },
      { provide: DialogService, useValue: instance(mockedDialogService) },
      { provide: FileDownloadService, useValue: instance(mockedFileDownloadService) },
      { provide: TranslationActionTypePipe, useValue: instance(mockedTranslationKnownValuesPipe) },
    ],
    declarations: [ActionPanelListComponent],
    imports: [ReactiveFormsModule, FormsModule],
  }).compileComponents()

  const fixture: ComponentFixture<ActionPanelListComponent> = TestBed.createComponent(ActionPanelListComponent)
  return fixture.componentInstance
}
