import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { debounceTime, map, filter } from "rxjs/operators";
import { fromEvent } from 'rxjs';
import { Paginator } from 'primeng/paginator';

import { CommonHelper, enumPermissions } from '../../../../@core/common-helper';
import { PagingParams } from '../../../../@core/sharedModels/paging-params.model';
import { Role } from '../role.model';
import { ConfirmationDialogService } from '../../../../@core/sharedModules/confirmation-dialog/confirmation-dialog.service';
import { RolesService } from '../role.service';

@Component({
  selector: 'role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss']
})
export class RoleListComponent implements OnInit {
  //Form View child
  @ViewChild('searchTextInput', { static: true }) searchTextInput: ElementRef;
  @ViewChild('pTable') private pTable: Table;
  @ViewChild('paginator') paginator: Paginator;

  //Role list data source
  dataSource: Role[] = [];
  pagingParams: PagingParams;

  //permission variable
  isViewRole: boolean = false;
  isAddRole: boolean = false;
  isEditRole: boolean = false;
  isDeleteRole: boolean = false;

  //Table Column
  cols: any[];
  totalRecords: number;
  isShowActionColumn: boolean = false;

  //search filter
  lastRoleSearchFilter: any;
  roleSearchFilter = {
    searchText: ''
  }

  constructor(private _router: Router,
    private _confirmationDialogService: ConfirmationDialogService,
    private _commonHelper: CommonHelper,
    private _rolesService: RolesService) {
    this.isViewRole = this._commonHelper.havePermission(enumPermissions.ViewRole);
    this.isAddRole = this._commonHelper.havePermission(enumPermissions.AddRole);
    this.isEditRole = this._commonHelper.havePermission(enumPermissions.EditRole);
    this.isDeleteRole = this._commonHelper.havePermission(enumPermissions.DeleteRole);

    this.isShowActionColumn = (this.isViewRole && this.isEditRole) || (this.isViewRole && this.isDeleteRole);

    //Set column  name json
    this.cols = [
      { field: 'name', header: 'URAM.ROLE.LIST.TABLE_HEADER_ROLE', sort: true },
      { field: 'internalRoleName', header: 'URAM.ROLE.LIST.TABLE_HEADER_SYSTEM_ROLE', sort: true },
      { field: 'permissionSetName', header: 'URAM.ROLE.LIST.TABLE_HEADER_PERMISSION_SET', sort: false },
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
    this.pagingParams.sortColumn = 'name';
    this.pagingParams.sortOrder = 'ASC';
    this.pagingParams.pageNo = 0;
    this.pagingParams.pageSize = 10;
  }

  ngOnInit(): void {

    //get local storage for search        
    let localPageLayout = JSON.parse(localStorage.getItem("uramrsp"));
    if (localPageLayout != null) {
      this.roleSearchFilter = localPageLayout;
    }
    this.lastRoleSearchFilter = JSON.parse(JSON.stringify(this.roleSearchFilter));

    this.getRoles(this.pagingParams);

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
      this.loadRoles();
    });
  }

  loadRoles() {

    if (this.pTable != undefined && this.paginator != undefined) {

      this.pagingParams.pageNo = this.paginator.paginatorState.page;
      this.pagingParams.pageSize = this.paginator.paginatorState.rows;

      this.pagingParams.searchString = this.roleSearchFilter.searchText;

      if (this.pTable.sortOrder == 1) {
        this.pagingParams.sortOrder = "ASC";
      }
      else {
        this.pagingParams.sortOrder = "DESC";
      }
      this.pagingParams.sortColumn = this.pTable.sortField;

      this.getRoles(this.pagingParams)
    }
  }

  onResetAllFilters() {
    //set Serch Textbox value
    this.roleSearchFilter.searchText = '';

    //Set pagination params
    this.pagingParams.searchString = '';
    this.pagingParams.sortColumn = 'name';
    this.pagingParams.sortOrder = 'ASC';
    this.pagingParams.pageNo = 0;
    this.pagingParams.pageSize = 10;

    //Fill Roles
    this.getRoles(this.pagingParams);
  }

  getRoles(pagingParams: PagingParams) {   

    this.roleSearchFilter.searchText = this.roleSearchFilter.searchText != null ? this.roleSearchFilter.searchText.trim() : '';
    pagingParams.searchString = this.roleSearchFilter.searchText;

    this._commonHelper.showLoader();
    this._rolesService.getRoles(pagingParams).then(
      response => {
        this._commonHelper.hideLoader();
        if (response) {
          this.dataSource = response as Role[];
          if (this.dataSource.length > 0) {
            this.totalRecords = response[0]['totalRecords'];
          } else {
            this.totalRecords = 0;
          }
        }
      },
      (error) => {
        this._commonHelper.hideLoader();
        this.getTranslateErrorMessage(error);        
      });
    //set search filter in local storage
    localStorage.setItem('uramrsp', JSON.stringify(this.roleSearchFilter));
  }

  //Call to add form
  addRole() {
    this._router.navigate(['settings/uram/roles/add']);
  }

  //Call to edit form
  editRole(roleId) {
    this._router.navigate([`settings/uram/roles/${roleId}`]);
  }

  deleteRole(roleId) {
    //option for confirm dialog settings
    let optionsForConfirmDialog = {
      size: "md",
      centered: false,
      backdrop: 'static',
      keyboard: false
    };

    this._confirmationDialogService.confirm('URAM.ROLE.LIST.MESSAGE_CONFIRM_ROLE_DELETE', null, null, optionsForConfirmDialog)
      .then((confirmed) => {
        if (confirmed) {
          this._commonHelper.showLoader();
          this._rolesService.deleteRole(roleId).then(response => {
            this._commonHelper.hideLoader();
            this._commonHelper.showToastrSuccess(
              this._commonHelper.getInstanceTranlationData('URAM.ROLE.LIST.MESSAGE_ROLE_DELETE')
            );

            this.onResetAllFilters();
          },
            (error) => {
              this._commonHelper.hideLoader();
              this.getTranslateErrorMessage(error);
            });
        }
      })
      .catch(() => this._commonHelper.showToastrError(this._commonHelper.getInstanceTranlationData('URAM.ROLE.LIST.ROLE_DISMISS_DIALOG')));
  }

  getTranslateErrorMessage(error) {
    if (error.error != null && error.error.messageCode) {
      this._commonHelper.showToastrError(
        this._commonHelper.getInstanceTranlationData('URAM.ROLE.' + error.error.messageCode.replace('.', '_').toUpperCase())
      );
    }
  }
}