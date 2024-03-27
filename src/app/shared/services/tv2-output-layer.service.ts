import { Part } from '../../core/models/part'
import { Tv2OutputLayer } from '../../core/models/tv2-output-layer'
import { Tv2Piece } from '../../core/models/tv2-piece'

export class Tv2OutputLayerService {
  public getOutputLayersForParts(parts: Readonly<Part[]>): Set<Tv2OutputLayer> {
    const pieces: Tv2Piece[] = parts.flatMap(part => part.pieces as Tv2Piece[])
    const outputLayersWithDuplicates: Tv2OutputLayer[] = pieces.map(piece => piece.metadata.outputLayer).filter((outputLayer): outputLayer is Tv2OutputLayer => outputLayer !== undefined)
    return new Set(outputLayersWithDuplicates)
  }

  public getOutputLayersInOrder(): Tv2OutputLayer[] {
    return [Tv2OutputLayer.OVERLAY, Tv2OutputLayer.PROGRAM, Tv2OutputLayer.JINGLE, Tv2OutputLayer.AUDIO, Tv2OutputLayer.MANUS, Tv2OutputLayer.SECONDARY, Tv2OutputLayer.AUXILIARY]
  }
}
