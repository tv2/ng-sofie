import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ReactiveFormsModule } from '@angular/forms'
import { instance, mock } from '@typestrong/ts-mockito'
import { ActionTriggerService } from 'src/app/shared/abstractions/action-trigger.service'
import { EditActionPanelComponent } from './edit-action-panel.component'
import { TranslationActionTypePipe } from 'src/app/shared/pipes/translation-known-values.pipe'
import { ConfigurationService } from 'src/app/shared/services/configuration.service'

describe('EditActionPanelComponent', () => {
  it('should create', async () => {
    const component = await configureTestBed()
    expect(component).toBeTruthy()
  })
})

async function configureTestBed(): Promise<EditActionPanelComponent> {
  const mockedActionTriggerService: ActionTriggerService = mock<ActionTriggerService>()
  const mockedConfigurationService: ConfigurationService = mock<ConfigurationService>()
  const mockedTranslationKnownValuesPipe: TranslationActionTypePipe = mock<TranslationActionTypePipe>()
  await TestBed.configureTestingModule({
    providers: [
      { provide: ActionTriggerService, useValue: instance(mockedActionTriggerService) },
      { provide: ConfigurationService, useValue: instance(mockedConfigurationService) },
      { provide: TranslationActionTypePipe, useValue: instance(mockedTranslationKnownValuesPipe) },
    ],
    declarations: [EditActionPanelComponent],
    imports: [ReactiveFormsModule],
  }).compileComponents()

  const fixture: ComponentFixture<EditActionPanelComponent> = TestBed.createComponent(EditActionPanelComponent)
  return fixture.componentInstance
}
