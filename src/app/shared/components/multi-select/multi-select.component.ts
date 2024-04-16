import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core'
import { Icon, IconSize } from '../../enums/icon'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'
import { SelectOption } from '../../models/select-option'

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
  protected isShowingOptions: boolean = false
  protected hasBeenClicked: boolean = true

  @Input() public options: SelectOption<T>[] = []
  public selectableOptions: SelectableOption<T>[] = []

  @Input() public label: string
  @Input() public placeholder?: string

  @Input() public isRequired?: boolean
  @Input() public errorMessage?: string

  @Output() public onChange: EventEmitter<T[]> = new EventEmitter()

  public selectedOptions: SelectableOption<T>[] = []

  private onChangeCallback: (value: T[]) => void
  private onTouchedCallback: () => void

  private values: T[] = []

  private isTouched: boolean = false

  constructor() {}

  @HostListener('click', ['$event'])
  protected registerClick(): void {
    this.hasBeenClicked = false
    setTimeout(() => {
      this.hasBeenClicked = true
    })
  }

  public ngOnInit(): void {
    this.selectableOptions = this.options.map(option => {
      return {
        ...option,
        isSelected: false,
      }
    })
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

  protected markAsTouched(): void {
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

  protected toggleIsShowingOptions(): void {
    this.isShowingOptions = !this.isShowingOptions
    if (this.isShowingOptions) {
      this.addClickListenerForDropdownClose()
    }
  }

  private addClickListenerForDropdownClose(): void {
    document.addEventListener('click', () => (this.hasBeenClicked ? (this.isShowingOptions = false) : this.addClickListenerForDropdownClose()), { once: true })
  }

  public registerOnChange(changeCallback: (value: T[]) => void): void {
    this.onChangeCallback = changeCallback
  }

  public registerOnTouched(touchedCallback: () => void): void {
    this.onTouchedCallback = touchedCallback
  }
}
