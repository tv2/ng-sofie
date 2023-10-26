import { EntityParser } from '../abstractions/entity-parser.service'
import { BasicRundown } from '../models/basic-rundown'
import { Part } from '../models/part'
import { Piece } from '../models/piece'
import { Rundown } from '../models/rundown'
import { Segment } from '../models/segment'
import * as zod from 'zod'
import { Tv2PieceType } from '../enums/tv2-piece-type'
import { ShowStyleVariant } from '../models/show-style-variant'
import { Tv2OutputLayer } from '../models/tv2-output-layer'

export class ZodEntityParser implements EntityParser {
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

  private readonly cameraPieceLayers: string[] = ['studio0_camera']
  private readonly replayPieceLayers: string[] = ['studio0_local']
  private readonly graphicsPieceLayers: string[] = ['studio0_graphicsTelefon', 'studio0_pilot', 'studio0_selected_graphicsFull', 'studio0_graphicsIdent', 'studio0_graphicsTop', 'studio0_graphicsLower', 'studio0_graphicsHeadline', 'studio0_graphicsTema', 'studio0_overlay', 'studio0_pilotOverlay', 'studio0_wall_graphics', 'studio0_graphic_show_lifecycle']
  private readonly remotePieceLayers: string[] = ['studio0_live']
  private readonly splitScreenPieceLayers: string[] = ['studio0_dve', 'studio0_dve_adlib']
  private readonly videoClipPieceLayers: string[] = ['studio0_clip', 'studio0_selected_clip']
  private readonly voiceOverPieceLayers: string[] = ['studio0_voiceover', 'studio0_selected_voiceover']
  private readonly audioPieceLayers: string[] = ['studio0_audio_bed']
  private readonly manusPieceLayers: string[] = ['studio0_script']
  private readonly transitionPieceLayers: string[] = ['studio0_jingle']
  private readonly hiddenPieceLayers: string[] = ['studio0_selected_clip', 'studio0_selected_voiceover', 'studio0_selected_graphicsFull', 'studio0_aux_viz_full1', 'studio0_graphic_show_lifecycle', 'studio0_current_server_clip', 'studio0_full_back', 'studio0_dve_back', 'studio0_design', 'studio0_aux_mix_minus', 'studio0_dsk_1_cmd', 'studio0_dsk_2_cmd', 'studio0_dsk_3_cmd', 'studio0_dsk_4_cmd']
  private readonly pieceParser = zod.object({
    id: zod.string().min(1),
    partId: zod.string().min(1),
    name: zod.string().min(1),
    layer: zod.string().min(1),
    outputLayer: zod.string().min(1),
    start: zod.number(),
    duration: zod.number().nullish().transform(duration => duration ?? undefined),
    isPlanned: zod.boolean(),
    hasContent: zod.boolean(),
  }).transform(rawPiece => ({
    ...rawPiece,
    type: this.convertToPieceType(rawPiece.layer),
    outputLayer: this.convertToOutputLayer(rawPiece.outputLayer, rawPiece.layer),
  }))

  private readonly partParser = zod.object({
    id: zod.string().min(1),
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
    isPlanned: zod.boolean(),
  })

  private readonly segmentParser = zod.object({
    id: zod.string().min(1),
    rundownId: zod.string().min(1),
    name: zod.string().min(1),
    isOnAir: zod.boolean(),
    isNext: zod.boolean(),
    parts: this.partParser.array(),
    budgetDuration: zod.number().optional(),
  })

  private readonly basicRundownParser = zod.object({
    id: zod.string().min(1),
    name: zod.string().min(1),
    isActive: zod.boolean(),
    modifiedAt: zod.number(),
  })

  private readonly basicRundownsParser = this.basicRundownParser.array()

  private readonly rundownParser = this.basicRundownParser.extend({
    segments: this.segmentParser.array(),
    infinitePieces: this.pieceParser.array(),
  })

  public parsePiece(piece: unknown): Piece {
    return this.pieceParser.parse(piece)
  }

  public parsePart(part: unknown): Part {
    return this.partParser.parse(part)
  }

  public parseSegment(segment: unknown): Segment {
    return this.segmentParser.parse(segment)
  }

  public parseBasicRundown(basicRundown: unknown): BasicRundown {
    return this.basicRundownParser.parse(basicRundown)
  }

  public parseBasicRundowns(basicRundowns: unknown): BasicRundown[] {
    return this.basicRundownsParser.parse(basicRundowns)
  }

  public parseRundown(rundown: unknown): Rundown {
    return this.rundownParser.parse(rundown)
  }

  public parseShowStyleVariant(showStyleVariant: unknown): ShowStyleVariant {
    return this.showStyleVariantParser.parse(showStyleVariant)
  }

  private convertToPieceType(pieceLayer: string): Tv2PieceType {
    if (this.cameraPieceLayers.includes(pieceLayer)) {
      return Tv2PieceType.CAMERA
    }

    if (this.replayPieceLayers.includes(pieceLayer)) {
      return Tv2PieceType.REPLAY
    }

    if (this.remotePieceLayers.includes(pieceLayer)) {
      return Tv2PieceType.REMOTE
    }

    if (this.graphicsPieceLayers.includes(pieceLayer)) {
      return Tv2PieceType.GRAPHICS
    }

    if (this.splitScreenPieceLayers.includes(pieceLayer)) {
      return Tv2PieceType.SPLIT_SCREEN
    }

    if (this.videoClipPieceLayers.includes(pieceLayer)) {
      return Tv2PieceType.VIDEO_CLIP
    }

    if (this.voiceOverPieceLayers.includes(pieceLayer)) {
      return Tv2PieceType.VOICE_OVER
    }

    if (this.audioPieceLayers.includes(pieceLayer)) {
      return Tv2PieceType.AUDIO
    }

    if (this.manusPieceLayers.includes(pieceLayer)) {
      return Tv2PieceType.MANUS
    }

    if (this.transitionPieceLayers.includes(pieceLayer)) {
      return Tv2PieceType.TRANSITION
    }

    return Tv2PieceType.UNKNOWN
  }

  private convertToOutputLayer(rawOutputLayer: string, pieceLayer: string): Tv2OutputLayer {
    if (this.hiddenPieceLayers.includes(pieceLayer)) {
      return Tv2OutputLayer.NONE
    }

    switch (rawOutputLayer) {
      case 'pgm':
        return Tv2OutputLayer.PROGRAM
      case 'sec':
        return Tv2OutputLayer.SECONDARY
      case 'jingle':
        return Tv2OutputLayer.JINGLE
      case 'overlay':
        return Tv2OutputLayer.OVERLAY
      case 'aux':
        return Tv2OutputLayer.AUXILIARY
      case 'manus':
        return Tv2OutputLayer.MANUS
      case 'musik':
        return Tv2OutputLayer.AUDIO
      default:
        return Tv2OutputLayer.NONE
    }
  }
}
