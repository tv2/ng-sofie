import { Metadata } from './metadata'

export class SegmentMetadata implements Metadata {
  public miniShelfVideoClipFile?: string
  constructor(id: string) {
    this.miniShelfVideoClipFile = id
  }
}