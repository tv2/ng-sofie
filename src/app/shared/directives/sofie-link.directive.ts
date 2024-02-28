import { Directive, HostListener, Input } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Logger } from 'src/app/core/abstractions/logger.service'

@Directive({ selector: '[sofieLink]' })
export class SofieLinkDirective {
  @Input() public routerLink: string[]
  @Input() public isRelativeToactivatedRoute: boolean

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly logger: Logger
  ) {
    this.logger = logger.tag('SofieLinksDirective')
  }

  @HostListener('mousedown', ['$event']) public onMouseEnter(event: MouseEvent): void {
    if (event.ctrlKey) {
      const linkString = this.routerLink.join('/')
      if (this.isRelativeToactivatedRoute) {
        const relativeUrl = this.activatedRoute.snapshot.parent?.url ? this.activatedRoute.snapshot.parent?.url.map(urlSegment => urlSegment.path).join('/') : ''
        window.open(`/${relativeUrl}/${linkString}`)
      } else {
        window.open(`/${linkString}`)
      }
    } else {
      if (this.isRelativeToactivatedRoute) {
        this.router.navigate(this.routerLink, { relativeTo: this.activatedRoute }).catch(error => this.logger.data(error).warn(`Failed navigating to /${this.routerLink.join('/')}.`))
      } else {
        this.router.navigate(this.routerLink).catch(error => this.logger.data(error).warn(`Failed navigating to /${this.routerLink.join('/')}.`))
      }
    }
  }
}
