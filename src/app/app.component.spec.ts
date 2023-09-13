import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { ConnectionErrorService } from './shared/services/connection-error.service'
import { instance, mock } from '@typestrong/ts-mockito'

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent,
      ],
    }).compileComponents()
  })

  it('should create the app', async () => {
    await configureTestBed()
    const fixture = TestBed.createComponent(AppComponent)
    const app = fixture.componentInstance
    expect(app).toBeTruthy()
  })
})

async function configureTestBed(): Promise<void> {
  const mockedConnectionErrorService: ConnectionErrorService = mock<ConnectionErrorService>()
  await TestBed
      .configureTestingModule({
        imports: [
          RouterTestingModule
        ],
        declarations: [
          AppComponent,
        ],
        providers: [
          { provide: ConnectionErrorService, useValue: instance(mockedConnectionErrorService) },
        ],
      })
      .compileComponents()
}
