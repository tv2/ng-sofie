import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'
import { SelectOption } from '../../models/select-option'
import { Subject, takeUntil } from 'rxjs'
import { ClickService } from '../../services/click.service'

@Component({
  selector: 'sofie-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: SelectComponent,
    },
  ],
})
export class SelectComponent<T> implements OnInit, OnDestroy, ControlValueAccessor {
  @Input() public options: SelectOption<T>[] = []

  @Input() public className: string
  @Input() public label: string
  @Input() public placeholder?: string

  @Output() public onChange: EventEmitter<T> = new EventEmitter()

  public selectedOption: SelectOption<T>
  public isShown: boolean = false

  private onChangeCallback: (value: T) => void
  private onTouchedCallback: () => void

  private value: T

  private isTouched: boolean = false

  private readonly destroySubject: Subject<void> = new Subject()

  constructor(private readonly clickService: ClickService) {}

  public ngOnInit(): void {
    this.clickService.clickObservable.pipe(takeUntil(this.destroySubject)).subscribe(click => this.onDocumentClick(click))
  }

  private onDocumentClick(clickEvent: MouseEvent): void {
    if (!this.isShown) {
      return
    }
    if (!this.isSelectElementClicked(clickEvent)) {
      this.isShown = false
    }
  }

  private isSelectElementClicked(clickEvent: MouseEvent): boolean {
    const allClassNames = []
    let clickTarget: Element = clickEvent.target as Element
    while (clickTarget) {
      allClassNames.push(...clickTarget.classList.value.split(' '))
      if (!clickTarget.parentElement) {
        break
      }
      clickTarget = clickTarget.parentElement
    }
    return !!allClassNames.find(className => className === this.className)
  }

  public selectOption(option: SelectOption<T>): void {
    this.markAsTouched()
    this.selectedOption = option
    this.value = option.value
    this.onChange.emit(this.value)
    this.onChangeCallback?.(this.value)
    this.isShown = false
  }

  private markAsTouched(): void {
    if (this.isTouched || !this.onTouchedCallback) {
      return
    }
    this.onTouchedCallback()
    this.isTouched = true
  }

  public writeValue(value: T): void {
    this.value = value
    this.updateSelectedOptionFromValue()
  }

  private updateSelectedOptionFromValue(): void {
    const option: SelectOption<T> | undefined = this.options.find(option => option.value === this.value)
    if (!option) {
      return
    }
    this.selectedOption = option
  }

  public toggleSelectShown(): void {
    this.isShown = !this.isShown
  }

  public registerOnChange(changeCallback: (value: T) => void): void {
    this.onChangeCallback = changeCallback
  }

  public registerOnTouched(touchedCallback: () => void): void {
    this.onTouchedCallback = touchedCallback
  }

  public ngOnDestroy(): void {
    this.destroySubject.next()
    this.destroySubject.complete()
  }
}
