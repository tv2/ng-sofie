import {Component, Input, OnInit} from '@angular/core';
import {Rundown} from "../core/models/rundown";

@Component({
  selector: 'sofie-rundown-view-header',
  templateUrl: './rundown-view-header.component.html',
  styleUrls: ['./rundown-view-header.component.scss']
})
export class RundownViewHeaderComponent implements OnInit {
  @Input()
  public rundownName: string

  constructor() { }

  ngOnInit(): void {
  }

}
