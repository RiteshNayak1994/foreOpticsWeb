import { Component, OnInit } from '@angular/core';
import { CommonHelper } from '../../../@core/common-helper';
import { DashboardService } from '../../../@core/sharedServices/dashboard.service';
import { tableWidget } from './staticForecastWidgetData';

@Component({
  selector: 'app-forecast-dashboard-v2',
  templateUrl: './forecast-dashboard-v2.component.html',
  styleUrls: ['./forecast-dashboard-v2.component.scss']
})
export class ForecastDashboardV2Component implements OnInit {

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
    //this.indicatorList = widgetForecastData;
    this.getIndicatorList();
  }

  getSelectedFilters(event) {
    this.filterObj = event;
  }

  getIndicatorList() {
    this.commonHelper.showLoader();
    let dashboardName = 'Risk_Forecast';

    this._dashboardService.getFOWidgetsList(dashboardName).then((wdgts) => {
      if (wdgts) {
        this.commonHelper.hideLoader();
        this.indicatorList = JSON.parse(JSON.stringify(wdgts));
        this.indicatorList.forEach((iL) => {
          iL.widgetBody = JSON.parse(iL.widgetBody);
          iL.widgetHeader = JSON.parse(iL.widgetHeader);
          iL.widgetSize = JSON.parse(iL.widgetSize);
        });
        this.indicatorList.push(tableWidget);
      }
    },
      (error) => {
        this.commonHelper.hideLoader();
        this.commonHelper.getGeneralTranslateErrorMessage(error);
      }
    );
  }

}
