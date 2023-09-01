import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RundownOverviewComponent } from './rundown-overview.component';
import { RundownPlaylistService } from '../../../core/services/rundown-playlist.service'
import { instance, mock } from '@typestrong/ts-mockito'
import { RundownService } from '../../../core/services/rundown.service'
import { DialogService } from '../../../shared/services/dialog.service'

describe('RundownOverviewComponent', () => {
  it('should create', async () => {
    const component = await configureTestBed()
    expect(component).toBeTruthy();
  });
});

async function configureTestBed(params: { mockedRundownPlaylistService?: RundownPlaylistService, mockedRundownService?: RundownService, mockedDialogService?: DialogService } = {}): Promise<RundownOverviewComponent> {
  const mockedRundownPlaylistService = params.mockedRundownPlaylistService ?? createMockOfRundownPlaylistService()
  const mockedRundownService = params.mockedRundownService ?? createMockOfRundownService()
  const mockedDialogService = params.mockedDialogService ?? createMockOfDialogService()
  await TestBed
      .configureTestingModule({
        providers: [
          { provide: RundownPlaylistService, useValue: instance(mockedRundownPlaylistService) },
          { provide: RundownService, useValue: instance(mockedRundownService) },
          { provide: DialogService, useValue: instance(mockedDialogService) },
        ],
        declarations: [RundownOverviewComponent]
      })
      .compileComponents()

  const fixture: ComponentFixture<RundownOverviewComponent> = TestBed.createComponent(RundownOverviewComponent)
  return fixture.componentInstance
}

function createMockOfRundownPlaylistService(): RundownPlaylistService {
  return mock<RundownPlaylistService>()
}

function createMockOfRundownService(): RundownService {
    return mock<RundownService>()
}

function createMockOfDialogService(): DialogService {
    return mock<DialogService>()
}
