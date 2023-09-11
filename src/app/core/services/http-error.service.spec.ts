import { HttpErrorService } from './http-error.service';
import { MatSnackBar } from '@angular/material/snack-bar'
import { instance, mock } from '@typestrong/ts-mockito'

describe('HttpErrorService', () => {
  it('should be created', () => {
    const mockedMatSnackBar = mock<MatSnackBar>()
    const testee = new HttpErrorService(instance(mockedMatSnackBar))
    expect(testee).toBeTruthy();
  });
});
