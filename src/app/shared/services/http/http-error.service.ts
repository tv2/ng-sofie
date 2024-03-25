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

  public catchError(httpErrorResponse: HttpErrorResponse): Observable<never> {
    this.logger.data(httpErrorResponse).error('Caught Error:')
    this.createNotificationIfError(httpErrorResponse)
    return EMPTY
  }

  private createNotificationIfError(httpErrorResponse: HttpErrorResponse): void {
    if (httpErrorResponse.status >= 500) {
      this.notificationService.createErrorNotification(httpErrorResponse.error?.message ?? httpErrorResponse.message)
      return
    }
    if (httpErrorResponse.status >= 300) {
      this.notificationService.createWarningNotification(httpErrorResponse.error?.message ?? httpErrorResponse.message)
      return
    }
    if (httpErrorResponse.status >= 200 && httpErrorResponse.status < 300) {
      return
    }
  }
}
