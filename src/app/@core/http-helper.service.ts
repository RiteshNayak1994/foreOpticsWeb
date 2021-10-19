import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoggedUser } from './sharedModels/user';
import { CommonHelper } from './common-helper';

@Injectable()

export abstract class HttpHelperService {

  loggedUserDetail: LoggedUser;

  constructor(public _httpClient: HttpClient, public route: Router, public _commonHelper: CommonHelper) {    
  }

  public GetAuthHeader() {
    // Get login user detail from local storage.
    this.loggedUserDetail = this._commonHelper.getLoggedUserDetail();
    if (this.loggedUserDetail == undefined){
      this.route.navigate(['/auth/login']);
    }
    // else {
    //   this.loggedUser = JSON.parse(localStorage.getItem(this.UserCookiesName));
    // }

    // Initialize Header with Authorization Token
    let headers = new HttpHeaders();
    if (this.loggedUserDetail != null && this.loggedUserDetail != undefined) {

      headers = headers.set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', this.loggedUserDetail.accessToken.toString());
    }
    else {
      this.route.navigate(['/auth/login']);
    }
    return headers;
  }

  private getHttpRequest(isAuthorizedRequst: boolean, url: string, requestMethod: string, body?: any, param?: any) {
    return new Promise((resolve, reject) => {
      let requestOptionArgs: any;

      let headers = new HttpHeaders();
      if (isAuthorizedRequst) {
        headers = this.GetAuthHeader();
      }
      else {
        headers.set("Content-Type", "application/json");
      }

      requestOptionArgs = {
        body: body,
        params: param,
        headers: headers,
        responseType: 'json'
      }
      
      this._httpClient.request(requestMethod, url, requestOptionArgs)
        .pipe(map(res => res))
        .subscribe(data => {
          resolve(data);
          // we've got back the raw data, now generate the core schedule data
          // and save the data for later reference

        }, (error) => {
          reject(error);
          if (error.status == 401) {
            //localStorage.clear();
            //this.route.navigate(["/auth/login"]);
          }
        });
    });
  }

  protected getHttpAuthrizedGetRequest(url: string, params?: any) {
    return this.getHttpRequest(true, url, "GET", null, params);
  }

  protected getHttpAuthrizedPostRequest(url: string, body?: any) {
    return this.getHttpRequest(true, url, "POST", body);
  }

  protected getHttpAuthrizedPutRequest(url: string, body?: any) {
    return this.getHttpRequest(true, url, "PUT", body);
  }

  protected getHttpAuthrizedDeleteRequest(url: string, body?: any) {
    return this.getHttpRequest(true, url, "DELETE", body);
  }

  protected getHttpGetRequest(url: string, params?: any) {
    return this.getHttpRequest(false, url, "GET", null, params);
  }

  protected getHttpPostRequest(url: string, body?: any) {
    return this.getHttpRequest(false, url, "POST", body);
  }

  protected getHttpPostParamsRequest(url: string, params?: any) {
    return this.getHttpRequest(false, url, "POST", null, params);
  }

  protected getHttpPutRequest(url: string, body?: any) {
    return this.getHttpRequest(false, url, "PUT", body);
  }
}