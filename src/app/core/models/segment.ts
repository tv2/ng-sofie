import { Part, PartInterface } from './part'
import { PartEvent } from './rundown-event'

export interface SegmentInterface {
  id: string
  rundownId: string
  name: string
  isOnAir: boolean
  isNext: boolean
  parts: PartInterface[]
}

export class Segment {
  id: string
  rundownId: string
  name: string
  isOnAir: boolean
  isNext: boolean
  parts: Part[]

  constructor(segment: SegmentInterface) {
    this.id = segment.id
    this.rundownId = segment.rundownId
    this.name = segment.name
    this.isOnAir = segment.isOnAir
    this.isNext = segment.isNext
    this.parts = segment.parts.map(part => new Part(part))
  }

  public putOnAir(activateEvent: { partId: string }): void {
    this.isOnAir = true
    const part: Part | undefined = this.parts.find(part => part.id === activateEvent.partId)
    if (!part) {
      // Handle unable to activate
      return
    }
    part.putOnAir()
  }

  public takeOffAir(): void {
    this.isOnAir = false
    this.parts.forEach(part => part.takeOffAir())
  }

  public removeAsNextSegment(): void {
    this.isNext = false
    this.parts.find(part => part.isNext)?.removeAsNextPart()
  }

  public setAsNextSegment(setNextEvent: PartEvent): void {
    this.isNext = true
    this.parts.find(part => part.id === setNextEvent.partId)?.setAsNextPart()
  }
}
