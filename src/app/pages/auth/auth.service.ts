import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { environment } from '../../../environments/environment';
import { UserLoginModel, SingleSignOnModel } from '../usermanagement/users/user.model';
import { HttpHelperService } from '../../@core/http-helper.service';
import { ResetPasswordModel } from './reset-password/reset-password.model';
import { CommonHelper } from '../../@core/common-helper';

@Injectable()
export class AuthenticationService extends HttpHelperService {
    constructor(public _httpClient: HttpClient,
        public _router: Router,
        public _commonHelper: CommonHelper) {
        super(_httpClient, _router, _commonHelper);
    }

    login(userLoginModel: UserLoginModel) {
        let url = environment.URAMApiUrl + "Users/LoginUser";
        return this.getHttpPostRequest(url, userLoginModel);
    }

    logout() {
        let url = environment.URAMApiUrl + "Users/LogoutUser";
        //get logged user detail
        let localStorageData = this._commonHelper.getLoggedUserDetail();

        let accessToken = "";
        if (localStorageData != null) {
            accessToken = localStorageData.accessToken;
        } else {
            accessToken = localStorage.getItem('LoggedUserSessionToken');
        }

        let params = { accessToken: accessToken }

        return this.getHttpPutRequest(url, params).then(response => {
            //logged user session token remove local storage remove
            if (localStorage.getItem('LoggedUserSessionToken') != null) {
                localStorage.removeItem('LoggedUserSessionToken');
            }

            this._commonHelper.removeAllSearchingFilterLocalStorage();
        },
            (error) => {
                //localStorage.removveItem('LoggedUserDetail');
            });
    }

    forgotPassword(emailValue) {
        let url = environment.URAMApiUrl + "Users/sendForgetEmail";
        return this.getHttpPostRequest(url, emailValue);
    }


    getUserDetailByPasswordResetHash(passwordResetHash) {
        const data = {
            passwordResetHash: passwordResetHash
        };

        let url = environment.URAMApiUrl + "Users/verifyUserByPasswordResetHash";
        return this.getHttpPostRequest(url, data);
    }

    resetPassword(resetModel: ResetPasswordModel) {
        let url = environment.URAMApiUrl + "Users/resetUserPassword";

        return this.getHttpPutRequest(url, resetModel);
    }

    validateUserAccessToken(data) {
        let url = environment.URAMApiUrl + "Users/ValidateUserAccessToken";
        let params = { accessToken: data.accessToken, userHash: data.userHash };
        return this.getHttpGetRequest(url, params);
    }

    //For social login like google/facebook
    singleSignOn(userSocialLoginModel: SingleSignOnModel) {
        let url = environment.URAMApiUrl + "Users/SingleSignOn";
        return this.getHttpPostRequest(url, userSocialLoginModel);
    }

    //currency this one is used in wizard auto login
    // autoLoginUser(userGuid: string) {
    //     let url = environment.URAMApiUrl + "Users/AutoLoginUser";
    //     let params = { guid: userGuid };
    //     return this.getHttpGetRequest(url, params);
    // }

    //GetUserByActivationHash
    getUserByActivationHash(activationHash) {
        let url = environment.URAMApiUrl + "Users/GetUserByActivationHash";
        let params = { activationHash: activationHash };
        return this.getHttpGetRequest(url, params);
    }

    updateUserVerification(data) {
        let url = environment.URAMApiUrl + "Users/UpdateUserVerification";
        return this.getHttpPutRequest(url, data);
    }
}