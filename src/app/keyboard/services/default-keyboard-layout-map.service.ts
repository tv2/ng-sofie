export class DefaultKeyboardLayoutMapService {
  public createDefaultKeyboardLayoutMap(): KeyboardLayoutMap {
    return new Map([...this.createDigitMappings(), ...this.createAlphabeticMappings(), ...this.createSpecialKeyMappings()])
  }

  private createDigitMappings(): [string, string][] {
    return [...Array(10)]
      .map((_, index: number) => index.toString())
      .flatMap(digit => [
        [`Digit${digit}`, digit],
        [`NumpadDigit${digit}`, digit],
      ])
  }

  private createAlphabeticMappings(): [string, string][] {
    return [...Array(26)].map((_, index: number) => String.fromCharCode(index + 65)).map(character => [`Key${character}`, character])
  }

  private createSpecialKeyMappings(): [string, string][] {
    return [
      ['BracketLeft', '['],
      ['BracketRight', ']'],
      ['Comma', ','],
      ['Period', '.'],
      ['Semicolon', ';'],
      ['Backslash', '\\'],
      ['IntlBackslash', '<'],
      ['Slash', '/'],
      ['Minus', '-'],
      ['NumpadMinus', '-'],
      ['Plus', '+'],
      ['NumpadPlus', '+'],
      ['NumpadMultiply', '*'],
      ['Equal', '='],
      ['NumpadEqual', '='],
      ['Quote', '"'],
      ['Backquote', '`'],
    ]
  }
}
