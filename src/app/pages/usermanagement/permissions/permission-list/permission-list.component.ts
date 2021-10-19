import { OnInit, ViewChild, Component } from '@angular/core';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';

import { PagingParams } from '../../../../@core/sharedModels/paging-params.model';
import { Permission } from '../permission.model';
import { PermissionsService } from '../permissions.service';
import { CommonHelper } from '../../../../@core/common-helper';

@Component({
  selector: 'permission-list',
  templateUrl: './permission-list.component.html',
  styleUrls: ['./permission-list.component.scss']
})
export class PermissionListComponent implements OnInit {
  //Form View child
  @ViewChild('pTable') private pTable: Table;
  @ViewChild('paginator') paginator: Paginator;

  //Permission list data source
  dataSource: Permission[] = [];
  pagingParams: PagingParams;
  
  //Table Column
  cols: any[];
  totalRecords: number;
  isShowActionColumn: boolean = false;

  constructor(private _commonHelper: CommonHelper,
    private _permissionsService: PermissionsService) {

    this.cols = [
      { field: 'name', header: 'Permission', sort: true },
      { field: 'isActive', header: 'Active', sort: false }
    ];

    this._commonHelper.getTranlationData('dummyKey').then(result => {
      this.cols.forEach(item => {
        item.header = _commonHelper.getInstanceTranlationData(item.header);
      });
    });

    //Set PaginParams
    this.pagingParams = new PagingParams();
    this.pagingParams.searchString = '';
    this.pagingParams.sortColumn = 'name';
    this.pagingParams.sortOrder = 'ASC';
    this.pagingParams.pageNo = 0;
    this.pagingParams.pageSize = 10;
  }

  ngOnInit(): void {
    this.getPermissions(this.pagingParams);
  }

  loadPermissions() {
    if (this.pTable != undefined && this.paginator != undefined) {
      this.pagingParams.pageNo = this.paginator.paginatorState.page;
      this.pagingParams.pageSize = this.paginator.paginatorState.rows;

      if (this.pTable.filters.global != undefined) {
        // this.pagingParams.searchString = this.pTable.filters.global.value;
      } else {
        this.pagingParams.searchString = '';
      }

      if (this.pTable.sortOrder == 1) {
        this.pagingParams.sortOrder = "ASC";
      }
      else {
        this.pagingParams.sortOrder = "DESC";
      }
      this.pagingParams.sortColumn = this.pTable.sortField;

      this.getPermissions(this.pagingParams)
    }
  }

  getPermissions(pagingParams: PagingParams) {    
    this._commonHelper.showLoader();
    this._permissionsService.getPermissions(pagingParams).then(
      response => {        
        setTimeout(() => {
          if (response) {
            this.dataSource = response as Permission[];

            if (this.dataSource.length > 0) {
              this.totalRecords = response[0]['totalRecords'];
            } else {
              this.totalRecords = 0;
            }            
            this._commonHelper.hideLoader();
          }
          else{
            this._commonHelper.hideLoader();
          }
        }, 200);
        
      },
      (error) => {
        if (error.error != null && error.error.messageCode) {
          this._commonHelper.hideLoader();
          this._commonHelper.showToastrError(
              this._commonHelper.getInstanceTranlationData('URAM.PERMISSION.' + error.error.messageCode.replace('.', '_').toUpperCase())
          );
        }
      });
  }
}