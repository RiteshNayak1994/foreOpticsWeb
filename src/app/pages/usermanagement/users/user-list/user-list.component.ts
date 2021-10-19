import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { debounceTime, map, filter } from "rxjs/operators";
import { fromEvent } from 'rxjs';
import { Paginator } from 'primeng/paginator';

import { PagingParams } from '../../../../@core/sharedModels/paging-params.model';
import { CommonHelper, enumPermissions } from '../../../../@core/common-helper';
import { ConfirmationDialogService } from '../../../../@core/sharedModules/confirmation-dialog/confirmation-dialog.service';

import { UsersService } from '../users.service';
import { UserDetail } from '../../../../@core/sharedModels/user';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserResetPasswordDialogComponent } from '../user-reset-password-dialog/user-reset-password-dialog.component';
import { RolesService } from '../../roles/role.service';
import { DashboardService } from '../../../../@core/sharedServices/dashboard.service';
import { InternalRoleRefType } from '../../../../@core/enum';

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss']
})

export class UserListComponent implements OnInit, AfterViewInit {

    //For Model Ref
    modalRef: NgbModalRef | null;

    //Form View child
    @ViewChild('searchTextInput', { static: true }) searchTextInput: ElementRef;
    @ViewChild('pTable') private pTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    //User list data source
    dataSource: UserDetail[] = [];
    pagingParams: PagingParams;
    totalRecords: number;

    //permission variable
    isViewUser: boolean = false;
    isAddUser: boolean = false;
    isEditUser: boolean = false;
    isDeleteUser: boolean = false;

    loggedUserDetail: any;

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
    isShowImpersonateColumn: boolean = false;

    roleDataSource: any = [];

    //search filter
    lastUserSearchFilter: any;
    userSearchFilter = {
        searchText: '',
        selectedRoleIds: []
    }

    internalRoleRefType: any = InternalRoleRefType;

    impersonateLoginPermission: any = [
        enumPermissions.DealerLoginImpersonate,
        enumPermissions.CustomerLoginImpersonate,
        enumPermissions.ProductsLoginImpersonate,
        enumPermissions.MarketingLoginImpersonate,
        enumPermissions.SalesLoginImpersonate,
        enumPermissions.WarrantyLoginImpersonate,
    ]

    constructor(private _router: Router,
        private _modalService: NgbModal,
        private _confirmationDialogService: ConfirmationDialogService,
        private _commonHelper: CommonHelper,
        private _usersService: UsersService,
        private _rolesService: RolesService,
        private _dashboardService: DashboardService) {


        this.isViewUser = this._commonHelper.havePermission(enumPermissions.ViewUser);
        this.isAddUser = this._commonHelper.havePermission(enumPermissions.AddUser);
        this.isEditUser = this._commonHelper.havePermission(enumPermissions.EditUser);
        this.isDeleteUser = this._commonHelper.havePermission(enumPermissions.DeleteUser);

        this.isShowImpersonateColumn = this._commonHelper.havePermission(this.impersonateLoginPermission);

        this.isShowActionColumn = (this.isViewUser && this.isEditUser) || (this.isViewUser && this.isDeleteUser);
        //Set column  name json
        this.cols = [
            // { field: 'imagePath', header: '', sort: false, class: "user-img" },
            { field: 'fullName', header: 'URAM.USER.LIST.TABLE_HEADER_NAME', sort: true },
            { field: 'email', header: 'URAM.USER.LIST.TABLE_HEADER_EMAIL', sort: true },
            { field: 'phone', header: 'URAM.USER.LIST.TABLE_HEADER_PHONE', sort: true },
            { field: 'roleName', header: 'URAM.USER.LIST.TABLE_HEADER_ROLE', sort: true },
            { field: 'isActive', header: 'URAM.USER.LIST.TABLE_HEADER_STATUS', sort: true },
            { field: 'id', header: '', sort: false, class: "impersonate " + (this.isShowImpersonateColumn ? "hide" : "") }, // URAM.USER.LIST.TABLE_HEADER_IMPERSONATELOGIN
            { field: 'id', header: '', sort: false, class: "action " + (this.isShowActionColumn ? "hide" : "") }
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

    ngOnInit(): void {

        this.loggedUserDetail = this._commonHelper.getLoggedUserDetail();

        //get local storage for search        
        let localPageLayout = JSON.parse(localStorage.getItem("uramusp"));
        if (localPageLayout != null) {
            this.userSearchFilter = localPageLayout;
        }
        this.lastUserSearchFilter = JSON.parse(JSON.stringify(this.userSearchFilter));
        this.getAllRoles();
    }

    ngAfterViewInit() {
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
            selectedRoleIds: []
        }

        //Set pagination params
        this.pagingParams.searchString = '';
        this.pagingParams.sortColumn = 'name';
        this.pagingParams.sortOrder = 'ASC';
        this.pagingParams.pageNo = 0;
        this.pagingParams.pageSize = 10;
        //Fill Users
        this.getUsers(this.pagingParams);
    }

    isLoggedUser(loggedId) {
        if (loggedId === this.loggedUserDetail.userId) {
            return false;
        }
        return true;
    }

    loadUsers() {
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

        if (this.userSearchFilter.selectedRoleIds.length > 0) {
            this.pagingParams.roleIds = this.userSearchFilter.selectedRoleIds.map(roldId => roldId['id']).toString();
        } else {
            this.pagingParams.roleIds = '';
        }

        this.userSearchFilter.searchText = this.userSearchFilter.searchText != null ? this.userSearchFilter.searchText.trim() : '';
        this.pagingParams.searchString = this.userSearchFilter.searchText;

        if (this.userSearchFilter.selectedRoleIds.length > 0) {
            this.pagingParams.roleIds = this.userSearchFilter.selectedRoleIds.map(roldId => roldId['id']).toString();
        } else {
            this.pagingParams.roleIds = '';
        }
        this.getUsers(this.pagingParams);
    }

    getUsers(pagingParams: PagingParams) {
        this._commonHelper.showLoader();
        this._usersService.getUsers(pagingParams).then(
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

        //set search filter in local storage
        localStorage.setItem('uramusp', JSON.stringify(this.userSearchFilter));
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

    //admin reset user password
    resetPassword(userId) {
        this.optionsForPopupDialog.size = "md";
        this.modalRef = this._modalService.open(UserResetPasswordDialogComponent, this.optionsForPopupDialog);
        this.modalRef.componentInstance.userId = userId;
        this.modalRef.result.then(response => {
            if (response != undefined) {

                //Set pagination params
                this.pagingParams.searchString = '';
                this.pagingParams.sortColumn = 'name';
                this.pagingParams.sortOrder = 'ASC';
                this.pagingParams.pageNo = 0;
                this.pagingParams.pageSize = 10;
                //Fill Users
                this.getUsers(this.pagingParams);
            }
        });
    }

    //Call to add form
    addUser() {
        this._router.navigate(['settings/uram/users/add']);
    }

    //Call to edit form
    editUser(userId) {
        this._router.navigate([`settings/uram/users/${userId}`]);
    }

    deleteUser(userId) {
        //option for confirm dialog settings
        let optionsForConfirmDialog = {
            size: "md",
            centered: false,
            backdrop: 'static',
            keyboard: false
        };
        this._confirmationDialogService.confirm('URAM.USER.LIST.MESSAGE_CONFIRM_DELETE', null, null, optionsForConfirmDialog)
            .then((confirmed) => {
                if (confirmed) {
                    this._commonHelper.showLoader();
                    this._usersService.delete(userId).then(response => {
                        this._commonHelper.hideLoader();
                        this._commonHelper.showToastrSuccess(
                            this._commonHelper.getInstanceTranlationData('URAM.USER.LIST.MESSAGE_USER_DELETE')
                        );

                        this.onResetAllFilters();
                    },
                        (error) => {
                            this._commonHelper.hideLoader();
                            this.getTranslateErrorMessage(error);
                        });
                }
            });
    }

    getAllRoles(): void {
        this._commonHelper.showLoader();
        this._rolesService.getAllRoles().then(response => {
            this._commonHelper.hideLoader();
            if (response) {
                this.roleDataSource = response as [];
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

    onLoginImpersonate(rowData: any): void {
        this._commonHelper.showLoader();
        this._dashboardService.impersonateLogin(rowData.id).then(response => {
            this._commonHelper.hideLoader();
            if (response) {
                let accessToken = response;
                window.location.href = "auth/autologin?k=" + accessToken;
            }
        },
            (error) => {
                this._commonHelper.hideLoader();
                this.getTranslateErrorMessage(error);
            });
    }
}
