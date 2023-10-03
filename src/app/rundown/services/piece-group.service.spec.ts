import { PieceGroupService } from './piece-group.service'
import { PieceLayerService } from '../../shared/services/piece-layer.service'
import { anything, instance, mock, when } from '@typestrong/ts-mockito'
import { PieceLayer } from '../../shared/enums/piece-layer'
import { Piece } from '../../core/models/piece'
import { TestEntityFactory } from '../../core/services/models/test-entity.factory'

describe(PieceGroupService.name, () => {
  describe(PieceGroupService.prototype.groupByPieceLayer.name, () => {
    it('returns no layers when no layers are given', () => {
      const testee: PieceGroupService = createTestee()
      const pieces: Piece[] = []

      const result: Record<PieceLayer, Piece[]> = testee.groupByPieceLayer(pieces)

      expect(result).toEqual({} as Record<PieceLayer, Piece[]>)
    })

    it('returns a single layer for PGM with one piece if given a piece on PGM', () => {
      const testEntityFactory: TestEntityFactory = new TestEntityFactory()
      const pieces: Piece[] = [testEntityFactory.createPiece()]
      const mockedPieceLayerService: PieceLayerService = mock<PieceLayerService>()
      when(mockedPieceLayerService.getPieceLayer(anything())).thenReturn(PieceLayer.PGM)
      const testee: PieceGroupService = createTestee(instance(mockedPieceLayerService))

      const result: Record<PieceLayer, Piece[]> = testee.groupByPieceLayer(pieces)

      expect(result[PieceLayer.PGM]).toEqual(pieces)
    })

    it('returns a single layer for PGM with two pieces if given two piece on PGM', () => {
      const testEntityFactory: TestEntityFactory = new TestEntityFactory()
      const pieces: Piece[] = [testEntityFactory.createPiece(), testEntityFactory.createPiece()]
      const mockedPieceLayerService: PieceLayerService = mock<PieceLayerService>()
      when(mockedPieceLayerService.getPieceLayer(anything())).thenReturn(PieceLayer.PGM)
      const testee: PieceGroupService = createTestee(instance(mockedPieceLayerService))

      const result: Record<PieceLayer, Piece[]> = testee.groupByPieceLayer(pieces)

      expect(result[PieceLayer.PGM]).toEqual(pieces)
    })

    it('returns layers for PGM and OVERLAY with each one piece if given a piece for PGM and one for OVERLAY', () => {
      const testEntityFactory: TestEntityFactory = new TestEntityFactory()
      const pieces: Piece[] = [testEntityFactory.createPiece(), testEntityFactory.createPiece()]
      const mockedPieceLayerService: PieceLayerService = mock<PieceLayerService>()
      when(mockedPieceLayerService.getPieceLayer(anything())).thenReturn(PieceLayer.PGM, PieceLayer.OVERLAY)
      const testee: PieceGroupService = createTestee(instance(mockedPieceLayerService))

      const result: Record<PieceLayer, Piece[]> = testee.groupByPieceLayer(pieces)

      expect(result[PieceLayer.PGM]).toEqual([pieces[0]])
      expect(result[PieceLayer.OVERLAY]).toEqual([pieces[1]])
    })
  })
})

function createTestee(maybePieceLayerService?: PieceLayerService): PieceGroupService {
  const pieceLayerService: PieceLayerService = maybePieceLayerService ?? instance(mock<PieceLayerService>())
  return new PieceGroupService(pieceLayerService)
}
