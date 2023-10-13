import { Tv2KeyBindingMatcher } from './tv2-key-binding-matcher.service'
import { KeyBinding } from '../models/key-binding'

describe(Tv2KeyBindingMatcher.name, () => {
    describe(Tv2KeyBindingMatcher.prototype.isMatching.name, () => {
        describe('when the key binding should be matched exclusively', () => {
            it('returns false when a subset of keystrokes are given on key press', () => {
                const keys: [string, ...string[]] = ['KeyA', 'KeyB']
                const keystrokes: string[] = ['KeyA']
                const keyBinding: KeyBinding = createKeyBinding({ keys, useExclusiveMatching: true })
                const testee: Tv2KeyBindingMatcher = createTestee()

                const result: boolean = testee.isMatching(keyBinding, keystrokes, false)

                expect(result).toBeFalse()
            })

            it('returns false when a superset of keystrokes are given', () => {
                const keys: [string, ...string[]] = ['KeyA', 'KeyB']
                const keystrokes: string[] = [...keys, 'KeyC']
                const keyBinding: KeyBinding = createKeyBinding({ keys, useExclusiveMatching: true })
                const testee: Tv2KeyBindingMatcher = createTestee()

                const result: boolean = testee.isMatching(keyBinding, keystrokes, false)

                expect(result).toBeFalse()
            })

            it('returns true when a functional equivalent set of keystrokes are given', () => {
                const keys: [string, ...string[]] = ['KeyA', 'KeyB']
                const keystrokes: string[] = [...keys]
                const keyBinding: KeyBinding = createKeyBinding({ keys, useExclusiveMatching: true })
                const testee: Tv2KeyBindingMatcher = createTestee()

                const result: boolean = testee.isMatching(keyBinding, keystrokes, false)

                expect(result).toBeTrue()
            })
        })

        describe('when the key binding should be matched non-exclusively', () => {
            it('returns false when a subset of keystrokes are given', () => {
                const keys: [string, ...string[]] = ['KeyA', 'KeyB']
                const keystrokes: string[] = ['KeyA']
                const keyBinding: KeyBinding = createKeyBinding({ keys, useExclusiveMatching: false })
                const testee: Tv2KeyBindingMatcher = createTestee()

                const result: boolean = testee.isMatching(keyBinding, keystrokes, false)

                expect(result).toBeFalse()
            })

            it('returns true when a superset of keystrokes are given', () => {
                const keys: [string, ...string[]] = ['KeyA', 'KeyB']
                const keystrokes: string[] = [...keys, 'KeyC']
                const keyBinding: KeyBinding = createKeyBinding({ keys, useExclusiveMatching: false })
                const testee: Tv2KeyBindingMatcher = createTestee()

                const result: boolean = testee.isMatching(keyBinding, keystrokes, false)

                expect(result).toBeTrue()
            })

            it('returns true when a functional equivalent set of keystrokes are given', () => {
                const keys: [string, ...string[]] = ['KeyA', 'KeyB']
                const keystrokes: string[] = [...keys]
                const keyBinding: KeyBinding = createKeyBinding({ keys, useExclusiveMatching: false })
                const testee: Tv2KeyBindingMatcher = createTestee()

                const result: boolean = testee.isMatching(keyBinding, keystrokes, false)

                expect(result).toBeTrue()
            })
        })

        describe('when the key binding should be matched on key press', () => {
            it('returns false when given a non-matching sequence of keystrokes on key release', () => {
                const keys: [string, ...string[]] = ['KeyA', 'KeyB']
                const keystrokes: string[] = ['KeyC', 'KeyD']
                const keyBinding: KeyBinding = createKeyBinding({ keys, shouldMatchOnKeyRelease: false })
                const testee: Tv2KeyBindingMatcher = createTestee()

                const result: boolean = testee.isMatching(keyBinding, keystrokes, true)

                expect(result).toBeFalse()
            })

            it('returns false when given a non-matching sequence of keystrokes on key press', () => {
                const keys: [string, ...string[]] = ['KeyA', 'KeyB']
                const keystrokes: string[] = ['KeyC', 'KeyD']
                const keyBinding: KeyBinding = createKeyBinding({ keys, shouldMatchOnKeyRelease: false })
                const testee: Tv2KeyBindingMatcher = createTestee()

                const result: boolean = testee.isMatching(keyBinding, keystrokes, false)

                expect(result).toBeFalse()
            })

            it('returns false when given a matching sequence of keystrokes on key release', () => {
                const keys: [string, ...string[]] = ['KeyA', 'KeyB']
                const keystrokes: string[] = [...keys]
                const keyBinding: KeyBinding = createKeyBinding({ keys, shouldMatchOnKeyRelease: false })
                const testee: Tv2KeyBindingMatcher = createTestee()

                const result: boolean = testee.isMatching(keyBinding, keystrokes, true)

                expect(result).toBeFalse()
            })

            it('returns true when given a matching sequence of keystrokes on key press', () => {
                const keys: [string, ...string[]] = ['KeyA', 'KeyB']
                const keystrokes: string[] = [...keys]
                const keyBinding: KeyBinding = createKeyBinding({ keys, shouldMatchOnKeyRelease: false })
                const testee: Tv2KeyBindingMatcher = createTestee()

                const result: boolean = testee.isMatching(keyBinding, keystrokes, false)

                expect(result).toBeTrue()
            })
        })

        describe('when the key binding should be matched on key release', () => {
            it('returns false when given a non-matching sequence of keystrokes on key release', () => {
                const keys: [string, ...string[]] = ['KeyA', 'KeyB']
                const keystrokes: string[] = ['KeyC', 'KeyD']
                const keyBinding: KeyBinding = createKeyBinding({ keys, shouldMatchOnKeyRelease: true })
                const testee: Tv2KeyBindingMatcher = createTestee()

                const result: boolean = testee.isMatching(keyBinding, keystrokes, true)

                expect(result).toBeFalse()
            })

            it('returns false when given a non-matching sequence of keystrokes on key press', () => {
                const keys: [string, ...string[]] = ['KeyA', 'KeyB']
                const keystrokes: string[] = ['KeyC', 'KeyD']
                const keyBinding: KeyBinding = createKeyBinding({ keys, shouldMatchOnKeyRelease: true })
                const testee: Tv2KeyBindingMatcher = createTestee()

                const result: boolean = testee.isMatching(keyBinding, keystrokes, false)

                expect(result).toBeFalse()
            })

            it('returns true when given a matching sequence of keystrokes on key release', () => {
                const keys: [string, ...string[]] = ['KeyA', 'KeyB']
                const keystrokes: string[] = [...keys]
                const keyBinding: KeyBinding = createKeyBinding({ keys, shouldMatchOnKeyRelease: true })
                const testee: Tv2KeyBindingMatcher = createTestee()

                const result: boolean = testee.isMatching(keyBinding, keystrokes, true)

                expect(result).toBeTrue()
            })

            it('returns false when given a matching sequence of keystrokes on key press', () => {
                const keys: [string, ...string[]] = ['KeyA', 'KeyB']
                const keystrokes: string[] = [...keys]
                const keyBinding: KeyBinding = createKeyBinding({ keys, shouldMatchOnKeyRelease: true })
                const testee: Tv2KeyBindingMatcher = createTestee()

                const result: boolean = testee.isMatching(keyBinding, keystrokes, false)

                expect(result).toBeFalse()
            })
        })

        describe('when the keystroke order matters', () => {
            it('returns false when a unordered subset of keystrokes are given', () => {
                const keys: [string, ...string[]] = ['KeyA', 'KeyB', 'KeyC']
                const keystrokes: string[] = ['KeyC', 'KeyA']
                const keyBinding: KeyBinding = createKeyBinding({ keys, useOrderedMatching: true })
                const testee: Tv2KeyBindingMatcher = createTestee()

                const result: boolean = testee.isMatching(keyBinding, keystrokes, false)

                expect(result).toBeFalse()
            })

            it('returns false when a unordered superset of keystrokes are given', () => {
                const keys: [string, ...string[]] = ['KeyA', 'KeyB', 'KeyC']
                const keystrokes: string[] = ['KeyC', 'KeyA', 'KeyB', 'KeyD']
                const keyBinding: KeyBinding = createKeyBinding({ keys, useOrderedMatching: true })
                const testee: Tv2KeyBindingMatcher = createTestee()

                const result: boolean = testee.isMatching(keyBinding, keystrokes, false)

                expect(result).toBeFalse()
            })

            it('returns false when a unordered functional equivalent set of keystrokes are given', () => {
                const keys: [string, ...string[]] = ['KeyA', 'KeyB', 'KeyC']
                const keystrokes: string[] = ['KeyC', 'KeyA', 'KeyB']
                const keyBinding: KeyBinding = createKeyBinding({ keys, useOrderedMatching: true })
                const testee: Tv2KeyBindingMatcher = createTestee()

                const result: boolean = testee.isMatching(keyBinding, keystrokes, false)

                expect(result).toBeFalse()
            })

            it('returns false when a ordered subset of keystrokes are given', () => {
                const keys: [string, ...string[]] = ['KeyA', 'KeyB', 'KeyC']
                const keystrokes: string[] = ['KeyA', 'KeyB']
                const keyBinding: KeyBinding = createKeyBinding({ keys, useOrderedMatching: true })
                const testee: Tv2KeyBindingMatcher = createTestee()

                const result: boolean = testee.isMatching(keyBinding, keystrokes, false)

                expect(result).toBeFalse()
            })

            it('returns true when a ordered superset of keystrokes are given', () => {
                const keys: [string, ...string[]] = ['KeyA', 'KeyB', 'KeyD']
                const keystrokes: string[] = ['KeyA', 'KeyB', 'KeyC', 'KeyD', 'KeyE']
                const keyBinding: KeyBinding = createKeyBinding({ keys, useOrderedMatching: true })
                const testee: Tv2KeyBindingMatcher = createTestee()

                const result: boolean = testee.isMatching(keyBinding, keystrokes, false)

                expect(result).toBeTrue()
            })

            it('returns true when a ordered functional equivalent set of keystrokes are given', () => {
                const keys: [string, ...string[]] = ['KeyA', 'KeyB', 'KeyD']
                const keystrokes: string[] = ['KeyA', 'KeyB', 'KeyD']
                const keyBinding: KeyBinding = createKeyBinding({ keys, useOrderedMatching: true })
                const testee: Tv2KeyBindingMatcher = createTestee()

                const result: boolean = testee.isMatching(keyBinding, keystrokes, false)

                expect(result).toBeTrue()
            })
        })

        describe('when the keystroke order does not matter', () => {
            it('returns false when a unordered subset of keystrokes are given', () => {
                const keys: [string, ...string[]] = ['KeyA', 'KeyB', 'KeyC']
                const keystrokes: string[] = ['KeyC', 'KeyA']
                const keyBinding: KeyBinding = createKeyBinding({ keys, useOrderedMatching: false })
                const testee: Tv2KeyBindingMatcher = createTestee()

                const result: boolean = testee.isMatching(keyBinding, keystrokes, false)

                expect(result).toBeFalse()
            })

            it('returns true when a unordered superset of keystrokes are given', () => {
                const keys: [string, ...string[]] = ['KeyA', 'KeyB', 'KeyC']
                const keystrokes: string[] = ['KeyC', 'KeyA', 'KeyB', 'KeyD']
                const keyBinding: KeyBinding = createKeyBinding({ keys, useOrderedMatching: false })
                const testee: Tv2KeyBindingMatcher = createTestee()

                const result: boolean = testee.isMatching(keyBinding, keystrokes, false)

                expect(result).toBeTrue()
            })

            it('returns true when a unordered functional equivalent set of keystrokes are given', () => {
                const keys: [string, ...string[]] = ['KeyA', 'KeyB', 'KeyC']
                const keystrokes: string[] = ['KeyC', 'KeyA', 'KeyB']
                const keyBinding: KeyBinding = createKeyBinding({ keys, useOrderedMatching: false })
                const testee: Tv2KeyBindingMatcher = createTestee()

                const result: boolean = testee.isMatching(keyBinding, keystrokes, false)

                expect(result).toBeTrue()
            })

            it('returns false when a ordered subset of keystrokes are given', () => {
                const keys: [string, ...string[]] = ['KeyA', 'KeyB', 'KeyC']
                const keystrokes: string[] = ['KeyA', 'KeyB']
                const keyBinding: KeyBinding = createKeyBinding({ keys, useOrderedMatching: false })
                const testee: Tv2KeyBindingMatcher = createTestee()

                const result: boolean = testee.isMatching(keyBinding, keystrokes, false)

                expect(result).toBeFalse()
            })

            it('returns true when a ordered superset of keystrokes are given', () => {
                const keys: [string, ...string[]] = ['KeyA', 'KeyB', 'KeyD']
                const keystrokes: string[] = ['KeyA', 'KeyB', 'KeyC', 'KeyD', 'KeyE']
                const keyBinding: KeyBinding = createKeyBinding({ keys, useOrderedMatching: false })
                const testee: Tv2KeyBindingMatcher = createTestee()

                const result: boolean = testee.isMatching(keyBinding, keystrokes, false)

                expect(result).toBeTrue()
            })

            it('returns true when a ordered functional equivalent set of keystrokes are given', () => {
                const keys: [string, ...string[]] = ['KeyA', 'KeyB', 'KeyD']
                const keystrokes: string[] = ['KeyA', 'KeyB', 'KeyD']
                const keyBinding: KeyBinding = createKeyBinding({ keys, useOrderedMatching: false })
                const testee: Tv2KeyBindingMatcher = createTestee()

                const result: boolean = testee.isMatching(keyBinding, keystrokes, false)

                expect(result).toBeTrue()
            })
        })
    })

    describe(Tv2KeyBindingMatcher.prototype.shouldPreventDefaultBehaviour.name, () => {
        describe('when a partial match should prevent default behaviour', () => {
            it('returns false when no keys are pressed', () => {
                const keys: [string, ...string[]] = ['KeyA', 'KeyB']
                const keystrokes: string[] = []
                const keyBinding: KeyBinding = createKeyBinding({ keys, shouldPreventDefaultBehaviourForPartialMatches: true })
                const testee: Tv2KeyBindingMatcher = createTestee()

                const result: boolean = testee.shouldPreventDefaultBehaviour(keyBinding, keystrokes, false)

                expect(result).toBeFalse()
            })

            describe('when the key binding should be matched exclusively', () => {
                it('returns true when a subset of keystrokes are given on key press', () => {
                    const keys: [string, ...string[]] = ['KeyA', 'KeyB']
                    const keystrokes: string[] = ['KeyA']
                    const keyBinding: KeyBinding = createKeyBinding({ keys, useExclusiveMatching: true, shouldPreventDefaultBehaviourForPartialMatches: true })
                    const testee: Tv2KeyBindingMatcher = createTestee()

                    const result: boolean = testee.shouldPreventDefaultBehaviour(keyBinding, keystrokes, false)

                    expect(result).toBeTrue()
                })

                it('returns false when a superset of keystrokes are given', () => {
                    const keys: [string, ...string[]] = ['KeyA', 'KeyB']
                    const keystrokes: string[] = [...keys, 'KeyC']
                    const keyBinding: KeyBinding = createKeyBinding({ keys, useExclusiveMatching: true, shouldPreventDefaultBehaviourForPartialMatches: true })
                    const testee: Tv2KeyBindingMatcher = createTestee()

                    const result: boolean = testee.shouldPreventDefaultBehaviour(keyBinding, keystrokes, false)

                    expect(result).toBeFalse()
                })

                it('returns true when a functional equivalent set of keystrokes are given', () => {
                    const keys: [string, ...string[]] = ['KeyA', 'KeyB']
                    const keystrokes: string[] = [...keys]
                    const keyBinding: KeyBinding = createKeyBinding({ keys, useExclusiveMatching: true, shouldPreventDefaultBehaviourForPartialMatches: true })
                    const testee: Tv2KeyBindingMatcher = createTestee()

                    const result: boolean = testee.shouldPreventDefaultBehaviour(keyBinding, keystrokes, false)

                    expect(result).toBeTrue()
                })
            })

            describe('when the key binding should be matched non-exclusively', () => {
                it('returns true when a subset of keystrokes are given', () => {
                    const keys: [string, ...string[]] = ['KeyA', 'KeyB']
                    const keystrokes: string[] = ['KeyA']
                    const keyBinding: KeyBinding = createKeyBinding({ keys, useExclusiveMatching: false, shouldPreventDefaultBehaviourForPartialMatches: true })
                    const testee: Tv2KeyBindingMatcher = createTestee()

                    const result: boolean = testee.shouldPreventDefaultBehaviour(keyBinding, keystrokes, false)

                    expect(result).toBeTrue()
                })

                it('returns true when a superset of keystrokes are given', () => {
                    const keys: [string, ...string[]] = ['KeyA', 'KeyB']
                    const keystrokes: string[] = [...keys, 'KeyC']
                    const keyBinding: KeyBinding = createKeyBinding({ keys, useExclusiveMatching: false, shouldPreventDefaultBehaviourForPartialMatches: true })
                    const testee: Tv2KeyBindingMatcher = createTestee()

                    const result: boolean = testee.shouldPreventDefaultBehaviour(keyBinding, keystrokes, false)

                    expect(result).toBeTrue()
                })

                it('returns true when a functional equivalent set of keystrokes are given', () => {
                    const keys: [string, ...string[]] = ['KeyA', 'KeyB']
                    const keystrokes: string[] = [...keys]
                    const keyBinding: KeyBinding = createKeyBinding({ keys, useExclusiveMatching: false, shouldPreventDefaultBehaviourForPartialMatches: true })
                    const testee: Tv2KeyBindingMatcher = createTestee()

                    const result: boolean = testee.shouldPreventDefaultBehaviour(keyBinding, keystrokes, false)

                    expect(result).toBeTrue()
                })
            })

            describe('when the keystroke order matters', () => {
                it('returns false when a unordered subset of keystrokes are given', () => {
                    const keys: [string, ...string[]] = ['KeyA', 'KeyB', 'KeyC']
                    const keystrokes: string[] = ['KeyC', 'KeyA']
                    const keyBinding: KeyBinding = createKeyBinding({ keys, useOrderedMatching: true, shouldPreventDefaultBehaviourForPartialMatches: true })
                    const testee: Tv2KeyBindingMatcher = createTestee()

                    const result: boolean = testee.shouldPreventDefaultBehaviour(keyBinding, keystrokes, false)

                    expect(result).toBeFalse()
                })

                it('returns false when a unordered superset of keystrokes are given', () => {
                    const keys: [string, ...string[]] = ['KeyA', 'KeyB', 'KeyC']
                    const keystrokes: string[] = ['KeyC', 'KeyA', 'KeyB', 'KeyD']
                    const keyBinding: KeyBinding = createKeyBinding({ keys, useOrderedMatching: true, shouldPreventDefaultBehaviourForPartialMatches: true })
                    const testee: Tv2KeyBindingMatcher = createTestee()

                    const result: boolean = testee.shouldPreventDefaultBehaviour(keyBinding, keystrokes, false)

                    expect(result).toBeFalse()
                })

                it('returns false when a unordered functional equivalent set of keystrokes are given', () => {
                    const keys: [string, ...string[]] = ['KeyA', 'KeyB', 'KeyC']
                    const keystrokes: string[] = ['KeyC', 'KeyA', 'KeyB']
                    const keyBinding: KeyBinding = createKeyBinding({ keys, useOrderedMatching: true, shouldPreventDefaultBehaviourForPartialMatches: true })
                    const testee: Tv2KeyBindingMatcher = createTestee()

                    const result: boolean = testee.shouldPreventDefaultBehaviour(keyBinding, keystrokes, false)

                    expect(result).toBeFalse()
                })

                it('returns true when a ordered subset of keystrokes are given', () => {
                    const keys: [string, ...string[]] = ['KeyA', 'KeyB', 'KeyC']
                    const keystrokes: string[] = ['KeyA', 'KeyB']
                    const keyBinding: KeyBinding = createKeyBinding({ keys, useOrderedMatching: true, shouldPreventDefaultBehaviourForPartialMatches: true })
                    const testee: Tv2KeyBindingMatcher = createTestee()

                    const result: boolean = testee.shouldPreventDefaultBehaviour(keyBinding, keystrokes, false)

                    expect(result).toBeTrue()
                })

                it('returns true when a ordered superset of keystrokes are given', () => {
                    const keys: [string, ...string[]] = ['KeyA', 'KeyB', 'KeyD']
                    const keystrokes: string[] = ['KeyA', 'KeyB', 'KeyC', 'KeyD', 'KeyE']
                    const keyBinding: KeyBinding = createKeyBinding({ keys, useOrderedMatching: true, shouldPreventDefaultBehaviourForPartialMatches: true })
                    const testee: Tv2KeyBindingMatcher = createTestee()

                    const result: boolean = testee.shouldPreventDefaultBehaviour(keyBinding, keystrokes, false)

                    expect(result).toBeTrue()
                })

                it('returns true when a ordered functional equivalent set of keystrokes are given', () => {
                    const keys: [string, ...string[]] = ['KeyA', 'KeyB', 'KeyD']
                    const keystrokes: string[] = ['KeyA', 'KeyB', 'KeyD']
                    const keyBinding: KeyBinding = createKeyBinding({ keys, useOrderedMatching: true, shouldPreventDefaultBehaviourForPartialMatches: true })
                    const testee: Tv2KeyBindingMatcher = createTestee()

                    const result: boolean = testee.shouldPreventDefaultBehaviour(keyBinding, keystrokes, false)

                    expect(result).toBeTrue()
                })
            })

            describe('when the keystroke order does not matter', () => {
                it('returns true when a unordered subset of keystrokes are given', () => {
                    const keys: [string, ...string[]] = ['KeyA', 'KeyB', 'KeyC']
                    const keystrokes: string[] = ['KeyC', 'KeyA']
                    const keyBinding: KeyBinding = createKeyBinding({ keys, useOrderedMatching: false, shouldPreventDefaultBehaviourForPartialMatches: true })
                    const testee: Tv2KeyBindingMatcher = createTestee()

                    const result: boolean = testee.shouldPreventDefaultBehaviour(keyBinding, keystrokes, false)

                    expect(result).toBeTrue()
                })

                it('returns true when a unordered superset of keystrokes are given', () => {
                    const keys: [string, ...string[]] = ['KeyA', 'KeyB', 'KeyC']
                    const keystrokes: string[] = ['KeyC', 'KeyA', 'KeyB', 'KeyD']
                    const keyBinding: KeyBinding = createKeyBinding({ keys, useOrderedMatching: false, shouldPreventDefaultBehaviourForPartialMatches: true })
                    const testee: Tv2KeyBindingMatcher = createTestee()

                    const result: boolean = testee.shouldPreventDefaultBehaviour(keyBinding, keystrokes, false)

                    expect(result).toBeTrue()
                })

                it('returns true when a unordered functional equivalent set of keystrokes are given', () => {
                    const keys: [string, ...string[]] = ['KeyA', 'KeyB', 'KeyC']
                    const keystrokes: string[] = ['KeyC', 'KeyA', 'KeyB']
                    const keyBinding: KeyBinding = createKeyBinding({ keys, useOrderedMatching: false, shouldPreventDefaultBehaviourForPartialMatches: true })
                    const testee: Tv2KeyBindingMatcher = createTestee()

                    const result: boolean = testee.shouldPreventDefaultBehaviour(keyBinding, keystrokes, false)

                    expect(result).toBeTrue()
                })

                it('returns true when a ordered subset of keystrokes are given', () => {
                    const keys: [string, ...string[]] = ['KeyA', 'KeyB', 'KeyC']
                    const keystrokes: string[] = ['KeyA', 'KeyB']
                    const keyBinding: KeyBinding = createKeyBinding({ keys, useOrderedMatching: false, shouldPreventDefaultBehaviourForPartialMatches: true })
                    const testee: Tv2KeyBindingMatcher = createTestee()

                    const result: boolean = testee.shouldPreventDefaultBehaviour(keyBinding, keystrokes, false)

                    expect(result).toBeTrue()
                })

                it('returns true when a ordered superset of keystrokes are given', () => {
                    const keys: [string, ...string[]] = ['KeyA', 'KeyB', 'KeyD']
                    const keystrokes: string[] = ['KeyA', 'KeyB', 'KeyC', 'KeyD', 'KeyE']
                    const keyBinding: KeyBinding = createKeyBinding({ keys, useOrderedMatching: false, shouldPreventDefaultBehaviourForPartialMatches: true })
                    const testee: Tv2KeyBindingMatcher = createTestee()

                    const result: boolean = testee.shouldPreventDefaultBehaviour(keyBinding, keystrokes, false)

                    expect(result).toBeTrue()
                })

                it('returns true when a ordered functional equivalent set of keystrokes are given', () => {
                    const keys: [string, ...string[]] = ['KeyA', 'KeyB', 'KeyD']
                    const keystrokes: string[] = ['KeyA', 'KeyB', 'KeyD']
                    const keyBinding: KeyBinding = createKeyBinding({ keys, useOrderedMatching: false, shouldPreventDefaultBehaviourForPartialMatches: true })
                    const testee: Tv2KeyBindingMatcher = createTestee()

                    const result: boolean = testee.shouldPreventDefaultBehaviour(keyBinding, keystrokes, false)

                    expect(result).toBeTrue()
                })
            })
        })

        describe('when a partial match should not prevent default behaviour', () => {
            it('returns false when no keys are pressed', () => {
                const keys: [string, ...string[]] = ['KeyA', 'KeyB']
                const keystrokes: string[] = []
                const keyBinding: KeyBinding = createKeyBinding({ keys, shouldPreventDefaultBehaviourForPartialMatches: false })
                const testee: Tv2KeyBindingMatcher = createTestee()

                const result: boolean = testee.shouldPreventDefaultBehaviour(keyBinding, keystrokes, false)

                expect(result).toBeFalse()
            })

            describe('when the key binding should be matched exclusively', () => {
                it('returns false when a subset of keystrokes are given on key press', () => {
                    const keys: [string, ...string[]] = ['KeyA', 'KeyB']
                    const keystrokes: string[] = ['KeyA']
                    const keyBinding: KeyBinding = createKeyBinding({ keys, useExclusiveMatching: true, shouldPreventDefaultBehaviourForPartialMatches: false })
                    const testee: Tv2KeyBindingMatcher = createTestee()

                    const result: boolean = testee.shouldPreventDefaultBehaviour(keyBinding, keystrokes, false)

                    expect(result).toBeFalse()
                })

                it('returns false when a superset of keystrokes are given', () => {
                    const keys: [string, ...string[]] = ['KeyA', 'KeyB']
                    const keystrokes: string[] = [...keys, 'KeyC']
                    const keyBinding: KeyBinding = createKeyBinding({ keys, useExclusiveMatching: true, shouldPreventDefaultBehaviourForPartialMatches: false })
                    const testee: Tv2KeyBindingMatcher = createTestee()

                    const result: boolean = testee.shouldPreventDefaultBehaviour(keyBinding, keystrokes, false)

                    expect(result).toBeFalse()
                })

                it('returns false when a functional equivalent set of keystrokes are given', () => {
                    const keys: [string, ...string[]] = ['KeyA', 'KeyB']
                    const keystrokes: string[] = [...keys]
                    const keyBinding: KeyBinding = createKeyBinding({ keys, useExclusiveMatching: true, shouldPreventDefaultBehaviourForPartialMatches: false })
                    const testee: Tv2KeyBindingMatcher = createTestee()

                    const result: boolean = testee.shouldPreventDefaultBehaviour(keyBinding, keystrokes, false)

                    expect(result).toBeFalse()
                })
            })

            describe('when the key binding should be matched non-exclusively', () => {
                it('returns false when a subset of keystrokes are given', () => {
                    const keys: [string, ...string[]] = ['KeyA', 'KeyB']
                    const keystrokes: string[] = ['KeyA']
                    const keyBinding: KeyBinding = createKeyBinding({ keys, useExclusiveMatching: false, shouldPreventDefaultBehaviourForPartialMatches: false })
                    const testee: Tv2KeyBindingMatcher = createTestee()

                    const result: boolean = testee.shouldPreventDefaultBehaviour(keyBinding, keystrokes, false)

                    expect(result).toBeFalse()
                })

                it('returns false when a superset of keystrokes are given', () => {
                    const keys: [string, ...string[]] = ['KeyA', 'KeyB']
                    const keystrokes: string[] = [...keys, 'KeyC']
                    const keyBinding: KeyBinding = createKeyBinding({ keys, useExclusiveMatching: false, shouldPreventDefaultBehaviourForPartialMatches: false })
                    const testee: Tv2KeyBindingMatcher = createTestee()

                    const result: boolean = testee.shouldPreventDefaultBehaviour(keyBinding, keystrokes, false)

                    expect(result).toBeFalse()
                })

                it('returns false when a functional equivalent set of keystrokes are given', () => {
                    const keys: [string, ...string[]] = ['KeyA', 'KeyB']
                    const keystrokes: string[] = [...keys]
                    const keyBinding: KeyBinding = createKeyBinding({ keys, useExclusiveMatching: false, shouldPreventDefaultBehaviourForPartialMatches: false })
                    const testee: Tv2KeyBindingMatcher = createTestee()

                    const result: boolean = testee.shouldPreventDefaultBehaviour(keyBinding, keystrokes, false)

                    expect(result).toBeFalse()
                })
            })

            describe('when the keystroke order matters', () => {
                it('returns false when a unordered subset of keystrokes are given', () => {
                    const keys: [string, ...string[]] = ['KeyA', 'KeyB', 'KeyC']
                    const keystrokes: string[] = ['KeyC', 'KeyA']
                    const keyBinding: KeyBinding = createKeyBinding({ keys, useOrderedMatching: true, shouldPreventDefaultBehaviourForPartialMatches: false })
                    const testee: Tv2KeyBindingMatcher = createTestee()

                    const result: boolean = testee.shouldPreventDefaultBehaviour(keyBinding, keystrokes, false)

                    expect(result).toBeFalse()
                })

                it('returns false when a unordered superset of keystrokes are given', () => {
                    const keys: [string, ...string[]] = ['KeyA', 'KeyB', 'KeyC']
                    const keystrokes: string[] = ['KeyC', 'KeyA', 'KeyB', 'KeyD']
                    const keyBinding: KeyBinding = createKeyBinding({ keys, useOrderedMatching: true, shouldPreventDefaultBehaviourForPartialMatches: false })
                    const testee: Tv2KeyBindingMatcher = createTestee()

                    const result: boolean = testee.shouldPreventDefaultBehaviour(keyBinding, keystrokes, false)

                    expect(result).toBeFalse()
                })

                it('returns false when a unordered functional equivalent set of keystrokes are given', () => {
                    const keys: [string, ...string[]] = ['KeyA', 'KeyB', 'KeyC']
                    const keystrokes: string[] = ['KeyC', 'KeyA', 'KeyB']
                    const keyBinding: KeyBinding = createKeyBinding({ keys, useOrderedMatching: true, shouldPreventDefaultBehaviourForPartialMatches: false })
                    const testee: Tv2KeyBindingMatcher = createTestee()

                    const result: boolean = testee.shouldPreventDefaultBehaviour(keyBinding, keystrokes, false)

                    expect(result).toBeFalse()
                })

                it('returns false when a ordered subset of keystrokes are given', () => {
                    const keys: [string, ...string[]] = ['KeyA', 'KeyB', 'KeyC']
                    const keystrokes: string[] = ['KeyA', 'KeyB']
                    const keyBinding: KeyBinding = createKeyBinding({ keys, useOrderedMatching: true, shouldPreventDefaultBehaviourForPartialMatches: false })
                    const testee: Tv2KeyBindingMatcher = createTestee()

                    const result: boolean = testee.shouldPreventDefaultBehaviour(keyBinding, keystrokes, false)

                    expect(result).toBeFalse()
                })

                it('returns false when a ordered superset of keystrokes are given', () => {
                    const keys: [string, ...string[]] = ['KeyA', 'KeyB', 'KeyD']
                    const keystrokes: string[] = ['KeyA', 'KeyB', 'KeyC', 'KeyD', 'KeyE']
                    const keyBinding: KeyBinding = createKeyBinding({ keys, useOrderedMatching: true, shouldPreventDefaultBehaviourForPartialMatches: false })
                    const testee: Tv2KeyBindingMatcher = createTestee()

                    const result: boolean = testee.shouldPreventDefaultBehaviour(keyBinding, keystrokes, false)

                    expect(result).toBeFalse()
                })

                it('returns false when a ordered functional equivalent set of keystrokes are given', () => {
                    const keys: [string, ...string[]] = ['KeyA', 'KeyB', 'KeyD']
                    const keystrokes: string[] = ['KeyA', 'KeyB', 'KeyD']
                    const keyBinding: KeyBinding = createKeyBinding({ keys, useOrderedMatching: true, shouldPreventDefaultBehaviourForPartialMatches: false })
                    const testee: Tv2KeyBindingMatcher = createTestee()

                    const result: boolean = testee.shouldPreventDefaultBehaviour(keyBinding, keystrokes, false)

                    expect(result).toBeFalse()
                })
            })

            describe('when the keystroke order does not matter', () => {
                it('returns false when a unordered subset of keystrokes are given', () => {
                    const keys: [string, ...string[]] = ['KeyA', 'KeyB', 'KeyC']
                    const keystrokes: string[] = ['KeyC', 'KeyA']
                    const keyBinding: KeyBinding = createKeyBinding({ keys, useOrderedMatching: false, shouldPreventDefaultBehaviourForPartialMatches: false })
                    const testee: Tv2KeyBindingMatcher = createTestee()

                    const result: boolean = testee.shouldPreventDefaultBehaviour(keyBinding, keystrokes, false)

                    expect(result).toBeFalse()
                })

                it('returns false when a unordered superset of keystrokes are given', () => {
                    const keys: [string, ...string[]] = ['KeyA', 'KeyB', 'KeyC']
                    const keystrokes: string[] = ['KeyC', 'KeyA', 'KeyB', 'KeyD']
                    const keyBinding: KeyBinding = createKeyBinding({ keys, useOrderedMatching: false, shouldPreventDefaultBehaviourForPartialMatches: false })
                    const testee: Tv2KeyBindingMatcher = createTestee()

                    const result: boolean = testee.shouldPreventDefaultBehaviour(keyBinding, keystrokes, false)

                    expect(result).toBeFalse()
                })

                it('returns false when a unordered functional equivalent set of keystrokes are given', () => {
                    const keys: [string, ...string[]] = ['KeyA', 'KeyB', 'KeyC']
                    const keystrokes: string[] = ['KeyC', 'KeyA', 'KeyB']
                    const keyBinding: KeyBinding = createKeyBinding({ keys, useOrderedMatching: false, shouldPreventDefaultBehaviourForPartialMatches: false })
                    const testee: Tv2KeyBindingMatcher = createTestee()

                    const result: boolean = testee.shouldPreventDefaultBehaviour(keyBinding, keystrokes, false)

                    expect(result).toBeFalse()
                })

                it('returns false when a ordered subset of keystrokes are given', () => {
                    const keys: [string, ...string[]] = ['KeyA', 'KeyB', 'KeyC']
                    const keystrokes: string[] = ['KeyA', 'KeyB']
                    const keyBinding: KeyBinding = createKeyBinding({ keys, useOrderedMatching: false, shouldPreventDefaultBehaviourForPartialMatches: false })
                    const testee: Tv2KeyBindingMatcher = createTestee()

                    const result: boolean = testee.shouldPreventDefaultBehaviour(keyBinding, keystrokes, false)

                    expect(result).toBeFalse()
                })

                it('returns false when a ordered superset of keystrokes are given', () => {
                    const keys: [string, ...string[]] = ['KeyA', 'KeyB', 'KeyD']
                    const keystrokes: string[] = ['KeyA', 'KeyB', 'KeyC', 'KeyD', 'KeyE']
                    const keyBinding: KeyBinding = createKeyBinding({ keys, useOrderedMatching: false, shouldPreventDefaultBehaviourForPartialMatches: false })
                    const testee: Tv2KeyBindingMatcher = createTestee()

                    const result: boolean = testee.shouldPreventDefaultBehaviour(keyBinding, keystrokes, false)

                    expect(result).toBeFalse()
                })

                it('returns false when a ordered functional equivalent set of keystrokes are given', () => {
                    const keys: [string, ...string[]] = ['KeyA', 'KeyB', 'KeyD']
                    const keystrokes: string[] = ['KeyA', 'KeyB', 'KeyD']
                    const keyBinding: KeyBinding = createKeyBinding({ keys, useOrderedMatching: false, shouldPreventDefaultBehaviourForPartialMatches: false })
                    const testee: Tv2KeyBindingMatcher = createTestee()

                    const result: boolean = testee.shouldPreventDefaultBehaviour(keyBinding, keystrokes, false)

                    expect(result).toBeFalse()
                })
            })
        })

        describe('when a matching key press should prevent default behaviour', () => {
            it('returns true on matching key press', () => {
                const keys: [string, ...string[]] = ['KeyA', 'KeyB']
                const keystrokes: string[] = [...keys]
                const keyBinding: KeyBinding = createKeyBinding({ keys, shouldPreventDefaultBehaviourOnKeyPress: true })
                const testee: Tv2KeyBindingMatcher = createTestee()

                const result: boolean = testee.shouldPreventDefaultBehaviour(keyBinding, keystrokes, false)

                expect(result).toBeTrue()
            })

            it('returns false on matching key release', () => {
                const keys: [string, ...string[]] = ['KeyA', 'KeyB']
                const keystrokes: string[] = [...keys]
                const keyBinding: KeyBinding = createKeyBinding({ keys, shouldPreventDefaultBehaviourOnKeyPress: true })
                const testee: Tv2KeyBindingMatcher = createTestee()

                const result: boolean = testee.shouldPreventDefaultBehaviour(keyBinding, keystrokes, true)

                expect(result).toBeFalse()
            })
        })

        describe('when a matching key press should not prevent default behaviour', () => {
            it('returns false on matching key press', () => {
                const keys: [string, ...string[]] = ['KeyA', 'KeyB']
                const keystrokes: string[] = [...keys]
                const keyBinding: KeyBinding = createKeyBinding({ keys, shouldPreventDefaultBehaviourOnKeyPress: false })
                const testee: Tv2KeyBindingMatcher = createTestee()

                const result: boolean = testee.shouldPreventDefaultBehaviour(keyBinding, keystrokes, false)

                expect(result).toBeFalse()
            })

            it('returns false on matching key release', () => {
                const keys: [string, ...string[]] = ['KeyA', 'KeyB']
                const keystrokes: string[] = [...keys]
                const keyBinding: KeyBinding = createKeyBinding({ keys, shouldPreventDefaultBehaviourOnKeyPress: false })
                const testee: Tv2KeyBindingMatcher = createTestee()

                const result: boolean = testee.shouldPreventDefaultBehaviour(keyBinding, keystrokes, true)

                expect(result).toBeFalse()
            })
        })
    })
})

function createTestee(): Tv2KeyBindingMatcher {
    return new Tv2KeyBindingMatcher()
}

function createKeyBinding(keyBinding: Partial<KeyBinding>): KeyBinding {
    return {
        keys: ['KeyA'],
        label: '',
        onMatched(): void {},
        shouldMatchOnKeyRelease: false,
        shouldPreventDefaultBehaviourForPartialMatches: false,
        shouldPreventDefaultBehaviourOnKeyPress: false,
        useExclusiveMatching: false,
        useOrderedMatching: false,
        ...keyBinding,
    }
}
