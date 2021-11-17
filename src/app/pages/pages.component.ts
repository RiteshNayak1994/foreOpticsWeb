import { Component } from '@angular/core';
import { MENU_ITEMS } from './pages-menu';
import { CommonHelper } from '../@core/common-helper';

import * as $ from "jquery";
@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="navItems"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent {

  //UserDetail
  _loggedInUser: any;
  navItems: any[] = [];
  customNavItems: any[] = [];

  constructor(
    private _commonHelper: CommonHelper
  ) {
    //get logged in user information
    this._loggedInUser = this._commonHelper.getLoggedUserDetail();
    this.prepareMenu();
  }

  ngAfterViewInit() {
    $('nb-sidebar').removeClass("expanded");
    $('nb-sidebar').addClass("compacted");
  }

  prepareMenu() {
    this.customNavItems = this._commonHelper.cloneObject(MENU_ITEMS);

    // set menu access dynamically
    this.customNavItems.forEach(navItem => {
      if (navItem.permission != undefined) {
        if (navItem.permission.length > 0) {
          navItem.hidden = !this.havePermission(navItem.permission);
        }
        else if (navItem.specailMenuName && navItem.specailMenuName.length > 0) {
          if (navItem.specailMenuName == "ImpersonateLoginBack") {
            if (this._loggedInUser && this._loggedInUser.impersonateAccessToken && this._loggedInUser.impersonateAccessToken.length > 0) {
              navItem.hidden = false;
              // navItem.name = this._commonHelper.getInstanceTranlationData(navItem.name);
              navItem.name = navItem.name + " to " + this._loggedInUser.impersonateSessionBy;
            }
            else {
              navItem.hidden = true;
            }
          }
        }
      }
      // translate nav item
      // navItem.name = this._commonHelper.getInstanceTranlationData(navItem.name);

      // if parent have permission then and then check for child
      if (!navItem.hidden) {
        if (navItem.children != undefined) {
          navItem.children.forEach(navItemChild => {
            if (navItemChild.permission != undefined) {
              navItemChild.hidden = !this.havePermission(navItemChild.permission);
            }

            // translate nav item
            // navItemChild.name = this._commonHelper.getInstanceTranlationData(navItemChild.name);
            if (navItemChild.children != undefined) {
              navItemChild.children.forEach(navItemSubChild => {
                if (navItemSubChild.permission != undefined) {
                  navItemSubChild.hidden = !this.havePermission(navItemSubChild.permission);
                }
                // translate nav item
                // navItemSubChild.name = this._commonHelper.getInstanceTranlationData(navItemSubChild.name);
              });
            }
          });
        }
      }
    });
    this.navItems = this.customNavItems;
  }

  havePermission(permission): boolean {
    return this._commonHelper.havePermission(permission);
  }

}
