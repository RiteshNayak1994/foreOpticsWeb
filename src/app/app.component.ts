/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit } from '@angular/core';
import { NbIconLibraries } from '@nebular/theme';
import { CommonHelper } from './@core/common-helper';

@Component({
  selector: 'ngx-app',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {

  constructor(
    private commonHelper: CommonHelper,
    private iconLibrary: NbIconLibraries
  ) {
    this.iconLibrary.registerFontPack('fas',{packClass: 'fas', iconClassPrefix: 'fa'});
    this.iconLibrary.registerFontPack('fab',{packClass: 'fab', iconClassPrefix: 'fa'});
    this.iconLibrary.registerFontPack('pi',{packClass: 'pi', iconClassPrefix: 'pi'});
    this.iconLibrary.setDefaultPack('fas');
  }

  ngOnInit() {
    this.commonHelper.hideLoader();
  }
}
