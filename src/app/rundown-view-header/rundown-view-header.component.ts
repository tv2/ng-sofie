import {Component, Input, OnInit} from '@angular/core';
import {Rundown} from "../core/models/rundown";

@Component({
  selector: 'sofie-rundown-view-header',
  templateUrl: './rundown-view-header.component.html',
  styleUrls: ['./rundown-view-header.component.scss']
})
export class RundownViewHeaderComponent implements OnInit {
  @Input()
  public rundown?: Rundown

  constructor() { }

  ngOnInit(): void {
  }

  public getShortenedRundownName(name: string): string {
    const rundownPathStrings: string[] = name.split('.')
    return rundownPathStrings[rundownPathStrings.length - 1]
  }

}
