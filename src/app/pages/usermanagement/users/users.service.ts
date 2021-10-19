import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { HttpHelperService } from '../../../@core/http-helper.service';
import { environment } from '../../../../environments/environment';
import { CommonHelper } from '../../../@core/common-helper';

@Injectable()
export class UsersService extends HttpHelperService {

    constructor(public _httpClient: HttpClient, public _router: Router,public _commonHelper: CommonHelper) {        
        super(_httpClient, _router,_commonHelper);        
    }

    getUsers(pagingParams) {
        let url = environment.URAMApiUrl + "Users/GetUsers";
        return this.getHttpAuthrizedPostRequest(url, pagingParams);
    }

    getUserById(userId) {
        let url = environment.URAMApiUrl + 'Users/GetUser';
        let params = { id: userId };
        return this.getHttpAuthrizedGetRequest(url, params);
    }

    getSalesUserById(userId) {
        let url = environment.URAMApiUrl + 'Users/GetSalesUser';
        let params = { id: userId };
        return this.getHttpAuthrizedGetRequest(url, params);
    }

    getRoles() {
        let url = environment.URAMApiUrl + "Roles/GetAllRoles";
        return this.getHttpAuthrizedGetRequest(url);
    }

    addUsers(params) {
        let url = environment.URAMApiUrl + "Users/AddUser";
        return this.getHttpAuthrizedPostRequest(url, params);
    }

    updateUser(params) {
        let url = environment.URAMApiUrl + "Users/UpdateUser";
        return this.getHttpAuthrizedPutRequest(url, params);
    }

    delete(id) {
        let url = environment.URAMApiUrl + "Users/DeleteUser/" + id;
        return this.getHttpAuthrizedDeleteRequest(url);
    }

    resetPasswordByAdmin(params) {
        let url = environment.URAMApiUrl + "Users/ResetPasswordByAdmin";
        return this.getHttpAuthrizedPutRequest(url, params);
    }

    getAllTimeZone() {
        let url = environment.URAMApiUrl + "Users/GetAllTimeZone";
        return this.getHttpAuthrizedGetRequest(url);
    }

    sendUserActivationEmail(params){
        let url = environment.URAMApiUrl + "Users/SendUserActivationEmail";
        return this.getHttpAuthrizedGetRequest(url,params);
    }

    saveChangePasswordForm(changePassword) {
        let url = environment.URAMApiUrl + "Users/ChangePassword";
        return this.getHttpAuthrizedPostRequest(url, changePassword);
    }

}