import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Table } from 'primeng/table';
import { debounceTime, map, filter } from "rxjs/operators";
import { fromEvent } from 'rxjs';
import { Paginator } from 'primeng/paginator';
import { UserDetail } from '../../../@core/sharedModels/user';
import { PagingParams } from '../../../@core/sharedModels/paging-params.model';
import { CommonHelper } from '../../../@core/common-helper';
import { DashboardService } from '../../../@core/sharedServices/dashboard.service';


@Component({
    selector: 'super-admin-dashboard',
    templateUrl: './super-admin-dashboard.component.html',
    styleUrls: ['./super-admin-dashboard.component.scss']
})
export class SuperAdminDashboardComponent implements OnInit {

    //user detail
    _loggedInUser: any;
    title: string;

    //Form View child
    @ViewChild('searchTextInput', { static: true }) searchTextInput: ElementRef;
    @ViewChild('pTable', { static: false }) private pTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    //User list data source
    dataSource: UserDetail[] = [];
    pagingParams: PagingParams;
    totalRecords: number;

    //all popup dialog open option settings
    optionsForPopupDialog: any = {
        size: "md",
        centered: false,
        backdrop: 'static',
        keyboard: false
    };

    //Table Column
    cols: any[];
    isShowActionColumn: boolean = false;

    tenantDataSource = [{id:0, name:'All Tenants'}];

    userSearchFilter = {
        searchText: '',
        selectedTenant: {}
    }

    constructor(private _commonHelper: CommonHelper,
        private _dashboardService: DashboardService) {

        //Set column  name json
        this.cols = [
            { field: 'id', header: '', sort: false, class: "action " },
            { field: 'fullName', header: 'URAM.USER.LIST.TABLE_HEADER_NAME', sort: true },
            { field: 'email', header: 'URAM.USER.LIST.TABLE_HEADER_EMAIL', sort: true },
            { field: 'phone', header: 'URAM.USER.LIST.TABLE_HEADER_PHONE', sort: true },
            { field: 'roleName', header: 'URAM.USER.LIST.TABLE_HEADER_ROLE', sort: true },
            { field: 'isActive', header: 'URAM.USER.LIST.TABLE_HEADER_STATUS', sort: true },
        ];

        this._commonHelper.getTranlationData('dummyKey').then(result => {
            this.cols.forEach(item => {
                item.header = _commonHelper.getInstanceTranlationData(item.header);
            });
        });

        //Set load time PaginParam
        this.pagingParams = new PagingParams();
        this.pagingParams.searchString = '';
        this.pagingParams.sortColumn = 'fullName';
        this.pagingParams.sortOrder = 'ASC';
        this.pagingParams.pageNo = 0;
        this.pagingParams.pageSize = 10;
        this.pagingParams.roleIds = '';
    }

    ngOnInit() {
        this._loggedInUser = this._commonHelper.getLoggedUserDetail();
        this.title = "Welcome " + this._loggedInUser.name;

        this.getAllTenants();

        //for text box on search debounce Time
        fromEvent(this.searchTextInput.nativeElement, 'keyup').pipe(
            // get value
            map((event: any) => {
                return event.target.value;
            })
            // if character length greater then 2
            , filter(res => res.length >= 0)
            // Time in milliseconds between key events
            , debounceTime(1000)
        ).subscribe((text: string) => {
            this.loadUsers();
        });
    }

    onResetAllFilters() {
        this.userSearchFilter = {
            searchText: '',
            selectedTenant: []
        }

        //Set pagination params
        this.pagingParams.searchString = '';
        this.pagingParams.sortColumn = 'name';
        this.pagingParams.sortOrder = 'ASC';
        this.pagingParams.pageNo = 0;
        this.pagingParams.pageSize = 10;

        if (this.tenantDataSource && this.tenantDataSource.length > 0) {
            //this.userSearchFilter.selectedTenant = ;
            this.userSearchFilter.selectedTenant = this.tenantDataSource[0];
            this.loadUsers();
        }
        if (this.userSearchFilter.selectedTenant != undefined) {
            this.pagingParams.tenantId = this.userSearchFilter.selectedTenant['id'];
        } else {
            this.pagingParams.tenantId = 0;
        }
        //Fill Users
        this.getUsers(this.pagingParams);
    }

    loadUsers() {
        if (this.tenantDataSource.length == 0) {
            return;
        }
        if (this.pTable != undefined && this.paginator != undefined) {

            this.pagingParams.pageNo = this.paginator.paginatorState.page;
            this.pagingParams.pageSize = this.paginator.paginatorState.rows;

            if (this.pTable.sortOrder == 1) {
                this.pagingParams.sortOrder = "ASC";
            }
            else {
                this.pagingParams.sortOrder = "DESC";
            }
            this.pagingParams.sortColumn = this.pTable.sortField;
        }

        if (this.userSearchFilter.selectedTenant != undefined) {
            this.pagingParams.tenantId = this.userSearchFilter.selectedTenant['id'];
        } else {
            this.pagingParams.tenantId = 0;
        }

        this.pagingParams.searchString = this.userSearchFilter.searchText != null ? this.userSearchFilter.searchText.trim() : '';
        this.getUsers(this.pagingParams);
    }

    getUsers(pagingParams: PagingParams) {

        this._commonHelper.showLoader();
        this._dashboardService.getUsersByTenant(pagingParams).then(
            response => {
                this._commonHelper.hideLoader();
                if (response) {

                    this.dataSource = response as UserDetail[];
                    if (this.dataSource.length > 0) {
                        this.totalRecords = response[0]['totalRecords'];
                    } else {
                        this.totalRecords = 0;
                    }
                    this.setPaginationInfo();
                }
            },
            (error) => {
                this._commonHelper.hideLoader();
                this.getTranslateErrorMessage(error);
            });
    }

    setPaginationInfo() {
        let from = this.paginator.getPage() * this.paginator.rows + 1;
        let to = (this.paginator.getPage() + 1) * this.paginator.rows;
        to = to > this.totalRecords ? this.totalRecords : to;

        this.paginator.currentPageReportTemplate = from.toString() + '-' + to.toString() + ' of ' + this.totalRecords;
    }

    //get phone number add prefix country code
    getPhoneNoPrefixCountryCode(phoneValue) {
        return this._commonHelper.getPhoneNoPrefixCountryCode(phoneValue);
    }

    //get phone number with hyper link
    getPhoneNoWithHyperLink(phoneValue) {
        return this._commonHelper.getPhoneNoWithHyperLink(phoneValue);
    }

    getAllTenants(): void {
        this._commonHelper.showLoader();
        this._dashboardService.getAllTenants().then((response:any)=> {
            this._commonHelper.hideLoader();
            if (response) {
               // let tenantDataSource = response.map(r => ({id:r["id"], name:r["name"]}));
                this.tenantDataSource = [...this.tenantDataSource, ...response];
               // this.tenantDataSource.push(...tenantDataSource);
                //this.tenantDataSource.push();

                //rpc should be first in dropdown
                this.tenantDataSource = this.tenantDataSource.sort((a, b) => {
                    var result = (a['id'] < b['id']) ? -1 : (a['id'] > b['id']) ? 1 : 0;
                    return result;
                });

                if (this.tenantDataSource && this.tenantDataSource.length > 0) {
                  // this.userSearchFilter.selectedTenant = undefined;
                    this.userSearchFilter.selectedTenant = this.tenantDataSource[0];
                    this.loadUsers();
                }
            }
        },
            (error) => {
                this._commonHelper.hideLoader();
                this.getTranslateErrorMessage(error);
            });
    }

    impersonateLogin(rowData: any): void {
        this._commonHelper.showLoader();
        this._dashboardService.impersonateLogin(rowData.id).then(response => {
            this._commonHelper.hideLoader();
            if (response) {
                //set current url in the local storage
                localStorage.setItem("returnUrl", window.location['href']);
                let accessToken = response;
                window.location.href = "auth/autologin?k=" + accessToken;
            }
        },
            (error) => {
                this._commonHelper.hideLoader();
                this.getTranslateErrorMessage(error);
            });
    }

    getTranslateErrorMessage(error) {
        if (error.error != null && error.error.messageCode) {
            this._commonHelper.showToastrError(
                this._commonHelper.getInstanceTranlationData('URAM.USER.' + error.error.messageCode.replace('.', '_').toUpperCase())
            );
        }
    }
}
