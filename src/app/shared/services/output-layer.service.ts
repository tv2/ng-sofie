import { Piece } from '../../core/models/piece'
import { Part } from '../../core/models/part'
import { Tv2OutputLayer } from '../../core/models/tv2-output-layer'

export class OutputLayerService {
  public getOutputLayersForParts(parts: Part[]): Set<Tv2OutputLayer> {
    const pieces: Piece[] = parts.flatMap(part => part.pieces)
    const outputLayersWithDuplicates: Tv2OutputLayer[] = pieces.map(piece => piece.outputLayer)
    return new Set(outputLayersWithDuplicates)
  }

  public getOutputLayersInOrder(): Tv2OutputLayer[] {
    return [Tv2OutputLayer.OVERLAY, Tv2OutputLayer.PROGRAM, Tv2OutputLayer.JINGLE, Tv2OutputLayer.AUDIO, Tv2OutputLayer.MANUS, Tv2OutputLayer.SECONDARY, Tv2OutputLayer.AUXILIARY]
  }
}
