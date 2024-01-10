import { ValidatorFn, AbstractControl, FormArray } from '@angular/forms'

export class SofieValidators {
  public static atLeastOne(): ValidatorFn {
    return (control: AbstractControl) => {
      const controlArray = control as FormArray
      if (controlArray.controls.some(el => el.value)) {
        return null
      } else {
        return {
          atLeastOneAuthor: { valid: false },
        }
      }
    }
  }
}
