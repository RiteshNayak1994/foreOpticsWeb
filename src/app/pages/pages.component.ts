import { Component } from '@angular/core';

import { MENU_ITEMS } from './pages-menu';
import * as $ from "jquery";

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent {

  ngAfterViewInit() {
    $('nb-sidebar').removeClass("expanded");
    $('nb-sidebar').addClass("compacted");
  }

  menu = MENU_ITEMS;

}
