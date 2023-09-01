import { HttpErrorService } from './http-error.service';
import { MatSnackBar } from '@angular/material/snack-bar'
import { instance, mock } from '@typestrong/ts-mockito'

describe('HttpErrorService', () => {
  it('should be created', () => {
    const mockedMatSnackBar = mock<MatSnackBar>()
    const service = new HttpErrorService(instance(mockedMatSnackBar))
    expect(service).toBeTruthy();
  });
});
