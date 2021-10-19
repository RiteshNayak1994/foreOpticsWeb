import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { CommonHelper } from '../../common-helper';
import { HttpHelperService } from '../../http-helper.service';

@Injectable({
  providedIn: 'root'
})
export class FilterService extends HttpHelperService {
  SCfilterObj = new Subject();

  constructor(public _httpClient: HttpClient, public _router: Router, public _commonHelper: CommonHelper) {
    super(_httpClient, _router, _commonHelper);
  }

  //pane filter service
  getSupplyChainBuyers(timeSpan) {
    let params = {
      timeSpan: timeSpan
    };
    const url = environment.WidgetApiUrl + 'Widgets/GetSupplyChainBuyers';
    return this.getHttpAuthrizedPostRequest(url, params);
  }

  getSupplyChainSuppliers(timeSpan, buyerId) {
    let params = {
      timeSpan: timeSpan,
      BuyerId: buyerId,
    };
    const url = environment.WidgetApiUrl + 'Widgets/GetSupplyChainSuppliers';
    return this.getHttpAuthrizedPostRequest(url, params);
  }

  getSupplyChainCommodity(timeSpan) {
    let params = {
      timeSpan: timeSpan
    };
    const url = environment.WidgetApiUrl + 'Widgets/GetSupplyChainCommodity';
    return this.getHttpAuthrizedPostRequest(url, params);
  }

  getSupplyChainPOLine(timeSpan) {
    let params = {
      timeSpan: timeSpan
    };
    const url = environment.WidgetApiUrl + 'Widgets/GetSupplyChainPOLine';
    return this.getHttpAuthrizedPostRequest(url, params);
  }

  getSupplyChainPN(timeSpan, buyerId = '', supplierId = '', commodity = '', pOLineNum = '') {
    let params = {
      timeSpan: timeSpan,
      BuyerId: buyerId,
      SupplierId: supplierId,
      Commodity: commodity,
      POLineNum: pOLineNum
    };
    const url = environment.WidgetApiUrl + 'Widgets/GetSupplyChainPN';
    return this.getHttpAuthrizedPostRequest(url, params);
  }

  getSupplyChainFilterData() {
    let params = {};
    const url = environment.WidgetApiUrl + 'Widgets/GetSupplyChainFilterData';
    return this.getHttpAuthrizedPostRequest(url, params);
  }
}
