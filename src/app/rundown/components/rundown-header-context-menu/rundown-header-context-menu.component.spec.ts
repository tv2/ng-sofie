import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RundownHeaderContextMenuComponent } from './rundown-header-context-menu.component';
import {Rundown} from "../../../core/models/rundown";
import {instance, mock, when} from "@typestrong/ts-mockito";
import {RouterModule} from "@angular/router";
import {RundownService} from "../../../core/abstractions/rundown.service";
import {DialogService} from "../../../shared/services/dialog.service";

describe('HeaderContextMenuComponent', () => {
  it('should create', async () => {
    const mockedRundown: Rundown = getMockedRundown()
    const component: RundownHeaderContextMenuComponent = await configureTestBed()
    component.rundown = instance(mockedRundown)
    expect(component).toBeTruthy();
  });
});

async function configureTestBed(params: { mockedRundownService?: RundownService, mockedDialogService?: DialogService} = {}): Promise<RundownHeaderContextMenuComponent> {
  const mockedRundownService = params.mockedRundownService ?? mock<RundownService>()
  const mockedDialogService = params.mockedDialogService ?? mock<DialogService>()
  await TestBed
      .configureTestingModule( {
        imports: [RouterModule.forRoot([])],
        providers: [
          { provide: RundownService, useValue: instance(mockedRundownService) },
          { provide: DialogService, useValue: instance(mockedDialogService)},
        ],
        declarations: [RundownHeaderContextMenuComponent]
      })
      .compileComponents()
  const fixture: ComponentFixture<RundownHeaderContextMenuComponent> = TestBed.createComponent(RundownHeaderContextMenuComponent)
  return fixture.componentInstance
}

function getMockedRundown(): Rundown {
  const mockedRundown = mock<Rundown>()
  when(mockedRundown.id).thenReturn('some-part-id')
  return mockedRundown
}
