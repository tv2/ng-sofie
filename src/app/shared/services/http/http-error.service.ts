import { Injectable } from '@angular/core'
import { HttpErrorResponse } from '@angular/common/http'
import { EMPTY, Observable } from 'rxjs'
import { Logger } from '../../../core/abstractions/logger.service'
import { NotificationService } from '../notification.service'

@Injectable()
export class HttpErrorService {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly logger: Logger
  ) {}

  public catchError(error: HttpErrorResponse): Observable<never> {
    this.logger.data(error).error('Caught Error:')
    this.createNotificationIfError(error)
    return EMPTY
  }

  private createNotificationIfError(error: HttpErrorResponse): void {
    if (error.status >= 500) {
      this.notificationService.createErrorNotification(error.message)
      return
    }
    if (error.status >= 300) {
      this.notificationService.createWarningNotification(error.message)
      return
    }
    if (error.status >= 200 && error.status < 300) {
      return
    }
  }
}
