import { RundownEventService } from './rundown-event.service';
import { MatSnackBar } from '@angular/material/snack-bar'
import { instance, mock } from '@typestrong/ts-mockito'

describe('RundownEventService', () => {
  it('should be created', () => {
    const mockedSnackbar = mock(MatSnackBar)
    const service = new RundownEventService(instance(mockedSnackbar))
    expect(service).toBeTruthy();
  });
});
