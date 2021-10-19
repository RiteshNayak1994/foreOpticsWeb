import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { HttpHelperService } from '../../../@core/http-helper.service';
import { environment } from '../../../../environments/environment';
import { CommonHelper } from '../../../@core/common-helper';

@Injectable()
export class ProfileService extends HttpHelperService {
    constructor(public _httpClient: HttpClient, public _router: Router,public _commonHelper: CommonHelper) {
        super(_httpClient, _router,_commonHelper);
    }

    getProfileDetail() {
        let url = environment.URAMApiUrl + "Profile/GetProfileById";

        let loggedUserDetail = this._commonHelper.getLoggedUserDetail();
        if(loggedUserDetail === undefined){
            this._router.navigate(['/auth/login']);
        }
        let params = { id: loggedUserDetail.userId };
        return this.getHttpAuthrizedGetRequest(url, params);
    }

    getState() {
        let url = environment.URAMApiUrl + "Profile/GetState";
        return this.getHttpAuthrizedGetRequest(url);
    }

    saveBasicInfo(profile) {
        let url = environment.URAMApiUrl + "Profile/SaveProfile";
        return this.getHttpAuthrizedPostRequest(url, profile);
    }

    saveAddress(address) {
        let url = environment.URAMApiUrl + "Profile/SaveAddress";
        return this.getHttpAuthrizedPostRequest(url, address);
    }

    saveChangePasswordForm(changePassword) {
        let url = environment.URAMApiUrl + "Profile/ChangePassword";
        return this.getHttpAuthrizedPostRequest(url, changePassword);
    }

    getAllTimeZone() {
        let url = environment.URAMApiUrl + "Users/GetAllTimeZone";
        return this.getHttpAuthrizedGetRequest(url);
    }
}
