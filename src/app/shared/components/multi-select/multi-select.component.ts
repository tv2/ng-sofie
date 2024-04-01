import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { Icon, IconSize } from '../../enums/icon'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'
import { SelectOption } from '../../models/select-option'
import { ClickService } from '../../services/click.service'

interface SelectableOption<T> extends SelectOption<T> {
  isSelected: boolean
}

@Component({
  selector: 'sofie-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: MultiSelectComponent,
    },
  ],
})
export class MultiSelectComponent<T> implements OnInit, ControlValueAccessor {
  protected Icon = Icon
  protected IconSize = IconSize

  @Input() public options: SelectOption<T>[] = []
  public selectableOptions: SelectableOption<T>[] = []

  @Input() public className: string
  @Input() public label: string
  @Input() public placeholder?: string

  @Output() public onChange: EventEmitter<T[]> = new EventEmitter()

  public selectedOptions: SelectableOption<T>[] = []
  public isShown: boolean = false

  private onChangeCallback: (value: T[]) => void
  private onTouchedCallback: () => void

  private values: T[] = []

  private isTouched: boolean = false

  constructor(private readonly clickService: ClickService) {}

  public ngOnInit(): void {
    this.selectableOptions = this.options.map(option => {
      return {
        ...option,
        isSelected: false,
      }
    })
    this.clickService.clickObservable.subscribe(click => this.onDocumentClick(click))
  }

  private onDocumentClick(clickEvent: MouseEvent): void {
    if (!this.isShown) {
      return
    }
    if (!this.isMultiSelectElementClicked(clickEvent)) {
      this.isShown = false
    }
  }

  private isMultiSelectElementClicked(clickEvent: MouseEvent): boolean {
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

  public toggleOption(option: SelectableOption<T>): void {
    this.markAsTouched()
    option.isSelected = !option.isSelected
    if (option.isSelected) {
      this.selectedOptions.push(option)
      this.updateValuesFromSelectedOptions()
      return
    }
    const index: number = this.selectedOptions.indexOf(option)
    if (index < 0) {
      return
    }
    this.selectedOptions.splice(index, 1)

    this.updateValuesFromSelectedOptions()
  }

  private markAsTouched(): void {
    if (this.isTouched || !this.onTouchedCallback) {
      return
    }
    this.onTouchedCallback()
    this.isTouched = true
  }

  private updateValuesFromSelectedOptions(): void {
    this.values = this.selectedOptions.map(option => option.value)
    this.onChange.emit(this.values)
    this.onChangeCallback?.(this.values)
  }

  public getSelectedOptionsAsDisplay(): string {
    return this.selectedOptions.map(option => option.name).join(', ')
  }

  public clearAllSelected(): void {
    this.clearSelectedOptions()
    this.updateValuesFromSelectedOptions()
  }

  public stopPropagation(event: MouseEvent): void {
    event.stopPropagation()
  }

  private clearSelectedOptions(): void {
    this.selectableOptions.map(option => (option.isSelected = false))
    this.selectedOptions = []
  }

  public writeValue(value: T[]): void {
    this.values = value
    this.updateSelectedOptionsFromValues()
  }

  private updateSelectedOptionsFromValues(): void {
    this.clearSelectedOptions()
    this.selectedOptions = this.selectableOptions
      .filter(option => this.values.includes(option.value))
      .map(option => {
        option.isSelected = true
        return option
      })
  }

  public toggleMultiSelectShown(): void {
    this.isShown = !this.isShown
  }

  public registerOnChange(changeCallback: (value: T[]) => void): void {
    this.onChangeCallback = changeCallback
  }

  public registerOnTouched(touchedCallback: () => void): void {
    this.onTouchedCallback = touchedCallback
  }
}
