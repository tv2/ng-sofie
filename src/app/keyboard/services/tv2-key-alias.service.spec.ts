import { Tv2KeyAliasService } from './tv2-key-alias.service'

describe(Tv2KeyAliasService.name, () => {
  describe(Tv2KeyAliasService.prototype.getKeysFromKeyAlias.name, () => {
    describe('when key is an alias', () => {
      describe('when alias is AnyEnter', () => {
        it('returns Enter and NumpadEnter', () => {
          const alias: string = 'AnyEnter'
          const expectedAliases: string[] = ['Enter', 'NumpadEnter']
          const testee: Tv2KeyAliasService = createTestee()

          const result: string[] = testee.getKeysFromKeyAlias(alias)

          expect(result).toEqual(expectedAliases)
        })
      })

      describe('when alias is Shift', () => {
        it('returns ShiftLeft and ShiftRight', () => {
          const alias: string = 'Shift'
          const expectedAliases: string[] = ['ShiftLeft', 'ShiftRight']
          const testee: Tv2KeyAliasService = createTestee()

          const result: string[] = testee.getKeysFromKeyAlias(alias)

          expect(result).toEqual(expectedAliases)
        })
      })

      describe('when alias is Control', () => {
        it('returns ControlLeft and ControlRight', () => {
          const alias: string = 'Control'
          const expectedAliases: string[] = ['ControlLeft', 'ControlRight']
          const testee: Tv2KeyAliasService = createTestee()

          const result: string[] = testee.getKeysFromKeyAlias(alias)

          expect(result).toEqual(expectedAliases)
        })
      })

      describe('when alias is Alt', () => {
        it('returns AltLeft and AltRight', () => {
          const alias: string = 'Alt'
          const expectedAliases: string[] = ['AltLeft', 'AltRight']
          const testee: Tv2KeyAliasService = createTestee()

          const result: string[] = testee.getKeysFromKeyAlias(alias)

          expect(result).toEqual(expectedAliases)
        })
      })

      describe('when alias is Option', () => {
        it('returns AltLeft and AltRight', () => {
          const alias: string = 'Option'
          const expectedAliases: string[] = ['AltLeft', 'AltRight']
          const testee: Tv2KeyAliasService = createTestee()

          const result: string[] = testee.getKeysFromKeyAlias(alias)

          expect(result).toEqual(expectedAliases)
        })
      })

      describe('when alias is Meta', () => {
        it('returns MetaLeft and MetaRight', () => {
          const alias: string = 'Meta'
          const expectedAliases: string[] = ['MetaLeft', 'MetaRight']
          const testee: Tv2KeyAliasService = createTestee()

          const result: string[] = testee.getKeysFromKeyAlias(alias)

          expect(result).toEqual(expectedAliases)
        })
      })

      describe('when alias is OS', () => {
        it('returns OSLeft and OSRight', () => {
          const alias: string = 'OS'
          const expectedAliases: string[] = ['OSLeft', 'OSRight']
          const testee: Tv2KeyAliasService = createTestee()

          const result: string[] = testee.getKeysFromKeyAlias(alias)

          expect(result).toEqual(expectedAliases)
        })
      })

      describe('when alias is Command', () => {
        it('returns OSLeft and OSRight', () => {
          const alias: string = 'Command'
          const expectedAliases: string[] = ['OSLeft', 'OSRight']
          const testee: Tv2KeyAliasService = createTestee()

          const result: string[] = testee.getKeysFromKeyAlias(alias)

          expect(result).toEqual(expectedAliases)
        })
      })

      describe('when alias is Windows', () => {
        it('returns OSLeft and OSRight', () => {
          const alias: string = 'Windows'
          const expectedAliases: string[] = ['OSLeft', 'OSRight']
          const testee: Tv2KeyAliasService = createTestee()

          const result: string[] = testee.getKeysFromKeyAlias(alias)

          expect(result).toEqual(expectedAliases)
        })
      })
    })

    describe('when key has no aliases', () => {
      ;['KeyA', 'KeyC', 'Space', 'Digit1', 'Digit9', 'Backquote', 'Enter', 'ControlLeft'].forEach(key => runTestKeyWithoutAliases(key))
    })
  })
})

function createTestee(): Tv2KeyAliasService {
  return new Tv2KeyAliasService()
}

function runTestKeyWithoutAliases(key: string): void {
  describe(`when key is ${key}`, () => {
    it('returns no aliases except for the key itself', () => {
      const testee: Tv2KeyAliasService = createTestee()

      const result: string[] = testee.getKeysFromKeyAlias(key)

      expect(result).toEqual([key])
    })
  })
}
