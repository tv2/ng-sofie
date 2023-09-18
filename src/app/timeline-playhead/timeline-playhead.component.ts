import {Component, HostBinding, Input, OnInit} from '@angular/core';

@Component({
  selector: 'sofie-timeline-playhead',
  templateUrl: './timeline-playhead.component.html',
  styleUrls: ['./timeline-playhead.component.scss']
})
export class TimelinePlayheadComponent implements OnInit {

  @Input()
  public time: number

  @Input()
  public pixelsPerSecond: number

  @HostBinding('style.left.px')
  get left() {
    return Math.floor(this.time * this.pixelsPerSecond / 1000)
    // return '50px'
  }

  constructor() { }

  ngOnInit(): void {
  }

}
