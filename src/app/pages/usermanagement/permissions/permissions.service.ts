import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { HttpHelperService } from '../../../@core/http-helper.service';
import { environment } from '../../../../environments/environment';
import { CommonHelper } from '../../../@core/common-helper';

@Injectable()
export class PermissionsService extends HttpHelperService {
    constructor(public _httpClient: HttpClient, public _router: Router,public _commonHelper: CommonHelper) {
        super(_httpClient, _router,_commonHelper);
    }

    getPermissions(pagingParams) {
        let url = environment.URAMApiUrl + "Permissions/GetAllActivePermissions";
        return this.getHttpAuthrizedGetRequest(url, pagingParams);
    }
}