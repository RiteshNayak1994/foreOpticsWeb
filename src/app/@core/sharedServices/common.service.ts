import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { HttpHelperService } from '../../@core/http-helper.service';
import { environment } from '../../../environments/environment';
import { CommonHelper } from '../../@core/common-helper';
import { Subject } from 'rxjs';

@Injectable()

export class CommonService extends HttpHelperService {
     // Start list of array - Reference Type
    lstEntityTimespan = [];
    lstContactType = [];
    lstTPA = [];
    lstCaseTypes = [];
    lstCaseStatus = [];
    lstCaseSources = [];
    lstRelationTypes = [];
    lstWidgetTimespan = [];
    lstTagShapes = [];
    lstTaskType = [];
    lstTaskStatus = [];
    lstFinanceType = [];
    lstActivityTimespan = [];
    lstProductDisposition = [];
    lstProductScope = [];
    lstCommissionRoleType = [];
    lstEventStatus = [];
    lstInternalRole = [];
    lstEntityRequests = [];
    // End list of array - Reference Type

    constructor(public _httpClient: HttpClient, public _router: Router, public _commonHelper: CommonHelper) {
        super(_httpClient, _router, _commonHelper);
    }

      clearRefTypeArrays() {
        this.lstEntityTimespan = [];
        this.lstContactType = [];
        this.lstTPA = [];
        this.lstCaseTypes = [];
        this.lstCaseStatus = [];
        this.lstCaseSources = [];
        this.lstRelationTypes = [];
        this.lstWidgetTimespan = [];
        this.lstTagShapes = [];
        this.lstTaskType = [];
        this.lstTaskStatus = [];
        this.lstFinanceType = [];
        this.lstActivityTimespan = [];
        this.lstProductDisposition = [];
        this.lstProductScope = [];
        this.lstCommissionRoleType = [];
        this.lstEventStatus = [];
        this.lstInternalRole = [];
        this.lstEntityRequests = [];
    }

    getReferenceTypeByType(refType) {
        const url = environment.apiUrl + 'ReferenceType/GetReferenceTypesByRefType';
        return this.getHttpPostRequest(url, refType);
    }
    
    //get activity details
    getActivityList(params) {
        const url = environment.apiUrl + 'Tasks/GetAllActivity';
        return this.getHttpAuthrizedGetRequest(url, params);
    }

    //get my activity details
    getMyActivityList() {
        const url = environment.apiUrl + 'Tasks/GetMyActivity';
        return this.getHttpAuthrizedGetRequest(url);
    }

    //get upcoming appointments activity details
    getUpcomingAppointmentsList() {
        const url = environment.apiUrl + 'Tasks/GetUpcomingAppointments';
        return this.getHttpAuthrizedGetRequest(url);
    }

    //get current user time with next round up time from uram.    
    getUserCurrentTimeWithNextRoundUpTime(params) {
        let url = environment.URAMApiUrl + "Users/GetUserCurrentTimeWithNextRoundUpTime";
        return this.getHttpAuthrizedGetRequest(url, params);
    }


    hasReportAccess() {
        const url = environment.apiUrl + 'Reports/HasReportAccess';
        return this.getHttpAuthrizedGetRequest(url);
    }

    //for delete note api
    deleteNote(params) {
        const url = environment.apiUrl + 'Notes/DeleteNote';
        return this.getHttpAuthrizedGetRequest(url, params);
    }

    updateNoteStatus(params) {
        const url = environment.apiUrl + 'Notes/UpdateNoteStatus';
        return this.getHttpAuthrizedGetRequest(url, params);
    }

    //for appointment status change
    statusChangeOnEvent(params) {
        const url = environment.apiUrl + 'Events/StatusChangeOnEvent';
        return this.getHttpAuthrizedGetRequest(url, params);
    }

    //get all tenant
    getAllTenants() {
        let url = environment.URAMApiUrl + "Tenants/GetAllTenants";
        return this.getHttpAuthrizedGetRequest(url);
    }

    //get entitiy tags by category
    fillEntityTagsByTagCategory(entityTypeId) {
        const url = environment.apiUrl + 'Entitytags/FillEntityTagsByTagCategory/' + entityTypeId;
        return this.getHttpAuthrizedGetRequest(url);
    }
    //to associate tag with member
    saveToEntityTagTracking(params) {
        const url = environment.apiUrl + 'EntityTags/SaveToEntityTagTracking';
        return this.getHttpAuthrizedPostRequest(url, params);
    }
    //remove existing entity tag
    removeExistingEntityTag(params) {
        const url = `${environment.apiUrl}Entitytags/RemoveExistingEntityTag`;
        return this.getHttpAuthrizedPutRequest(url, params);
    }
    //all file list
    getAllDocuments(params) {
        const url = environment.apiUrl + 'file/GetDocuments';
        return this.getHttpAuthrizedGetRequest(url, params);
    }
    //all file path
    GetDocumentFilePathDetailById(recordId) {
        const url = environment.apiUrl + 'file/GetDocumentFilePathDetailById/' + recordId;;
        let headers = new HttpHeaders().set("Authorization", this.loggedUserDetail.accessToken.toString())
        return this._httpClient.get(url, { responseType: 'arraybuffer', headers: headers });
    }
    deleteDocument(params) {
        const url = environment.apiUrl + 'file/DeleteDocument';
        return this.getHttpAuthrizedGetRequest(url, params);
    }

    sendTextMessage(params) {
        //let url = environment.helperApiUrl + 'Messages/SendTextMessage';
        //return this.getHttpAuthrizedHelperApiPostRequest(url, params);
    }

    getStates() {
        const url = environment.apiUrl + 'Common/GetStates';
        return this.getHttpAuthrizedGetRequest(url);
    }

    getEntities() {
        const url = environment.apiUrl + 'Common/GetEntityList';
        return this.getHttpAuthrizedGetRequest(url);
    }

    getUsersByInternalRoleIds(params) {
        const url = environment.apiUrl + 'Common/GetUsersByInternalRoleId';
        return this.getHttpAuthrizedGetRequest(url, params);
    }
    GetALLUser() {
        const url = environment.apiUrl + 'Common/GetALLUser';
        return this.getHttpAuthrizedGetRequest(url);
    }

    fillUsersByInternalRoleIds(params) {
        const url = environment.apiUrl + 'Common/FillUsersByInternalRoleId';
        return this.getHttpAuthrizedGetRequest(url, params);
    }

    //  //to associate tag with member
    getActivatedEntityTagsByEntityId(params) {
        const url = `${environment.apiUrl}Entitytags/GetActivatedEntityTagsByEntityId`;
        return this.getHttpAuthrizedGetRequest(url, params);
    }
    reloadDynamicComp = new Subject();
    loadStream = this.reloadDynamicComp.asObservable();
    refreshDynamicTable(data) {
        return this.reloadDynamicComp.next(data);
    }
    
    getActiveCountryList() {
        return this.getHttpAuthrizedGetRequest(`${environment.apiUrl}Common/GetCountry`);
    }

    getActiveCountryNamesList() {
        return this.getHttpAuthrizedGetRequest(`${environment.apiUrl}Common/GetCountryNames`);
    }

    getState(countryId) {
        return this.getHttpAuthrizedGetRequest(`${environment.apiUrl}Common/GetStates/` +countryId);
    }
    
    GetwarehouseIdBycountry(countryName) {
        return this.getHttpAuthrizedGetRequest(`${environment.apiUrl}Common/GetwarehouseIdBycountry/` +countryName);
    }

}
