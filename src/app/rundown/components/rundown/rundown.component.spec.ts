import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RundownComponent } from './rundown.component';
import { HttpRundownService } from '../../../core/services/http-rundown.service'
import { anyString, anything, instance, mock, when } from '@typestrong/ts-mockito'
import { ActivatedRoute, ActivatedRouteSnapshot, convertToParamMap, ParamMap, RouterModule } from '@angular/router'
import { RundownStateService } from '../../../core/services/rundown-state.service'
import { AdLibPieceService } from '../../../core/services/ad-lib-piece-service.interface'
import { of, Subscription } from 'rxjs'

describe('RundownComponent', () => {
  it('should create', async () => {
    const component = await configureTestBed()
    expect(component).toBeTruthy()
  })
})

async function configureTestBed(params: { mockedRundownService?: HttpRundownService, mockedRundownStateService?: RundownStateService, mockedAdLibPieceService?: AdLibPieceService } = {}): Promise<RundownComponent> {
  const mockedRundownService = params.mockedRundownService ?? mock<HttpRundownService>()
  const mockedRundownStateService = params.mockedRundownStateService ?? createMockOfRundownStateService()
  const mockedAdLibPieceService = params.mockedAdLibPieceService ?? createMockOfAdLibPieceService()
  await TestBed
      .configureTestingModule({
        imports: [RouterModule.forRoot([])],
        providers: [
          { provide: ActivatedRoute, useValue: instance(createMockOfActivatedRoute()) },
          { provide: HttpRundownService, useValue: instance(mockedRundownService) },
          { provide: RundownStateService, useValue: instance(mockedRundownStateService) },
          { provide: AdLibPieceService, useValue: instance(mockedAdLibPieceService) },
        ],
        declarations: [RundownComponent]
      })
      .compileComponents()

  const fixture: ComponentFixture<RundownComponent> = TestBed.createComponent(RundownComponent)
  const component = fixture.componentInstance
  component.ngOnInit()
  return component
}

function createMockOfRundownStateService(): RundownStateService {
    const mockedRundownStateService = mock<RundownStateService>()
    const mockedSubscription = mock<Subscription>()
    when(mockedRundownStateService.subscribeToRundown(anyString(), anything())).thenResolve(instance(mockedSubscription))
    return mockedRundownStateService
}

function createMockOfAdLibPieceService(): AdLibPieceService {
    const mockedAdLibPieceService = mock<AdLibPieceService>()
    when(mockedAdLibPieceService.fetchAdLibPieceIdentifiers(anyString())).thenReturn(of([]))
    return mockedAdLibPieceService
}

function createMockOfActivatedRoute(params: { paramMap?: ParamMap } = {}): ActivatedRoute {
    const paramMap: ParamMap = params.paramMap ?? convertToParamMap({ rundownId: 'some-rundown-id' })
    const mockedActivatedRouteSnapshot: ActivatedRouteSnapshot = mock<ActivatedRouteSnapshot>()
    when(mockedActivatedRouteSnapshot.paramMap).thenReturn(paramMap)

    const mockedActivatedRoute: ActivatedRoute = mock<ActivatedRoute>()
    when(mockedActivatedRoute.snapshot).thenReturn(instance(mockedActivatedRouteSnapshot))

    return mockedActivatedRoute
}
