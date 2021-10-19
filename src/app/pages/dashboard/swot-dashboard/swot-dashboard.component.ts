import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../../@core/sharedServices/dashboard.service';
import { CommonHelper } from '../../../@core/common-helper';

@Component({
  selector: 'app-swot-dashboard',
  templateUrl: './swot-dashboard.component.html',
  styleUrls: ['./swot-dashboard.component.scss']
})
export class SwotDashboardComponent implements OnInit {

  searchFilterForm: FormGroup;
  selectedViewType: string;
  indicatorList: any[];

  isPartsView: boolean = false;

  timeSpanList = [
    { 'label': '30 Days', 'value': 30 },
    { 'label': '60 Days', 'value': 60 },
    { 'label': '90 Days', 'value': 90 }
  ];
  buyerList: any[] = [];
  partsList: any[] = [];
  dashboardName: string;
  selectedBuyerId = 0;
  selectedTSValue = 30;
  selectedPartId = 0;

  constructor(
    private formBuilder: FormBuilder,
    private _dashboardService: DashboardService,
    private commonHelper: CommonHelper
  ) { }

  ngOnInit(): void {
    this.searchFilterForm = this.createFilterForm();
    this.getIndicatorList();
    this.getBuyerList();
    this.getPartList();
  }

  createFilterForm() {
    return this.formBuilder.group({
      selectedPart: [this.selectedPartId],
      selectedTimeSpan: [this.selectedTSValue],
      selectedBuyer: [this.selectedBuyerId],
      selectedViewType: ['supplier']
    });
  }

  getBuyerList() {
    this.buyerList.push({ id: 0, name: 'All Buyers' });
    this.commonHelper.showLoader();

    // Get Member services
    this._dashboardService.getBuyers(this.selectedTSValue).then(
      (response: any[]) => {
        this.commonHelper.hideLoader();
        this.buyerList = [...this.buyerList, ...response]
      },

      (error: any) => {
        this.commonHelper.hideLoader();
        this.commonHelper.getGeneralTranslateErrorMessage(error);
      });
  }

  getPartList(buyerId = null) {
  
    this.partsList.push({ id: 0, partName: 'All Parts' });
    this._dashboardService.getFOPartList(this.selectedBuyerId, null, this.dashboardName, this.selectedTSValue, "", "").then((parts: any[]) => {
      if (parts.length > 0) {
        this.partsList = [...this.partsList, ...parts];
      }
    },
      (error) => {
        this.commonHelper.hideLoader();
        this.commonHelper.getGeneralTranslateErrorMessage(error);
      }
    );
  }

  getIndicatorList() {
    this.commonHelper.showLoader();
    this.dashboardName = 'Supply_Chain_Supplier';
    this.isPartsView = false;
    if (this.searchFilterForm.controls["selectedViewType"].value == "parts") {
      this.dashboardName = 'Supply_Chain_Part';
      this.isPartsView = true;
    }
    else if (this.searchFilterForm.controls["selectedViewType"].value == "productFamily") {
      this.dashboardName = 'Supply_Chain_Product_Family';
    }
    else if (this.searchFilterForm.controls["selectedViewType"].value == "platforms") {
      this.dashboardName = 'Supply_Chain_Platform';
    }

    this._dashboardService.getFOWidgetsList(this.dashboardName).then((wdgts) => {
      if (wdgts) {
        this.commonHelper.hideLoader();
        this.indicatorList = JSON.parse(JSON.stringify(wdgts));
        this.indicatorList.forEach((iL) => {
          iL.widgetBody = JSON.parse(iL.widgetBody);
          iL.widgetHeader = JSON.parse(iL.widgetHeader);
          iL.widgetSize = JSON.parse(iL.widgetSize);
        });
      }
    },
      (error) => {
        this.commonHelper.hideLoader();
        this.commonHelper.getGeneralTranslateErrorMessage(error);
      }
    );
  }

  onTimeSpanChange() {
    this.selectedTSValue = this.searchFilterForm.controls["selectedTimeSpan"].value;
    this._dashboardService.selectedTimeSpan.next({
      dashBoardName: this.dashboardName,
      timeSpanValue: this.selectedTSValue
    });
  }

  onBuyerChange() {
    this.selectedBuyerId = this.searchFilterForm.controls["selectedBuyer"].value.id;
    this._dashboardService.selectedBuyerId.next({
      dashBoardName: this.dashboardName,
      buyerId: this.selectedBuyerId
    });
    if (this.isPartsView)
      this.getPartList();
  }

  onPartChange() {
    let tmpPartName = this.searchFilterForm.controls["selectedPart"].value.partName;
    this._dashboardService.selectedPartName.next({
      dashBoardName: this.dashboardName,
      partName: tmpPartName == "All Parts" ? "" : tmpPartName
    });
  }
}
