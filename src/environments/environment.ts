/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: true,
  UserCookiesName: "LoggedUserDetail",
    
  frontEndUrl:"",

  //dev
  // WidgetApiUrl: 'http://34.216.118.22/devfowidgetapi/',
  // URAMApiUrl: 'http://34.216.118.22/devfouramapi/', 
  // apiUrl: 'http://34.216.118.22/devfocrmapi/',

  //qa
  WidgetApiUrl: 'http://qa.v2.fo.sdsaz.us/widgetapi/',
  URAMApiUrl: 'http://qa.v2.fo.sdsaz.us/uramapi/', 
  apiUrl: 'http://qa.v2.fo.sdsaz.us/crmapi/',

  bobmBombApiUrl: '',
  tagImagesUrl: '../assets/files/t/',
};
