import { Component, OnInit } from '@angular/core';
import { CommonHelper } from '../../../@core/common-helper';
import { DashboardService } from '../../../@core/sharedServices/dashboard.service';
import { widgetData } from './staticWidgetData';

@Component({
  selector: 'app-risk-profile-dashboard',
  templateUrl: './risk-profile-dashboard.component.html',
  styleUrls: ['./risk-profile-dashboard.component.scss']
})
export class RiskProfileDashboardComponent implements OnInit {

  widgetList = widgetData;
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
    //this.indicatorList = widgetData;
    this.getIndicatorList();
  }

  getSelectedFilters(event) {
    this.filterObj = event;
    // console.log(event);
  }

  getIndicatorList() {
    this.commonHelper.showLoader();
    let dashboardName = 'Risk_Profile';

    this._dashboardService.getFOWidgetsList(dashboardName).then((wdgts) => {
      if (wdgts) {
        this.commonHelper.hideLoader();
        this.indicatorList = JSON.parse(JSON.stringify(wdgts));
        this.indicatorList.forEach((iL) => {
          // if(iL.id == 34){
          //   iL.widgetBody = widgetData[1].widgetBody;
          //   iL.widgetHeader = widgetData[1].widgetHeader;
          //   iL.widgetSize = widgetData[1].widgetSize;
          // }
          // else{
            iL.widgetBody = JSON.parse(iL.widgetBody);
            iL.widgetHeader = JSON.parse(iL.widgetHeader);
            iL.widgetSize = JSON.parse(iL.widgetSize);
          //}
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
