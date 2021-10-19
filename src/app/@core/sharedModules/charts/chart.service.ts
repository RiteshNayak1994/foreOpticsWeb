import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CommonHelper } from '../../common-helper';
import { HttpHelperService } from '../../http-helper.service';

@Injectable()
export class ChartService extends HttpHelperService {

  selectedData = new Subject();
  IndicatorSize = new Subject();
  indicatorData = new Subject();
  filterConfig = new Subject<{ filterName: string, filterValue: string, indicatorId: number }>();
  urlData = [];
  selectedView = new BehaviorSubject({});
  selectedOrder = new Subject();
  selectedSupplier_ForRiskTrend = new Subject();
  showBackBtn = new BehaviorSubject({});
  showCheckBoxCol = new Subject();
  riskTrendData = new Subject();
  selectedSupplierIDs = new Subject();
  isAscending = new Subject();
  exportTableData = new Subject();

  constructor(public _httpClient: HttpClient, public _router: Router, public _commonHelper: CommonHelper) {
    super(_httpClient, _router, _commonHelper);
  }

  setFilterConfig(filterConfig: { filterName: string, filterValue: string, indicatorId: number }) {
    this.filterConfig.next(filterConfig);
  }

  getFilterConfig() {
    return this.filterConfig.asObservable();
  }

  getWidgetsData(id: number, parameters: any) {
    let params = {
      id: id,
      widgetParameters: parameters
    }
    const url = environment.WidgetApiUrl + 'Widgets/GetWidgetData';
    return this.getHttpAuthrizedPostRequest(url, params);
  }

  getUrlData(url) {
    let exist = this.urlData.find(u => u.url == url);
    if (exist)
      return exist.data;
    else {
      this.urlData.push({ url: url, data: new BehaviorSubject(undefined) });
      exist = this.urlData.find(u => u.url == url);
      this._httpClient.get(url).subscribe(data => {
        let urlD = this.urlData.find(u => u.url == url);
        urlD.data.next(data);
      });
      return exist.data;
    }
  }

  getQueryData(sqlQuery, IsQuerySp, parameters = []) {
    let params = {
      Query: sqlQuery,
      IsQuerySp: IsQuerySp,
      widgetParameters: parameters
    }
    const url = environment.WidgetApiUrl + 'Widgets/GetQueryData';
    return this.getHttpAuthrizedPostRequest(url, params);
  }

  GetSupplyChainPOLineAtRisk(timeSpan, po) {
    let params = {
      timeSpan: timeSpan,
      PO: po,
    };
    const url = environment.WidgetApiUrl + 'Widgets/GetSupplyChainPOLineAtRisk';
    return this.getHttpAuthrizedPostRequest(url, params);
  }

  GetDrillDownRiskChartData(params) {
    const url = environment.WidgetApiUrl + 'Widgets/GetDrillDownRiskChartData';
    return this.getHttpAuthrizedPostRequest(url, params);
  }
}
