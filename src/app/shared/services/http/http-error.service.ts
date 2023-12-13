import { Injectable } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'
import { HttpErrorResponse } from '@angular/common/http'
import { EMPTY, Observable } from 'rxjs'
import { Logger } from '../../../core/abstractions/logger.service'

@Injectable()
export class HttpErrorService {
  constructor(
    private readonly snackBar: MatSnackBar,
    private readonly logger: Logger
  ) {}

  public catchError(error: HttpErrorResponse): Observable<never> {
    this.logger.data(error).error('Caught Error:')
    this.openSnackBarIfError(error)
    return EMPTY
  }

  private openSnackBarIfError(error: HttpErrorResponse): void {
    if (error.status >= 200 && error.status < 300) {
      return
    }
    this.snackBar.open(error.error.message, 'DISMISS', {
      panelClass: [this.getSnackBarCss(error.status)],
    })
  }

  private getSnackBarCss(statusCode: number): string {
    if (statusCode >= 500) {
      return 'snackbar-danger'
    }
    if (statusCode >= 300) {
      return 'snackbar-warning'
    }
    // Unknown status - using default CSS
    return ''
  }
}
