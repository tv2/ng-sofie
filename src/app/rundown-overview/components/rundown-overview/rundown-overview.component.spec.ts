import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RundownOverviewComponent } from './rundown-overview.component';
import { instance, mock } from '@typestrong/ts-mockito'
import { HttpRundownService } from '../../../core/services/http-rundown.service'
import { DialogService } from '../../../shared/services/dialog.service'
import { BasicRundownStateService } from '../../../core/services/basic-rundown-state.service'

describe('RundownOverviewComponent', () => {
  it('should create', async () => {
    const component = await configureTestBed()
    expect(component).toBeTruthy();
  });
});

async function configureTestBed(params: { mockedRundownService?: HttpRundownService, mockedDialogService?: DialogService, mockedBasicRundownStateService?: BasicRundownStateService } = {}): Promise<RundownOverviewComponent> {
  const mockedRundownService = params.mockedRundownService ?? mock<HttpRundownService>()
  const mockedBasicRundownStateService = params.mockedBasicRundownStateService ?? mock<BasicRundownStateService>()
  const mockedDialogService = params.mockedDialogService ?? mock<DialogService>()
  await TestBed
      .configureTestingModule({
        providers: [
          { provide: BasicRundownStateService, useValue: instance(mockedBasicRundownStateService) },
          { provide: HttpRundownService, useValue: instance(mockedRundownService) },
          { provide: DialogService, useValue: instance(mockedDialogService) },
        ],
        declarations: [RundownOverviewComponent]
      })
      .compileComponents()

  const fixture: ComponentFixture<RundownOverviewComponent> = TestBed.createComponent(RundownOverviewComponent)
  return fixture.componentInstance
}
