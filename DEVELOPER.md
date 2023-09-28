# Developer conventions

## Typescript

### Naming conventions

_**TODO:** Should we use units formats for e.g. number values (`timeSinceYesterdayInMs` | `activatedRundownAtEpochTime`)._

### Logging
Production log level should be `info`, in order to have a sufficient amount of information when a incident occurs.
From this decision, it is important that we limit the use of info log statements, such that we don't drown out the important information.

A log entry should at least contain the following:
```typescript
interface LogEntry {
    level: 'error' | 'warn' | 'info' | 'debug' | 'trace',
    timestamp: number,
    message: string,
    tag: string // The owner of the log statement (e.g. RundownService)
    data?: unknown, // Potential information, e.g. error message including stack trace.
}
```

## SASS/SCSS

### Naming conventions

**Variables**

_**TODO:** Find out how to handle global settings such as color palettes, sizings, etc..._

**Attribute order**

When writing scss the suggested attribute order is:

* **Structural:** Position type, display type, box-sizing, etc.
* **Placement and sizing:** Absolute position, width, height, padding, margin, etc.
* **Design:** Background coloring, borders, cursor, etc.
* **Typography:** Text color, font family, font weight, text align, etc.
* **Other:** Transitions, no select, pointer events, etc.


```scss
.some-class {
  postion: absolute;
  display: flex;
  box-sizing: border-box;

  left: 30%;
  width: 400px;
  height: auto;

  background-color: red;
  color: deeppink;
  overflow: auto;
  cursor: pointer;
  
  font-family: Roboto, "Helvetica Neue", sans-serif;
  font-weight: bold;
  font-size: 1.25rem;

  transition: width 5s;
  pointer-events: none;
  user-select: text;
}
```

**Component modifiers**

Components should not have any base class, but can add modifiers.
An example could be a Segment component, which can be in either off-air or on-air mode.
The default would be off-air and when changing to on-air the class `on-air` would be appended to the class list of the host element.
````html
<!-- Off-air segment> -->
<sofie-segment>...</sofie-segment>

<!-- On-air segment> -->
<sofie-segment class="on-air">...</sofie-segment>
````
