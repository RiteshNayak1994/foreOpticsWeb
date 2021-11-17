import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from '../../../@core/sharedServices/dashboard.service';
import { CommonHelper } from '../../../@core/common-helper';

@Component({
  selector: 'app-supplier-dashboard',
  templateUrl: './supplier-dashboard.component.html',
  styleUrls: ['./supplier-dashboard.component.scss']
})
export class SupplierDashboardComponent implements OnInit {

  showOrderData = false;
  orderNo = 0;
  selectedOrder = null;
  searchFilterForm: FormGroup;
  selectedBuyerId = 0;
  selectedTSValue = 30;
  indicatorList;
  supplierId = 0;
  supplierName = '';

  dashboardName = 'Supply_Chain_Supplier_Detail';

  timeSpanList = [
    { 'label': '30 Days', 'value': 30 },
    { 'label': '60 Days', 'value': 60 },
    { 'label': '90 Days', 'value': 90 }
  ];
  buyerList: any[] = [];
  fltrs = {
    selectedValue: 'dollar',
    value: ['quantity', 'dollar']
  };

  constructor(
    private _location: Location,
    private formBuilder: FormBuilder,
    private _dashboardService: DashboardService,
    private commonHelper: CommonHelper,
    private _router: Router,
    private _activateRoute: ActivatedRoute
  ) {

    this.supplierId = this._activateRoute.snapshot.params["id"];
    if (this._router.getCurrentNavigation().extras.state) {
      let supplierData = this._router.getCurrentNavigation().extras.state;
      sessionStorage.setItem(supplierData.SupplierId, supplierData.SupplierName);
      this.supplierName = supplierData.SupplierName;
    }
    else {
      this.supplierName = sessionStorage.getItem(this.supplierId.toString());
    }
  }

  ngOnInit(): void {
    this.searchFilterForm = this.createFilterForm();
    this.getBuyerList();
    this.getIndicatorList();
  }

  createFilterForm() {
    return this.formBuilder.group({
      selectedTimeSpan: [this.selectedTSValue],
      selectedBuyer: [this.selectedBuyerId],
      selectedViewType: ['supplier']
    });
  }

  getBuyerList() {
    this.buyerList = [];
    this.buyerList.push({ id: 0, name: 'All Buyers' });
    //this.commonHelper.showLoader();

    // Get Member services
    this._dashboardService.getBuyers(this.selectedTSValue, this.supplierId).then(
      (response: any[]) => {
        //this.commonHelper.setLoaderHide();
        this.buyerList = [...this.buyerList, ...response]
      },

      (error: any) => {
       // this.commonHelper.setLoaderHide();
        this.commonHelper.getGeneralTranslateErrorMessage(error);
      });
  }

  getIndicatorList() {
    this.commonHelper.showLoader();

    this._dashboardService.getFOWidgetsList(this.dashboardName).then((wdgts) => {
      if (wdgts) {
        this.commonHelper.setLoaderHide();
        this.indicatorList = JSON.parse(JSON.stringify(wdgts));
        this.indicatorList.forEach((iL) => {
          iL.widgetBody = JSON.parse(iL.widgetBody);
          iL.widgetHeader = JSON.parse(iL.widgetHeader);
          iL.widgetSize = JSON.parse(iL.widgetSize);
        });
      }
    },
      (error) => {
        this.commonHelper.setLoaderHide();
        this.commonHelper.getGeneralTranslateErrorMessage(error);
      }
    );
  }

  handleOrderClick(orderNumber) {
    this.getOrderData(orderNumber);
  }

  getOrderData(orderNumber) {
    this.showOrderData = true;
    this.orderNo = orderNumber;
  }

  changeFilter(filterValue: string) {
    this.fltrs.selectedValue = filterValue;
  }

  //call on back 
  onBack() {
    this._location.back();
  }

  onTimeSpanChange() {
    this.selectedTSValue = this.searchFilterForm.controls["selectedTimeSpan"].value;
    this._dashboardService.selectedTimeSpan.next({
      dashBoardName: this.dashboardName,
      timeSpanValue: this.selectedTSValue
    });
    this.getBuyerList();
  }

  onBuyerChange() {
    this.selectedBuyerId = this.searchFilterForm.controls["selectedBuyer"].value.id;
    this._dashboardService.selectedBuyerId.next({
      dashBoardName: this.dashboardName,
      buyerId: this.selectedBuyerId
    });
  }

}
