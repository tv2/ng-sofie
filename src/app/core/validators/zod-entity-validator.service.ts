import { EntityValidator } from '../abstractions/entity-validator.service'
import { BasicRundown } from '../models/basic-rundown'
import { Part } from '../models/part'
import { Rundown } from '../models/rundown'
import { Segment } from '../models/segment'
import * as zod from 'zod'
import { ShowStyleVariant } from '../models/show-style-variant'
import { Tv2PieceType } from '../enums/tv2-piece-type'
import { Tv2OutputLayer } from '../models/tv2-output-layer'
import { RundownTimingType } from '../enums/rundown-timing-type'
import { Tv2AudioMode } from '../enums/tv2-audio-mode'
import { Tv2Piece } from '../models/tv2-piece'

export class ZodEntityValidator implements EntityValidator {
  private readonly blueprintConfigurationParser = zod.object({
    SelectedGfxSetupName: zod.object({
      value: zod.string(),
      label: zod.string(),
    }),
    GfxDefaults: zod
      .object({
        id: zod.optional(zod.string()),
        DefaultSetupName: zod.object({
          value: zod.string(),
          label: zod.string(),
        }),
        DefaultSchema: zod.object({
          value: zod.string(),
          label: zod.string(),
        }),
        DefaultDesign: zod.object({
          value: zod.string(),
          label: zod.string(),
        }),
      })
      .array(),
  })

  private readonly showStyleVariantParser = zod.object({
    id: zod.string().min(1),
    showStyleBaseId: zod.string().min(1),
    name: zod.string().min(1),
    blueprintConfiguration: this.blueprintConfigurationParser,
  })

  private readonly pieceParser = zod.object({
    id: zod.string().min(1),
    partId: zod.string().min(1),
    name: zod.string().min(1),
    layer: zod.string().min(1),
    start: zod.number(),
    duration: zod.number().optional(),
    isPlanned: zod.boolean(),
    // TODO: Should this be less TV2 specific.
    metadata: zod.object({
      type: zod.nativeEnum(Tv2PieceType),
      outputLayer: zod.nativeEnum(Tv2OutputLayer).optional(),
      audioMode: zod.nativeEnum(Tv2AudioMode).optional(),
    }),
  })

  private readonly partParser = zod.object({
    id: zod.string().min(1),
    rank: zod.number(),
    segmentId: zod.string().min(1),
    isOnAir: zod.boolean(),
    isNext: zod.boolean(),
    pieces: this.pieceParser.array(),
    expectedDuration: zod
      .number()
      .nullish()
      .transform(expectedDuration => expectedDuration ?? undefined), // TODO: Normalize the type to number | undefined
    executedAt: zod.number(),
    playedDuration: zod.number(),
    autoNext: zod.object({ overlap: zod.number() }).optional(),
    isUnsynced: zod.boolean(),
    isPlanned: zod.boolean(),
    isUntimed: zod.boolean(),
  })

  private readonly segmentParser = zod.object({
    id: zod.string().min(1),
    rundownId: zod.string().min(1),
    name: zod.string().min(1),
    isOnAir: zod.boolean(),
    isNext: zod.boolean(),
    isUntimed: zod.boolean(),
    isUnsynced: zod.boolean(),
    parts: this.partParser.array(),
    rank: zod.number(),
    expectedDurationInMs: zod.number().optional(),
    executedAtEpochTime: zod.number().optional(),
  })

  private readonly basicRundownParser = zod.object({
    id: zod.string().min(1),
    name: zod.string().min(1),
    isActive: zod.boolean(),
    modifiedAt: zod.number(),
    timing: zod
      .object({
        type: zod.literal(RundownTimingType.UNSCHEDULED),
        expectedDurationInMs: zod.number().optional(),
      })
      .or(
        zod.object({
          type: zod.literal(RundownTimingType.FORWARD),
          expectedStartEpochTime: zod.number(),
          expectedDurationInMs: zod.number().optional(),
          expectedEndEpochTime: zod.number().optional(),
        })
      )
      .or(
        zod.object({
          type: zod.literal(RundownTimingType.BACKWARD),
          expectedStartEpochTime: zod.number().optional(),
          expectedDurationInMs: zod.number().optional(),
          expectedEndEpochTime: zod.number(),
        })
      ),
  })

  private readonly basicRundownsParser = this.basicRundownParser.array()

  private readonly rundownParser = this.basicRundownParser.extend({
    segments: this.segmentParser.array(),
    infinitePieces: this.pieceParser.array(),
  })

  public validatePiece(piece: Tv2Piece): Tv2Piece {
    return this.pieceParser.parse(piece)
  }

  public validatePart(part: Part): Part {
    return this.partParser.parse(part)
  }

  public validateSegment(segment: Segment): Segment {
    return this.segmentParser.parse(segment)
  }

  public validateBasicRundown(basicRundown: BasicRundown): BasicRundown {
    return this.basicRundownParser.parse(basicRundown)
  }

  public validateBasicRundowns(basicRundowns: BasicRundown[]): BasicRundown[] {
    return this.basicRundownsParser.parse(basicRundowns)
  }

  public validateRundown(rundown: Rundown): Rundown {
    return this.rundownParser.parse(rundown)
  }

  public validateShowStyleVariant(showStyleVariant: ShowStyleVariant): ShowStyleVariant {
    return this.showStyleVariantParser.parse(showStyleVariant)
  }
}
