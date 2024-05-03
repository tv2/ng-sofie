import { Tv2PieceTooltipContentFieldService } from './tv2-piece-tooltip-content-field.service'
import { Tv2OutputLayer } from '../../core/models/tv2-output-layer'
import { Tv2PieceType } from '../../core/enums/tv2-piece-type'
import { Tv2Piece } from '../../core/models/tv2-piece'
import { TestEntityFactory } from '../../test/factories/test-entity.factory'
import { TooltipContentField } from '../../shared/abstractions/tooltip-content-field'
import { Media } from '../../shared/services/media'
import { instance, mock } from '@typestrong/ts-mockito'
import { TimerPipe } from '../../shared/pipes/timer/timer.pipe'

describe(Tv2PieceTooltipContentFieldService.name, () => {
  it('should return no content fields for Tv2Piece with unknown PieceType', () => {
    const testee: Tv2PieceTooltipContentFieldService = createTestee()
    const piece: Tv2Piece = createTv2Piece(Tv2PieceType.UNKNOWN)
    const mediaForPiece: Media | undefined = undefined
    const partDuration: number = 0

    const result: TooltipContentField[] = testee.getTooltipContentForPiece(piece, mediaForPiece, partDuration)

    expect(result).toEqual([])
  })

  it('should return content fields for Tv2Pieces with valid PieceTypes', () => {
    const testee: Tv2PieceTooltipContentFieldService = createTestee()
    const mediaForAllPieces: Media | undefined = undefined
    const partDuration: number = 0

    const validTooltipPieceTypes: Tv2PieceType[] = [Tv2PieceType.VIDEO_CLIP, Tv2PieceType.JINGLE, Tv2PieceType.AUDIO, Tv2PieceType.COMMAND, Tv2PieceType.GRAPHICS, Tv2PieceType.OVERLAY_GRAPHICS]

    const validTooltipPieces: Tv2Piece[] = validTooltipPieceTypes.map(type => createTv2Piece(type))

    validTooltipPieces.forEach(piece => {
      const result: TooltipContentField[] = testee.getTooltipContentForPiece(piece, mediaForAllPieces, partDuration)
      expect(result.length).toBeGreaterThan(0)
    })
  })

  it('returns three content fields for a Tv2Piece of type VIDEO_CLIP', () => {
    const testee: Tv2PieceTooltipContentFieldService = createTestee()
    const mediaForAllPieces: Media | undefined = undefined
    const partDuration: number = 0
    const videoClipPiece: Tv2Piece = createTv2Piece(Tv2PieceType.VIDEO_CLIP)

    const result: TooltipContentField[] = testee.getTooltipContentForPiece(videoClipPiece, mediaForAllPieces, partDuration)

    expect(result.length).toEqual(3)
  })
})

function createTestee(): Tv2PieceTooltipContentFieldService {
  const mockedTimerPiper: TimerPipe = instance(mock<TimerPipe>())
  return new Tv2PieceTooltipContentFieldService(mockedTimerPiper)
}

function createTv2Piece(pieceType: Tv2PieceType, outputLayer: Tv2OutputLayer = Tv2OutputLayer.PROGRAM): Tv2Piece {
  return TestEntityFactory.createPiece({ metadata: { type: pieceType, outputLayer } }) as Tv2Piece
}
