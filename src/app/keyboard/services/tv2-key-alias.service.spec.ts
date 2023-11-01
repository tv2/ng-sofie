import { Tv2KeyAliasService } from './tv2-key-alias.service'
import { KeyAlias } from '../value-objects/key-alias'

describe(Tv2KeyAliasService.name, () => {
  describe(Tv2KeyAliasService.prototype.getKeysFromKeyAlias.name, () => {
    describe('when key is an alias', () => {
      describe('when alias is AnyEnter', () => {
        it('returns Enter and NumpadEnter', () => {
          const keyAlias: string = KeyAlias.ANY_ENTER
          const expectedAliases: string[] = ['Enter', 'NumpadEnter']
          const testee: Tv2KeyAliasService = createTestee()

          const result: string[] = testee.getKeysFromKeyAlias(keyAlias)

          expect(result).toEqual(expectedAliases)
        })
      })

      describe('when alias is Shift', () => {
        it('returns ShiftLeft and ShiftRight', () => {
          const keyAlias: string = KeyAlias.SHIFT
          const expectedAliases: string[] = ['ShiftLeft', 'ShiftRight']
          const testee: Tv2KeyAliasService = createTestee()

          const result: string[] = testee.getKeysFromKeyAlias(keyAlias)

          expect(result).toEqual(expectedAliases)
        })
      })

      describe('when alias is Control', () => {
        it('returns ControlLeft and ControlRight', () => {
          const keyAlias: string = KeyAlias.CONTROL
          const expectedAliases: string[] = ['ControlLeft', 'ControlRight']
          const testee: Tv2KeyAliasService = createTestee()

          const result: string[] = testee.getKeysFromKeyAlias(keyAlias)

          expect(result).toEqual(expectedAliases)
        })
      })

      describe('when alias is Alt', () => {
        it('returns AltLeft and AltRight', () => {
          const keyAlias: string = KeyAlias.ALT
          const expectedAliases: string[] = ['AltLeft', 'AltRight']
          const testee: Tv2KeyAliasService = createTestee()

          const result: string[] = testee.getKeysFromKeyAlias(keyAlias)

          expect(result).toEqual(expectedAliases)
        })
      })

      describe('when alias is Option', () => {
        it('returns AltLeft and AltRight', () => {
          const keyAlias: string = KeyAlias.OPTION
          const expectedAliases: string[] = ['AltLeft', 'AltRight']
          const testee: Tv2KeyAliasService = createTestee()

          const result: string[] = testee.getKeysFromKeyAlias(keyAlias)

          expect(result).toEqual(expectedAliases)
        })
      })

      describe('when alias is Meta', () => {
        it('returns MetaLeft and MetaRight', () => {
          const keyAlias: string = KeyAlias.META
          const expectedAliases: string[] = ['MetaLeft', 'MetaRight']
          const testee: Tv2KeyAliasService = createTestee()

          const result: string[] = testee.getKeysFromKeyAlias(keyAlias)

          expect(result).toEqual(expectedAliases)
        })
      })
    })

    describe('when key has no aliases', () => {
      ;['KeyA', 'KeyC', 'Space', 'Digit1', 'Digit9', 'Backquote', 'Enter', 'ControlLeft'].forEach(key => runGetKeysFromAliasTestForKeyWithoutAliases(key))
    })
  })

  describe(Tv2KeyAliasService.prototype.isModifierKeyOrAliasedModifierKey.name, () => {
    describe('when key is an alias', () => {
      describe('when key is AnyEnter', () => {
        it('returns false', () => {
          const testee: Tv2KeyAliasService = createTestee()
          const key: string = KeyAlias.ANY_ENTER

          const result: boolean = testee.isModifierKeyOrAliasedModifierKey(key)

          expect(result).toBeFalse()
        })
      })

      describe('when key is Control', () => {
        it('returns true', () => {
          const testee: Tv2KeyAliasService = createTestee()
          const key: string = KeyAlias.CONTROL

          const result: boolean = testee.isModifierKeyOrAliasedModifierKey(key)

          expect(result).toBeTrue()
        })
      })

      describe('when key is Shift', () => {
        it('returns true', () => {
          const testee: Tv2KeyAliasService = createTestee()
          const key: string = KeyAlias.SHIFT

          const result: boolean = testee.isModifierKeyOrAliasedModifierKey(key)

          expect(result).toBeTrue()
        })
      })

      describe('when key is Alt', () => {
        it('returns true', () => {
          const testee: Tv2KeyAliasService = createTestee()
          const key: string = KeyAlias.ALT

          const result: boolean = testee.isModifierKeyOrAliasedModifierKey(key)

          expect(result).toBeTrue()
        })
      })

      describe('when key is Option', () => {
        it('returns true', () => {
          const testee: Tv2KeyAliasService = createTestee()
          const key: string = KeyAlias.OPTION

          const result: boolean = testee.isModifierKeyOrAliasedModifierKey(key)

          expect(result).toBeTrue()
        })
      })

      describe('when key is Meta', () => {
        it('returns true', () => {
          const testee: Tv2KeyAliasService = createTestee()
          const key: string = KeyAlias.META

          const result: boolean = testee.isModifierKeyOrAliasedModifierKey(key)

          expect(result).toBeTrue()
        })
      })

      describe('when key is Meta', () => {
        it('returns true', () => {
          const testee: Tv2KeyAliasService = createTestee()
          const key: string = KeyAlias.META

          const result: boolean = testee.isModifierKeyOrAliasedModifierKey(key)

          expect(result).toBeTrue()
        })
      })
    })

    describe('when key is a non-alias modifier key', () => {
      describe('when key is ControlLeft', () => {
        it('returns true', () => {
          const testee: Tv2KeyAliasService = createTestee()
          const key: string = 'ControlLeft'

          const result: boolean = testee.isModifierKeyOrAliasedModifierKey(key)

          expect(result).toBeTrue()
        })
      })

      describe('when key is ShiftLeft', () => {
        it('returns true', () => {
          const testee: Tv2KeyAliasService = createTestee()
          const key: string = 'ShiftLeft'

          const result: boolean = testee.isModifierKeyOrAliasedModifierKey(key)

          expect(result).toBeTrue()
        })
      })

      describe('when key is AltLeft', () => {
        it('returns true', () => {
          const testee: Tv2KeyAliasService = createTestee()
          const key: string = 'AltLeft'

          const result: boolean = testee.isModifierKeyOrAliasedModifierKey(key)

          expect(result).toBeTrue()
        })
      })

      describe('when key is MetaLeft', () => {
        it('returns true', () => {
          const testee: Tv2KeyAliasService = createTestee()
          const key: string = 'MetaLeft'

          const result: boolean = testee.isModifierKeyOrAliasedModifierKey(key)

          expect(result).toBeTrue()
        })
      })

      describe('when key is ControlRight', () => {
        it('returns true', () => {
          const testee: Tv2KeyAliasService = createTestee()
          const key: string = 'ControlRight'

          const result: boolean = testee.isModifierKeyOrAliasedModifierKey(key)

          expect(result).toBeTrue()
        })
      })

      describe('when key is ShiftRight', () => {
        it('returns true', () => {
          const testee: Tv2KeyAliasService = createTestee()
          const key: string = 'ShiftRight'

          const result: boolean = testee.isModifierKeyOrAliasedModifierKey(key)

          expect(result).toBeTrue()
        })
      })

      describe('when key is AltRight', () => {
        it('returns true', () => {
          const testee: Tv2KeyAliasService = createTestee()
          const key: string = 'AltRight'

          const result: boolean = testee.isModifierKeyOrAliasedModifierKey(key)

          expect(result).toBeTrue()
        })
      })

      describe('when key is MetaRight', () => {
        it('returns true', () => {
          const testee: Tv2KeyAliasService = createTestee()
          const key: string = 'MetaRight'

          const result: boolean = testee.isModifierKeyOrAliasedModifierKey(key)

          expect(result).toBeTrue()
        })
      })
    })

    describe('when key is not a modifier key', () => {
      ;['KeyA', 'KeyC', 'Space', 'Digit1', 'Digit9', 'Backquote', 'Enter', 'Backspace'].forEach(key => runIsModifierKeyOrAliasedModifierKeyTestForNonModifierKey(key))
    })
  })

  describe(Tv2KeyAliasService.prototype.isKeyPartOfAlias.name, () => {
    describe('when key alias is AnyEnter', () => {
      describe('when key is Enter', () => {
        it('returns true', () => {
          const testee: Tv2KeyAliasService = createTestee()
          const keyAlias: string = KeyAlias.ANY_ENTER
          const key: string = 'Enter'

          const result: boolean = testee.isKeyPartOfAlias(key, keyAlias)

          expect(result).toBeTrue()
        })
      })

      describe('when key is NumpadEnter', () => {
        it('returns true', () => {
          const testee: Tv2KeyAliasService = createTestee()
          const keyAlias: string = KeyAlias.ANY_ENTER
          const key: string = 'NumpadEnter'

          const result: boolean = testee.isKeyPartOfAlias(key, keyAlias)

          expect(result).toBeTrue()
        })
      })
    })

    describe('when key alias is Enter', () => {
      describe('when key is Enter', () => {
        it('returns true', () => {
          const testee: Tv2KeyAliasService = createTestee()
          const keyAlias: string = 'Enter'
          const key: string = 'Enter'

          const result: boolean = testee.isKeyPartOfAlias(key, keyAlias)

          expect(result).toBeTrue()
        })
      })

      describe('when key is NumpadEnter', () => {
        it('returns false', () => {
          const testee: Tv2KeyAliasService = createTestee()
          const keyAlias: string = 'Enter'
          const key: string = 'NumpadEnter'

          const result: boolean = testee.isKeyPartOfAlias(key, keyAlias)

          expect(result).toBeFalse()
        })
      })
    })

    describe('when key alias is NumpadEnter', () => {
      describe('when key is Enter', () => {
        it('returns false', () => {
          const testee: Tv2KeyAliasService = createTestee()
          const keyAlias: string = 'NumpadEnter'
          const key: string = 'Enter'

          const result: boolean = testee.isKeyPartOfAlias(key, keyAlias)

          expect(result).toBeFalse()
        })
      })

      describe('when key is NumpadEnter', () => {
        it('returns true', () => {
          const testee: Tv2KeyAliasService = createTestee()
          const keyAlias: string = 'NumpadEnter'
          const key: string = 'NumpadEnter'

          const result: boolean = testee.isKeyPartOfAlias(key, keyAlias)

          expect(result).toBeTrue()
        })
      })
    })

    describe('when key alias is Shift', () => {
      describe('when key is ShiftLeft', () => {
        it('returns true', () => {
          const testee: Tv2KeyAliasService = createTestee()
          const keyAlias: string = KeyAlias.SHIFT
          const key: string = 'ShiftLeft'

          const result: boolean = testee.isKeyPartOfAlias(key, keyAlias)

          expect(result).toBeTrue()
        })
      })

      describe('when key is ShiftRight', () => {
        it('returns true', () => {
          const testee: Tv2KeyAliasService = createTestee()
          const keyAlias: string = KeyAlias.SHIFT
          const key: string = 'ShiftRight'

          const result: boolean = testee.isKeyPartOfAlias(key, keyAlias)

          expect(result).toBeTrue()
        })
      })
    })

    describe('when key alias is ShiftLeft', () => {
      describe('when key is ShiftLeft', () => {
        it('returns true', () => {
          const testee: Tv2KeyAliasService = createTestee()
          const keyAlias: string = 'ShiftLeft'
          const key: string = 'ShiftLeft'

          const result: boolean = testee.isKeyPartOfAlias(key, keyAlias)

          expect(result).toBeTrue()
        })
      })

      describe('when key is ShiftRight', () => {
        it('returns false', () => {
          const testee: Tv2KeyAliasService = createTestee()
          const keyAlias: string = 'ShiftLeft'
          const key: string = 'ShiftRight'

          const result: boolean = testee.isKeyPartOfAlias(key, keyAlias)

          expect(result).toBeFalse()
        })
      })
    })

    describe('when key alias is ShiftRight', () => {
      describe('when key is ShiftLeft', () => {
        it('returns false', () => {
          const testee: Tv2KeyAliasService = createTestee()
          const keyAlias: string = 'ShiftRight'
          const key: string = 'ShiftLeft'

          const result: boolean = testee.isKeyPartOfAlias(key, keyAlias)

          expect(result).toBeFalse()
        })
      })

      describe('when key is ShiftRight', () => {
        it('returns true', () => {
          const testee: Tv2KeyAliasService = createTestee()
          const keyAlias: string = 'ShiftRight'
          const key: string = 'ShiftRight'

          const result: boolean = testee.isKeyPartOfAlias(key, keyAlias)

          expect(result).toBeTrue()
        })
      })
    })

    describe('when key alias is Control', () => {
      describe('when key is ControlLeft', () => {
        it('returns true', () => {
          const testee: Tv2KeyAliasService = createTestee()
          const keyAlias: string = KeyAlias.CONTROL
          const key: string = 'ControlLeft'

          const result: boolean = testee.isKeyPartOfAlias(key, keyAlias)

          expect(result).toBeTrue()
        })
      })

      describe('when key is ControlRight', () => {
        it('returns true', () => {
          const testee: Tv2KeyAliasService = createTestee()
          const keyAlias: string = KeyAlias.CONTROL
          const key: string = 'ControlRight'

          const result: boolean = testee.isKeyPartOfAlias(key, keyAlias)

          expect(result).toBeTrue()
        })
      })
    })

    describe('when key alias is ControlLeft', () => {
      describe('when key is ControlLeft', () => {
        it('returns true', () => {
          const testee: Tv2KeyAliasService = createTestee()
          const keyAlias: string = 'ControlLeft'
          const key: string = 'ControlLeft'

          const result: boolean = testee.isKeyPartOfAlias(key, keyAlias)

          expect(result).toBeTrue()
        })
      })

      describe('when key is ControlRight', () => {
        it('returns false', () => {
          const testee: Tv2KeyAliasService = createTestee()
          const keyAlias: string = 'ControlLeft'
          const key: string = 'ControlRight'

          const result: boolean = testee.isKeyPartOfAlias(key, keyAlias)

          expect(result).toBeFalse()
        })
      })
    })

    describe('when key alias is ControlRight', () => {
      describe('when key is ControlLeft', () => {
        it('returns false', () => {
          const testee: Tv2KeyAliasService = createTestee()
          const keyAlias: string = 'ControlRight'
          const key: string = 'ControlLeft'

          const result: boolean = testee.isKeyPartOfAlias(key, keyAlias)

          expect(result).toBeFalse()
        })
      })

      describe('when key is ControlRight', () => {
        it('returns true', () => {
          const testee: Tv2KeyAliasService = createTestee()
          const keyAlias: string = 'ControlRight'
          const key: string = 'ControlRight'

          const result: boolean = testee.isKeyPartOfAlias(key, keyAlias)

          expect(result).toBeTrue()
        })
      })
    })

    describe('when key alias is Option', () => {
      describe('when key is AltLeft', () => {
        it('returns true', () => {
          const testee: Tv2KeyAliasService = createTestee()
          const keyAlias: string = KeyAlias.OPTION
          const key: string = 'AltLeft'

          const result: boolean = testee.isKeyPartOfAlias(key, keyAlias)

          expect(result).toBeTrue()
        })
      })

      describe('when key is AltRight', () => {
        it('returns true', () => {
          const testee: Tv2KeyAliasService = createTestee()
          const keyAlias: string = KeyAlias.OPTION
          const key: string = 'AltRight'

          const result: boolean = testee.isKeyPartOfAlias(key, keyAlias)

          expect(result).toBeTrue()
        })
      })
    })

    describe('when key alias is Alt', () => {
      describe('when key is AltLeft', () => {
        it('returns true', () => {
          const testee: Tv2KeyAliasService = createTestee()
          const keyAlias: string = KeyAlias.ALT
          const key: string = 'AltLeft'

          const result: boolean = testee.isKeyPartOfAlias(key, keyAlias)

          expect(result).toBeTrue()
        })
      })

      describe('when key is AltRight', () => {
        it('returns true', () => {
          const testee: Tv2KeyAliasService = createTestee()
          const keyAlias: string = KeyAlias.ALT
          const key: string = 'AltRight'

          const result: boolean = testee.isKeyPartOfAlias(key, keyAlias)

          expect(result).toBeTrue()
        })
      })
    })

    describe('when key alias is AltLeft', () => {
      describe('when key is AltLeft', () => {
        it('returns true', () => {
          const testee: Tv2KeyAliasService = createTestee()
          const keyAlias: string = 'AltLeft'
          const key: string = 'AltLeft'

          const result: boolean = testee.isKeyPartOfAlias(key, keyAlias)

          expect(result).toBeTrue()
        })
      })

      describe('when key is AltRight', () => {
        it('returns false', () => {
          const testee: Tv2KeyAliasService = createTestee()
          const keyAlias: string = 'AltLeft'
          const key: string = 'AltRight'

          const result: boolean = testee.isKeyPartOfAlias(key, keyAlias)

          expect(result).toBeFalse()
        })
      })
    })

    describe('when key alias is AltRight', () => {
      describe('when key is AltLeft', () => {
        it('returns false', () => {
          const testee: Tv2KeyAliasService = createTestee()
          const keyAlias: string = 'AltRight'
          const key: string = 'AltLeft'

          const result: boolean = testee.isKeyPartOfAlias(key, keyAlias)

          expect(result).toBeFalse()
        })
      })

      describe('when key is AltRight', () => {
        it('returns true', () => {
          const testee: Tv2KeyAliasService = createTestee()
          const keyAlias: string = 'AltRight'
          const key: string = 'AltRight'

          const result: boolean = testee.isKeyPartOfAlias(key, keyAlias)

          expect(result).toBeTrue()
        })
      })
    })

    describe('when key alias is Meta', () => {
      describe('when key is MetaLeft', () => {
        it('returns true', () => {
          const testee: Tv2KeyAliasService = createTestee()
          const keyAlias: string = KeyAlias.META
          const key: string = 'MetaLeft'

          const result: boolean = testee.isKeyPartOfAlias(key, keyAlias)

          expect(result).toBeTrue()
        })
      })

      describe('when key is MetaRight', () => {
        it('returns true', () => {
          const testee: Tv2KeyAliasService = createTestee()
          const keyAlias: string = KeyAlias.META
          const key: string = 'MetaRight'

          const result: boolean = testee.isKeyPartOfAlias(key, keyAlias)

          expect(result).toBeTrue()
        })
      })
    })

    describe('when key alias is MetaLeft', () => {
      describe('when key is MetaLeft', () => {
        it('returns true', () => {
          const testee: Tv2KeyAliasService = createTestee()
          const keyAlias: string = 'MetaLeft'
          const key: string = 'MetaLeft'

          const result: boolean = testee.isKeyPartOfAlias(key, keyAlias)

          expect(result).toBeTrue()
        })
      })

      describe('when key is MetaRight', () => {
        it('returns false', () => {
          const testee: Tv2KeyAliasService = createTestee()
          const keyAlias: string = 'MetaLeft'
          const key: string = 'MetaRight'

          const result: boolean = testee.isKeyPartOfAlias(key, keyAlias)

          expect(result).toBeFalse()
        })
      })
    })

    describe('when key alias is MetaRight', () => {
      describe('when key is MetaLeft', () => {
        it('returns false', () => {
          const testee: Tv2KeyAliasService = createTestee()
          const keyAlias: string = 'MetaRight'
          const key: string = 'MetaLeft'

          const result: boolean = testee.isKeyPartOfAlias(key, keyAlias)

          expect(result).toBeFalse()
        })
      })

      describe('when key is MetaRight', () => {
        it('returns true', () => {
          const testee: Tv2KeyAliasService = createTestee()
          const keyAlias: string = 'MetaRight'
          const key: string = 'MetaRight'

          const result: boolean = testee.isKeyPartOfAlias(key, keyAlias)

          expect(result).toBeTrue()
        })
      })
    })
  })
})

function createTestee(): Tv2KeyAliasService {
  return new Tv2KeyAliasService()
}

function runGetKeysFromAliasTestForKeyWithoutAliases(key: string): void {
  describe(`when key is ${key}`, () => {
    it('returns no aliases except for the key itself', () => {
      const testee: Tv2KeyAliasService = createTestee()

      const result: string[] = testee.getKeysFromKeyAlias(key)

      expect(result).toEqual([key])
    })
  })
}

function runIsModifierKeyOrAliasedModifierKeyTestForNonModifierKey(key: string): void {
  describe(`when key is ${key}`, () => {
    it('returns false', () => {
      const testee: Tv2KeyAliasService = createTestee()

      const result: boolean = testee.isModifierKeyOrAliasedModifierKey(key)

      expect(result).toBeFalse()
    })
  })
}
