import {Rundown} from '../models/rundown';
import {Segment} from '../models/segment';
import {Part} from '../models/part';
import {Piece} from '../models/piece';
import {Injectable} from '@angular/core';

@Injectable()
export class MockDataService {

  public currentSegment: Segment
  public currentPart: Part

  public nextSegment: Segment
  public nextPart: Part

  public rundowns: Rundown[] = [
    this.createRundown('R-1'),
    this.createRundown('R-2'),
  ]

  private createRundown(rundownId: string): Rundown {
    const segments: Segment[] = []
    for (let i = 0; i < Math.random() * 10; i++) {
      segments.push(this.createSegment(`${rundownId} S-${i}`, rundownId))
    }
    return new Rundown({
      id: rundownId,
      name: `Rundown ${rundownId}`,
      segments,
      isActive: false,
      infinitePieces: []
    })
  }

  private createSegment(segmentId: string, rundownId: string): Segment {
    const parts: Part[] = []
    for (let i = 0; i < Math.random() * 10; i++) {
      parts.push(this.createPart(`${segmentId} P-${i}`, segmentId))
    }
    return new Segment({
      id: segmentId,
      rundownId,
      name: `Segment ${segmentId}`,
      isNext: false,
      isOnAir: false,
      parts
    })
  }

  private createPart(partId: string, segmentId: string): Part {
    const pieces: Piece[] = []
    for (let i = 0; i < Math.random() * 2; i++) {
      pieces.push(
        {
          id: `${partId} pi-${i}`,
          partId,
          name: `Pi ${i}`,
          layer: 'someLayer'
        }
      )
    }
    return new Part({
      id: partId,
      segmentId,
      isOnAir: false,
      isNext: false,
      pieces
    })
  }
}
