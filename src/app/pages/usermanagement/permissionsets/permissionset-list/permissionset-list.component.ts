import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { debounceTime, map, filter } from "rxjs/operators";
import { fromEvent } from 'rxjs';

import { CommonHelper, enumPermissions } from '../../../../@core/common-helper';
import { PagingParams } from '../../../../@core/sharedModels/paging-params.model';
import { ConfirmationDialogService } from '../../../../@core/sharedModules/confirmation-dialog/confirmation-dialog.service';
import { PermissionSet } from '../permissionset.model';
import { PermissionSetService } from '../permissionset.service';

@Component({
  selector: 'permissionset-list',
  templateUrl: './permissionset-list.component.html',
  styleUrls: ['./permissionset-list.component.scss'],
})
export class PermissionSetListComponent implements OnInit {

  //Form View child
  @ViewChild('searchTextInput', { static: true }) searchTextInput: ElementRef;
  @ViewChild('pTable') private pTable: Table;
  @ViewChild('paginator') paginator: Paginator;

  //permission set list data source
  dataSource: PermissionSet[] = [];
  pagingParams: PagingParams;

  //permission variable    
  isViewPermissionSet: boolean = false;
  isAddPermissionSet: boolean = false;
  isEditPermissionSet: boolean = false;
  isDeletePermissionSet: boolean = false;

  //Table Column
  cols: any[];
  totalRecords: number;
  isShowActionColumn: boolean = false;

  //search filter
  lastPermissionSetSearchFilter: any;
  permissionSetSearchFilter = {
      searchText: ''
  }

  constructor(private _router: Router,
    private _confirmationDialogService: ConfirmationDialogService,
    private _commonHelper: CommonHelper,
    private _permissionSetService: PermissionSetService) {
    this.isViewPermissionSet = this._commonHelper.havePermission(enumPermissions.ViewPermissionSet);
    this.isAddPermissionSet = this._commonHelper.havePermission(enumPermissions.AddPermissionSet);
    this.isEditPermissionSet = this._commonHelper.havePermission(enumPermissions.EditPermissionSet);
    this.isDeletePermissionSet = this._commonHelper.havePermission(enumPermissions.DeletePermissionSet);

    this.isShowActionColumn = (this.isViewPermissionSet && this.isEditPermissionSet) || (this.isViewPermissionSet && this.isDeletePermissionSet);

    //Set column  name json
    this.cols = [
      { field: 'name', header: 'URAM.PERMISSION_SET.LIST.TABLE_HEADER_PERMISSION_SET', sort: true },
      { field: 'permissionName', header: 'URAM.PERMISSION_SET.LIST.TABLE_HEADER_PERMISSION', sort: false },
      // { field: 'isActive', header: 'Active', sort: false },
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
    let localPageLayout = JSON.parse(localStorage.getItem("urampsp")); 
    if(localPageLayout != null){
        this.permissionSetSearchFilter = localPageLayout;
    }       
    this.lastPermissionSetSearchFilter = JSON.parse(JSON.stringify(this.permissionSetSearchFilter));      

    this.getPermissionSets(this.pagingParams);

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
      this.loadPermissionSets();
    });
  }

  loadPermissionSets() {

    if (this.pTable != undefined && this.paginator != undefined) {

      this.pagingParams.pageNo = this.paginator.paginatorState.page;
      this.pagingParams.pageSize = this.paginator.paginatorState.rows;

      this.pagingParams.searchString = this.permissionSetSearchFilter.searchText;

      if (this.pTable.sortOrder == 1) {
        this.pagingParams.sortOrder = "ASC";
      }
      else {
        this.pagingParams.sortOrder = "DESC";
      }
      this.pagingParams.sortColumn = this.pTable.sortField;

      this.getPermissionSets(this.pagingParams)
    }
  }


  onResetAllFilters(){
    this.permissionSetSearchFilter.searchText = '';
    //Set pagination params
    this.pagingParams.searchString = '';
    this.pagingParams.sortColumn = 'name';
    this.pagingParams.sortOrder = 'ASC';
    this.pagingParams.pageNo = 0;
    this.pagingParams.pageSize = 10;
    this.getPermissionSets(this.pagingParams);
  }

  getPermissionSets(pagingParams: PagingParams) {
    
    this.permissionSetSearchFilter.searchText = this.permissionSetSearchFilter.searchText != null ? this.permissionSetSearchFilter.searchText.trim() : '';
    pagingParams.searchString = this.permissionSetSearchFilter.searchText;

    this._commonHelper.showLoader();
    this._permissionSetService.getPermissionSets(pagingParams).then(response => {
      this._commonHelper.hideLoader();

      if (response) {
        this.dataSource = response as PermissionSet[];
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
      localStorage.setItem('urampsp', JSON.stringify(this.permissionSetSearchFilter));
  }

  //Call to add form
  addPermissionSet() {
    this._router.navigate(['settings/uram/permissionsets/add']);
  }

  //Call to edit form
  editPermissionSet(permissionsetId) {
    this._router.navigate([`settings/uram/permissionsets/${permissionsetId}`]);
  }

  deletePermissionSet(permissionsetId) {
    //option for confirm dialog settings
    let optionsForConfirmDialog = {
      size: "md",
      centered: false,
      backdrop: 'static',
      keyboard: false
    };

    this._confirmationDialogService.confirm('URAM.PERMISSION_SET.LIST.MESSAGE_PERMISSIONSET_DELETE', null, null, optionsForConfirmDialog)
      .then((confirmed) => {
        if (confirmed) {
          this._commonHelper.showLoader();
          this._permissionSetService.delete(permissionsetId).then(response => {
            this._commonHelper.hideLoader();
            this._commonHelper.showToastrSuccess(
              this._commonHelper.getInstanceTranlationData('URAM.PERMISSION_SET.LIST.MESSAGE_PERMISSIONSET_DELETE_SUCESSFULLY')
            );
              this.onResetAllFilters();
          },
            (error) => {
              this._commonHelper.hideLoader();
              this.getTranslateErrorMessage(error);
            });
        }
      })
      .catch(() => this._commonHelper.showToastrError(
        this._commonHelper.getInstanceTranlationData('URAM.PERMISSION_SET.LIST.PERMISSIONSETS_DISMISS_DIALOG')
      ));
  }

  getTranslateErrorMessage(error) {
      if (error.error != null && error.error.messageCode) {
        this._commonHelper.showToastrError(
          this._commonHelper.getInstanceTranlationData('CRM.PERMISSION_SET.' + error.error.messageCode.replace('.', '_').toUpperCase())
        );
      }
  }
}