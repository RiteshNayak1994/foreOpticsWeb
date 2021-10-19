import { Component, OnInit } from '@angular/core';
import { CommonHelper } from '../../../@core/common-helper';
import { DashboardService } from '../../../@core/sharedServices/dashboard.service';

@Component({
  selector: 'app-risk-trend-dasboard',
  templateUrl: './risk-trend-dasboard.component.html',
  styleUrls: ['./risk-trend-dasboard.component.scss']
})
export class RiskTrendDasboardComponent implements OnInit {

  indicatorList: any[];

  filterObj = {
    timeSpan: 90,
    BuyerId: '',
    SupplierId: '',
    Commodity: '',
    POLineNum: '',
    PartNumber: ''
  };

  constructor(
    private _dashboardService: DashboardService,
    private commonHelper: CommonHelper
  ) { }

  ngOnInit(): void {
    //this.indicatorList = widgetRiskTrendData;
    this.getIndicatorList();
  }

  getSelectedFilters(event) {
    this.filterObj = event;
  }

  getIndicatorList() {
    this.commonHelper.showLoader();
    let dashboardName = 'Risk_Trend';

    this._dashboardService.getFOWidgetsList(dashboardName).then((wdgts) => {
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
}
