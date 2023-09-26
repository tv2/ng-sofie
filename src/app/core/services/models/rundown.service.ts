import { Rundown } from '../../_models/rundown'
import { SegmentService } from './segment.service'
import { Segment } from '../../_models/segment'
import { Part } from '../../_models/part'
import { RundownCursor } from '../../_models/rundown-cursor'
import { RundownInterface } from '../../models/rundown'
import { timestamp } from 'rxjs'

export class RundownService {
    constructor(private readonly segmentService: SegmentService) {}

    public activate(rundown: Rundown, activatedAt: number): Rundown {
        const resetRundown: Rundown = this.reset(rundown)
        return {
            ...resetRundown,
            isActive: true,
            segments: this.putFirstSegmentOnAir(rundown, activatedAt)
        }
    }

    private reset(rundown: Rundown): Rundown {
        return {
            ...rundown,
            segments: rundown.segments.map(segment => this.segmentService.reset(segment))
        }
    }

    private putFirstSegmentOnAir(rundown: Rundown, timestamp: number): Segment[] {
        if (rundown.segments.length === 0) {
            return []
        }

        // TODO: Should we find the first segment with a part?
        const [firstSegment, ...segments]: Segment[] = rundown.segments
        const firstPart: Part = firstSegment.parts[0]
        if(!firstPart) {
            return rundown.segments
        }

        return [
            this.segmentService.putOnAir(firstSegment, firstPart.id, timestamp),
            ...segments
        ]
    }

    public deactivate(rundown: Rundown, deactivatedAt: number): Rundown {
        return {
            ...rundown,
            isActive: false,
            segments: this.takeAllSegmentsOffAir(rundown, deactivatedAt),
            infinitePieces: {},
        }
    }

    private takeAllSegmentsOffAir(rundown: Rundown, takenOffAirAt: number): Segment[] {
        return rundown.segments.map(segment => this.segmentService.takeOffAir(segment, takenOffAirAt))
    }

    public takeNext(rundown: Rundown, rundownCursor: RundownCursor, putOnAirAt: number): Rundown {
        const segmentsPossiblyWithoutSegmentOnAir: Segment[] = this.takeOnAirSegmentOffAirIfNotSetAsNext(rundown.segments, rundownCursor.segmentId, putOnAirAt)
        return {
            ...rundown,
            segments: this.putSegmentOnAir(segmentsPossiblyWithoutSegmentOnAir, rundownCursor, putOnAirAt)
        }
    }

    private takeOnAirSegmentOffAirIfNotSetAsNext(segments: Segment[], nextSegmentId: string, takenOffAirAt: number): Segment[] {
        return segments.map(segment => segment.isOnAir && segment.id !== nextSegmentId ? this.segmentService.takeOffAir(segment, takenOffAirAt) : segment)
    }

    private putSegmentOnAir(segments: Segment[], rundownCursor: RundownCursor, takenAt: number): Segment[] {
        return segments.map(segment => {
            if (segment.id !== rundownCursor.segmentId) {
                return segment
            }
            return this.segmentService.putOnAir(segment, rundownCursor.partId, takenAt)
        })
    }

    public setNext(rundown: Rundown, rundownCursor: RundownCursor): Rundown {
        const segmentsWithNextSegmentPossiblyReset: Segment[] = this.resetSegmentIfOffAir(rundown.segments, rundownCursor.segmentId)
        return {
            ...rundown,
            segments: this.setSegmentAsNext(this.unmarkSegmentsSetAsNext(segmentsWithNextSegmentPossiblyReset), rundownCursor),
        }
    }

    private resetSegmentIfOffAir(segments: Segment[], segmentId: string): Segment[] {
        return segments.map(segment => segment.id === segmentId && !segment.isOnAir ? this.segmentService.reset(segment) : segment)
    }

    private unmarkSegmentsSetAsNext(segments: Segment[]): Segment[] {
        return segments.map(segment => segment.isNext ? this.segmentService.removeAsNextSegment(segment) : segment)
    }

    private setSegmentAsNext(segments: Segment[], rundownCursor: RundownCursor): Segment[] {
        return segments.map(segment => segment.id === rundownCursor.segmentId ? this.segmentService.setAsNextSegment(segment, rundownCursor.partId) : segment)
    }
}
