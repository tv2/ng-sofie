import { Component, OnInit } from '@angular/core';
import {Paths} from '../../../app-routing.module';
import {Router} from '@angular/router';

@Component({
  selector: 'sofie-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  title = 'Sofie';

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  public navigateHome(): void {
    this.router.navigate([Paths.HOME])
  }

  public navigateToRundown(): void {
    this.router.navigate([Paths.RUNDOWNS])
  }
}
