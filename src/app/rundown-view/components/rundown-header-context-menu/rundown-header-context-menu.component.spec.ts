import { ComponentFixture, TestBed } from '@angular/core/testing'
import { RundownHeaderContextMenuComponent } from './rundown-header-context-menu.component'
import { Rundown } from '../../../core/models/rundown'
import { instance, mock, when } from '@typestrong/ts-mockito'
import { RouterModule } from '@angular/router'
import { RundownService } from '../../../core/abstractions/rundown.service'
import { DialogService } from '../../../shared/services/dialog.service'
import { RundownStateService } from '../../../core/services/rundown-state.service'
import { BasicRundownStateService } from '../../../core/services/basic-rundown-state.service'

describe(RundownHeaderContextMenuComponent.name, () => {
  it('should create', async () => {
    const mockedRundown: Rundown = getMockedRundown()
    const component: RundownHeaderContextMenuComponent = await configureTestBed()
    component.rundown = instance(mockedRundown)
    expect(component).toBeTruthy()
  })
})

async function configureTestBed(
  params: {
    mockedBasicRundownStateService?: BasicRundownStateService
    mockedRundownStateService?: RundownStateService
    mockedRundownService?: RundownService
    mockedDialogService?: DialogService
  } = {}
): Promise<RundownHeaderContextMenuComponent> {
  const mockedBasicRundownStateService: BasicRundownStateService = params.mockedBasicRundownStateService ?? mock<BasicRundownStateService>()
  const mockedRundownStateService: RundownStateService = params.mockedRundownStateService ?? mock<RundownStateService>()
  const mockedRundownService = params.mockedRundownService ?? mock<RundownService>()
  const mockedDialogService = params.mockedDialogService ?? mock<DialogService>()
  await TestBed.configureTestingModule({
    imports: [RouterModule.forRoot([])],
    providers: [
      { provide: BasicRundownStateService, useValue: instance(mockedBasicRundownStateService) },
      { provide: RundownStateService, useValue: instance(mockedRundownStateService) },
      { provide: RundownService, useValue: instance(mockedRundownService) },
      { provide: DialogService, useValue: instance(mockedDialogService) },
    ],
    declarations: [RundownHeaderContextMenuComponent],
  }).compileComponents()
  const fixture: ComponentFixture<RundownHeaderContextMenuComponent> = TestBed.createComponent(RundownHeaderContextMenuComponent)
  return fixture.componentInstance
}

function getMockedRundown(): Rundown {
  const mockedRundown = mock<Rundown>()
  when(mockedRundown.id).thenReturn('some-part-id')
  return mockedRundown
}
