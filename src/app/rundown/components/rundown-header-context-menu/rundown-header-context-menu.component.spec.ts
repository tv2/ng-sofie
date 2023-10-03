import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RundownHeaderContextMenuComponent } from './rundown-header-context-menu.component';
import {Rundown} from "../../../core/models/rundown";
import {instance, mock, when} from "@typestrong/ts-mockito";
import {RouterModule} from "@angular/router";
import {RundownService} from "../../../core/abstractions/rundown.service";

describe('HeaderContextMenuComponent', () => {
  it('should create', async () => {
    const mockedRundown: Rundown = getMockedRundown()
    const component: RundownHeaderContextMenuComponent = await configureTestBed()
    component.rundown = instance(mockedRundown)
    component.ngOnInit()
    expect(component).toBeTruthy();
  });
});

async function configureTestBed(params: { mockedRundownService?: RundownService} = {}): Promise<RundownHeaderContextMenuComponent> {
  const mockedRundownService = params.mockedRundownService ?? mock<RundownService>()
  await TestBed
      .configureTestingModule( {
        imports: [RouterModule.forRoot([])],
        providers: [
          { provide: RundownService, useValue: instance(mockedRundownService) },
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
