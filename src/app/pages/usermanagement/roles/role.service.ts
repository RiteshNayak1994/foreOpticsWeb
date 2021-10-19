import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { HttpHelperService } from '../../../@core/http-helper.service';
import { environment } from '../../../../environments/environment';
import { CommonHelper } from '../../../@core/common-helper';

@Injectable()
export class RolesService extends HttpHelperService {

    constructor(public _httpClient: HttpClient, public _router: Router,public _commonHelper: CommonHelper) {
        super(_httpClient, _router,_commonHelper);
    }

    getRoles(pagingParams) {
        let url = environment.URAMApiUrl + "Roles/GetAllRolePermissionSets";
        return this.getHttpAuthrizedPostRequest(url, pagingParams);
    }

    getAllRoles() {
        const url = environment.URAMApiUrl + "Roles/GetAllRoles";
        return this.getHttpAuthrizedGetRequest(url);
    }

    getRolesById(roleId) {
        let url = environment.URAMApiUrl + "Roles/GetRoleById";
        let params = { id: roleId };
        return this.getHttpAuthrizedGetRequest(url, params);
    }

    getPermissionSet() {
        let url = environment.URAMApiUrl + "PermissionSets";
        return this.getHttpAuthrizedGetRequest(url);
    }

    addNewRole(role) {
        let url = environment.URAMApiUrl + "Roles/AddRole";
        return this.getHttpAuthrizedPostRequest(url, role);
    }

    updateRole(role) {
        let url = environment.URAMApiUrl + "Roles/UpdateRole";
        return this.getHttpAuthrizedPutRequest(url, role);
    }

    deleteRole(id) {
        let url = environment.URAMApiUrl + "Roles/" + id;
        return this.getHttpAuthrizedDeleteRequest(url);
    }
}