import { PieceGroupService } from './piece-group.service'
import { OutputLayerService } from '../../shared/services/output-layer.service'
import { instance, mock } from '@typestrong/ts-mockito'
import { Piece } from '../../core/models/piece'
import { TestEntityFactory } from '../../core/services/models/test-entity.factory'
import { Tv2OutputLayer } from '../../core/models/tv2-output-layer'

describe(PieceGroupService.name, () => {
  describe(PieceGroupService.prototype.groupByOutputLayer.name, () => {
    it('returns no layers when no layers are given', () => {
      const testee: PieceGroupService = createTestee()
      const pieces: Piece[] = []

      const result: Record<Tv2OutputLayer, Piece[]> = testee.groupByOutputLayer(pieces)

      expect(result).toEqual({} as Record<Tv2OutputLayer, Piece[]>)
    })

    it('returns a single layer for PGM with one piece if given a piece on PGM', () => {
      const testEntityFactory: TestEntityFactory = new TestEntityFactory()
      const pieces: Piece[] = [testEntityFactory.createPiece()]
      const testee: PieceGroupService = createTestee()

      const result: Record<Tv2OutputLayer, Piece[]> = testee.groupByOutputLayer(pieces)

      expect(result[Tv2OutputLayer.PROGRAM]).toEqual(pieces)
    })

    it('returns a single layer for PGM with two pieces if given two piece on PGM', () => {
      const testEntityFactory: TestEntityFactory = new TestEntityFactory()
      const pieces: Piece[] = [testEntityFactory.createPiece(), testEntityFactory.createPiece()]
      const testee: PieceGroupService = createTestee()

      const result: Record<Tv2OutputLayer, Piece[]> = testee.groupByOutputLayer(pieces)

      expect(result[Tv2OutputLayer.PROGRAM]).toEqual(pieces)
    })

    it('returns layers for PGM and OVERLAY with each one piece if given a piece for PGM and one for OVERLAY', () => {
      const testEntityFactory: TestEntityFactory = new TestEntityFactory()
      const pieces: Piece[] = [testEntityFactory.createPiece(), testEntityFactory.createPiece()]
      const testee: PieceGroupService = createTestee()

      const result: Record<Tv2OutputLayer, Piece[]> = testee.groupByOutputLayer(pieces)

      expect(result[Tv2OutputLayer.PROGRAM]).toEqual([pieces[0]])
      expect(result[Tv2OutputLayer.OVERLAY]).toEqual([pieces[1]])
    })
  })
})

function createTestee(): PieceGroupService {
  return new PieceGroupService()
}
