import {Component, HostBinding, Input} from '@angular/core';

@Component({
    selector: 'sofie-editorial-line',
    templateUrl: './editorial-line.component.html',
    styleUrls: ['./editorial-line.component.scss']
})
export class EditorialLineComponent {
    @Input()
    public budgetDuration: number

    @Input()
    public pixelsPerSecond: number

    @HostBinding('style.left.px')
    get left() {
        return Math.floor(this.budgetDuration * this.pixelsPerSecond / 1000)
    }
}
