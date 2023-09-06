import {Component, Input} from '@angular/core'
import {Identifier} from '../../../core/models/identifier'
import {AdLibPieceService} from '../../../core/interfaces/ad-lib-piece-service.interface'

@Component({
  selector: 'sofie-ad-lib-piece-identifier',
  templateUrl: './ad-lib-piece-identifier.component.html',
  styleUrls: ['./ad-lib-piece-identifier.component.scss']
})
export class AdLibPieceIdentifierComponent {

  @Input()
  public rundownId: string
  @Input()
  public adLibPieceIdentifier: Identifier

  constructor(private adLibPieceService: AdLibPieceService) { }

  public executeAdLibPiece(): void {
    this.adLibPieceService.executeAdLibPiece(this.rundownId, this.adLibPieceIdentifier).subscribe()
  }
}
