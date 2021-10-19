import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from './auth.service';
import { CommonHelper } from '../../@core/common-helper';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private _router: Router,
        private _authenticationService: AuthenticationService,
        private _commonHelper: CommonHelper
        ) {
    }

    canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot, state: RouterStateSnapshot) {    
        return this.isUserUserAuthorized(activatedRouteSnapshot, state);
    }

    async isUserUserAuthorized(activatedRouteSnapshot: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return await this.getUserAuthDetail().then(response => {
            if (response) {
                const loggedUserDetail = this._commonHelper.getLoggedUserDetail();
                // set app language
                this._commonHelper.setLanguage();
                //check logged user permission
                if (activatedRouteSnapshot.data.permission != undefined) {
                    if (this._commonHelper.havePermission(activatedRouteSnapshot.data.permission)) {
                        return true;
                    } else {
                        this._router.navigate(['/']);
                        return false;
                    }
                } else if (loggedUserDetail) {
                    // if logged user valid then true
                    return true;
                }
            }
            else {
                // if logged in not valid then redirect to login page with the return url
                this._commonHelper.setLoggedUserDetail(null);  
                this._router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url }});
                return false;
            }
        });
    }

    async getUserAuthDetail() {
        //get local temp store logged user detail
        let loggedUserDetail = this._commonHelper.getLoggedUserDetail();        
        //get logged user session token
        const loggedUserSessionToken = localStorage.getItem('LoggedUserSessionToken');
        if (loggedUserSessionToken != null && loggedUserSessionToken !== undefined) {
            const token = loggedUserSessionToken;
            //If exists logged user detail user hash
            let userHash = "";
            if (loggedUserDetail != undefined) {
                userHash = loggedUserDetail.userHash
            }
            //create 
            const params = {
                accessToken: token,
                userHash: userHash
            };
            //check user validate user access token 
            return this._authenticationService.validateUserAccessToken(params).then((response) => {
                if (response != null && response['hashChange'] === true) {
                    this._commonHelper.setLoggedUserDetail(response);
                }

                loggedUserDetail = this._commonHelper.getLoggedUserDetail();
                return true;
            }, (error) => {              
                this._commonHelper.setLoggedUserDetail(null);  
                this._router.navigate(['/auth/login']);
                return false;
            });
        }
    }
}