import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { HttpHelperService } from '../../../@core/http-helper.service';
import { environment } from '../../../../environments/environment';
import { CommonHelper } from '../../../@core/common-helper';

@Injectable()
export class PermissionSetService extends HttpHelperService {

    constructor(public _httpClient: HttpClient, public _router: Router,public _commonHelper: CommonHelper) {
        super(_httpClient, _router,_commonHelper);
    }

    getPermissionSets(pagingParams) {
        let url = environment.URAMApiUrl + "PermissionSets/GetAllPermissionSetPermission";
        return this.getHttpAuthrizedPostRequest(url, pagingParams);
    }

    getAllActivePermissions() {
        let url = environment.URAMApiUrl + "Permissions/GetAllActivePermissions";
        return this.getHttpAuthrizedGetRequest(url);
    }

    getPermissionSetById(permissionSetId) {
        let url = environment.URAMApiUrl + "PermissionSets/GetPermissionSetById";
        let params = { id: permissionSetId };
        return this.getHttpAuthrizedGetRequest(url, params);
    }

    addPermissionSet(permissionset) {
        let url = environment.URAMApiUrl + "PermissionSets/AddPermissionSet";
        return this.getHttpAuthrizedPostRequest(url, permissionset);
    }

    updatePermissionSet(permissionset) {
        let url = environment.URAMApiUrl + "PermissionSets/UpdatePermissionSet";
        return this.getHttpAuthrizedPutRequest(url, permissionset);
    }

    delete(permissionsetId) {

        let url = environment.URAMApiUrl + "PermissionSets/" + permissionsetId;
        return this.getHttpAuthrizedDeleteRequest(url);
    }
}