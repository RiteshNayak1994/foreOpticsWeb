import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { HttpHelperService } from '../../@core/http-helper.service';
import { environment } from '../../../environments/environment';
import { CommonHelper } from '../../@core/common-helper';
import { Subject } from 'rxjs';
@Injectable()

export class DashboardService extends HttpHelperService {
    selectedTimeSpan = new Subject();
    selectedBuyerId = new Subject();
    selectedSupplierId = new Subject();
    selectedPartName = new Subject();
    selectedDates = new Subject();

    constructor(public _httpClient: HttpClient, public _router: Router, public _commonHelper: CommonHelper) {
        super(_httpClient, _router, _commonHelper);
    }

    getSetterAnalysisReport() {
        const url = environment.apiUrl + 'Dashboard/GetSetterAnalysisReport';
        return this.getHttpAuthrizedGetRequest(url);
    }

    getSalesAgentAnalysisReport() {
        const url = environment.apiUrl + 'Dashboard/GetSalesAgentAnalysisReport';
        return this.getHttpAuthrizedGetRequest(url);
    }

    getWidgetList() {
        const url = environment.apiUrl + 'Reports/GetWidgets';
        return this.getHttpAuthrizedGetRequest(url);
    }

    getWidgetData(id: number, parameters: any) {
        let params = {
            id: id,
            widgetParameters: parameters
        }
        const url = environment.apiUrl + 'Reports/GetWidgetData';
        return this.getHttpAuthrizedPostRequest(url, params);
    }

    //For Superadmin related
    getUsersByTenant(pagingParams) {
        let url = environment.URAMApiUrl + "Users/GetAllUserByTenantForSA";
        return this.getHttpAuthrizedPostRequest(url, pagingParams);
    }

    getAllTenants() {
        let url = environment.URAMApiUrl + "Tenants/GetAllTenantForSA";
        return this.getHttpAuthrizedGetRequest(url);
    }

    impersonateLogin(userId: number) {
        let params = { userId: userId };
        let url = environment.URAMApiUrl + "Users/ImpersonateLogin";
        return this.getHttpAuthrizedGetRequest(url, params);
    }

    getUsersByInternalRole(params) {
        const url = environment.apiUrl + 'Common/GetUsersByInternalRoleId';
        return this.getHttpAuthrizedGetRequest(url, params);
    }

    getWidgetsList(dashboardCode: number) {
        let params = {
            dashboardCode: dashboardCode
        }
        const url = environment.WidgetApiUrl + 'Widgets/GetWidgets/';
        return this.getHttpAuthrizedGetRequest(url, params);
    }

    getFOWidgetsList(dashboardName: string) {
        let params = {
            dashboardName: dashboardName
        }
        const url = environment.WidgetApiUrl + 'Widgets/GetFOWidgets/';
        return this.getHttpAuthrizedGetRequest(url, params);
    }

    getBuyers(timeSpan, supplierId = null) {
        const url = environment.WidgetApiUrl + 'Widgets/GetFOBuyers/' + timeSpan + '/' + supplierId;
        return this.getHttpAuthrizedGetRequest(url);
    }

    getSuppliers(timeSpan, parts, startDate, endDate) {
        let params = {
            timeSpan: timeSpan,
            parts: parts,
            startDatePara: startDate,
            endDatePara: endDate
        };

        const url = environment.WidgetApiUrl + 'Widgets/GetFOSuppliers';
        return this.getHttpAuthrizedPostRequest(url, params);

    }

    getFOPartList(buyerId, supplierId, dashboardName, timeSpan, startDate, endDate) {
        let params = {
            BuyerId: buyerId,
            supplierId: supplierId,
            dashboardName: dashboardName,
            timeSpan: timeSpan,
            startDatePara: startDate,
            endDatePara: endDate
        };

        const url = environment.WidgetApiUrl + 'Widgets/GetFOProductParts';
        return this.getHttpAuthrizedPostRequest(url, params);

    }

    GetFORecommendedSuppliersForGap(part) {
        const url = environment.WidgetApiUrl + 'Widgets/GetFORecommendedSuppliersForGap/' + part;
        return this.getHttpAuthrizedGetRequest(url);
    }
}