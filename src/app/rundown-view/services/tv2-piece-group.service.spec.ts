import { Tv2PieceGroupService } from './tv2-piece-group.service'
import { TestEntityFactory } from '../../core/services/models/test-entity.factory'
import { Tv2OutputLayer } from '../../core/models/tv2-output-layer'
import { Tv2PieceType } from '../../core/enums/tv2-piece-type'
import { Tv2Piece } from '../../core/models/tv2-piece'

describe(Tv2PieceGroupService.name, () => {
  describe(Tv2PieceGroupService.prototype.groupByOutputLayer.name, () => {
    it('returns no layers when no layers are given', () => {
      const pieces: Tv2Piece[] = []
      const testee: Tv2PieceGroupService = createTestee()

      const result: Record<Tv2OutputLayer, Tv2Piece[]> = testee.groupByOutputLayer(pieces)

      expect(result).toEqual({} as Record<Tv2OutputLayer, Tv2Piece[]>)
    })

    it('returns a single layer for PGM with one piece if given a piece on PGM', () => {
      const pieces: Tv2Piece[] = [createTv2Piece(Tv2OutputLayer.PROGRAM)]
      const testee: Tv2PieceGroupService = createTestee()

      const result: Record<Tv2OutputLayer, Tv2Piece[]> = testee.groupByOutputLayer(pieces)

      expect(result[Tv2OutputLayer.PROGRAM]).toEqual(pieces)
    })

    it('returns a single layer for PGM with two pieces if given two piece on PGM', () => {
      const pieces: Tv2Piece[] = [createTv2Piece(Tv2OutputLayer.PROGRAM), createTv2Piece(Tv2OutputLayer.PROGRAM)]
      const testee: Tv2PieceGroupService = createTestee()

      const result: Record<Tv2OutputLayer, Tv2Piece[]> = testee.groupByOutputLayer(pieces)

      expect(result[Tv2OutputLayer.PROGRAM]).toEqual(pieces)
    })

    it('returns layers for PGM and OVERLAY with each one piece if given a piece for PGM and one for OVERLAY', () => {
      const pieces: Tv2Piece[] = [createTv2Piece(Tv2OutputLayer.PROGRAM), createTv2Piece(Tv2OutputLayer.OVERLAY)]
      const testee: Tv2PieceGroupService = createTestee()

      const result: Record<Tv2OutputLayer, Tv2Piece[]> = testee.groupByOutputLayer(pieces)

      expect(result[Tv2OutputLayer.PROGRAM]).toEqual([pieces[0]])
      expect(result[Tv2OutputLayer.OVERLAY]).toEqual([pieces[1]])
    })
  })
})

function createTestee(): Tv2PieceGroupService {
  return new Tv2PieceGroupService()
}

function createTv2Piece(outputLayer: Tv2OutputLayer, pieceType: Tv2PieceType = Tv2PieceType.UNKNOWN): Tv2Piece {
  const testEntityFactory: TestEntityFactory = new TestEntityFactory()
  return testEntityFactory.createPiece({ metadata: { type: pieceType, outputLayer } }) as Tv2Piece
}
