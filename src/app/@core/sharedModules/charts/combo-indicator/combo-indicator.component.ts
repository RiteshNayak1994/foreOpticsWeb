import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';

import { ChartService } from '../chart.service';
import { CommonHelper } from '../../../common-helper';
import { DashboardService } from '../../../sharedServices/dashboard.service';
import { DashboardNamesList, FilterNameList, IndicatorNameList, nameParamType, RiskDisplayNameList, sizeList } from '../chartConstants';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { SelectItem } from 'primeng/api';
import { FilterService } from '../../filters/filter.service';
@Component({
  selector: 'app-combo-indicator',
  templateUrl: './combo-indicator.component.html',
  styleUrls: ['./combo-indicator.component.scss']
})
export class ComboIndicatorComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() indicatorConfig: any;
  @Input() selectedTSValue: number;
  @Input() selectedDuration: number;
  @Input() selectedBuyerId: string;
  @Input() selectedSupplierId: string;
  @Input() selectedPartName: string = "";
  @Input() selectedStartDate: Date;
  @Input() selectedEndDate: Date;
  @Input() selectedCommodity: string;
  @Input() selectedPOLine: string;
  @Input() SCfilterObj;
  header: any;
  chart: any;
  table: any;
  icon: any;
  text: any;
  indicatorData: any;
  sizeList = sizeList;
  selectedView = { label: 'Monthly', value: 'Monthly' };
  selectedRiskFilter = { label: 'RAR', value: 'RAR' };
  dataDurationList = [
    { label: 'Weekly', value: 'Weekly' },
    { label: 'Monthly', value: 'Monthly' },
    { label: 'Quarterly', value: 'Quarterly' },
  ];
  riskProfileFilterOptions: SelectItem[] = [
    { label: 'RAR', value: 'RAR' },
    { label: 'ES FS QS', value: 'EFQ' }
  ];
  selectedRiskFactor = { label: 'REL', value: 'Rel', caption: "Reliability" };
  riskFactorOptions = [
    { label: 'REL', value: 'Rel', caption: "Reliability" },
    { label: 'RES', value: 'Res', caption: "Responsiveness" },
    { label: 'AGL', value: 'Agl', caption: "Agility" },
    { label: 'ES', value: 'ES', caption: "ES" },
    { label: 'FS', value: 'FS', caption: "FS" },
    { label: 'QS', value: 'QS', caption: "QS" },
  ];
  dashboardNamesList = DashboardNamesList;
  filterNameList = FilterNameList;
  indicatorNameList = IndicatorNameList;
  isQueryDataCalled = false;
  subScriptionList: Subscription = new Subscription();
  selectedOrder: any;
  selectedSuppliersForCompareLength = 0;
  selectedSuppliersForCompare;
  dri;
  transportRisk;
  weatherRisk;
  lifeRisk;
  moneyRisk;
  locationRisk;
  documentRisk;
  totalRisk;
  poParamaterList = ['ItemsAtRisk', 'ItemsDeliveredOnTime'];
  headerItems = '';
  headerElement = '';
  showTableBackBtn: boolean = false;
  showCheckBoxColumn: boolean = false;
  riskTrendSID = 0;
  riskTrendIndex = -1;
  isAscending = true;

  riskDisplayName = RiskDisplayNameList;
  paramDataType = {
    int: "int",
    string: "string"
  }

  constructor(
    private chartService: ChartService,
    private _dashboardService: DashboardService,
    private commonHelper: CommonHelper,
    private cdRef: ChangeDetectorRef,
    private elementRef: ElementRef,
    private filterService: FilterService
  ) { }

  ngOnInit(): void {
    let tmpThis = this;
    // if (this.indicatorConfig.dashboardName == 'Supplier_Analysis' && (this.indicatorConfig.id == 1009 || this.indicatorConfig.id == 1010 || this.indicatorConfig.id == 1011)) {
    //   this.getSelectedOrderData();
    // }

    // for risk profile / risk trend dashboard back button of table after drill through
    // this.enableTableBackBtn();

    if (this.indicatorConfig) {
      this.header = this.indicatorConfig.widgetHeader;
      this.chart = this.indicatorConfig.widgetBody.chart;
      this.table = this.indicatorConfig.widgetBody.table;

      //   this.chart = this.indicatorConfig.widgetBody.chart && (this.indicatorConfig.widgetBody.chart.visible || this.indicatorConfig.widgetBody.chart.visible == undefined) ?
      //   this.indicatorConfig.widgetBody.chart : undefined;
      // this.table = this.indicatorConfig.widgetBody.table && (this.indicatorConfig.widgetBody.table.visible || this.indicatorConfig.widgetBody.table.visible == undefined) ?
      //   this.indicatorConfig.widgetBody.table : undefined;

      this.icon = this.indicatorConfig.widgetBody.icon;
      this.text = this.indicatorConfig.widgetBody.text;
      if (this.indicatorConfig.name == this.indicatorNameList.Risk_Trend[1].name)
        this.header.title = this.selectedRiskFactor.caption;
    }

    this.header.selectedView = { label: 'Monthly', value: 'Monthly' };

    let subscription;
    subscription = this._dashboardService.selectedTimeSpan.subscribe((tObj: any) => {
      if (tObj.dashBoardName == this.indicatorConfig.dashboardName) {
        this.selectedTSValue = tObj.timeSpanValue;
        this.getQueryData();
        this.setHeaderItems();
      }
    });
    this.subScriptionList.add(subscription);

    subscription = this._dashboardService.selectedBuyerId.subscribe((tObj: any) => {
      if (tObj.dashBoardName == this.indicatorConfig.dashboardName) {
        this.selectedBuyerId = tObj.buyerId;
        this.selectedPartName = "";
        this.getQueryData();
      }
    });
    this.subScriptionList.add(subscription);

    subscription = this._dashboardService.selectedSupplierId.subscribe((tObj: any) => {
      if (tObj.dashBoardName == this.indicatorConfig.dashboardName) {
        this.selectedSupplierId = tObj.suppierId;
        this.selectedPartName = "";
        this.getQueryData();
      }
    });
    this.subScriptionList.add(subscription);

    subscription = this._dashboardService.selectedPartName.subscribe((tObj: any) => {
      if (tObj.dashBoardName == this.indicatorConfig.dashboardName) {
        this.selectedPartName = tObj.partName;
        this.getQueryData();
      }
    });
    this.subScriptionList.add(subscription);

    subscription = this._dashboardService.selectedDates.subscribe((tObj: any) => {
      if (tObj.dashBoardName == this.indicatorConfig.dashboardName) {
        this.selectedStartDate = tObj.startDateTime;
        this.selectedEndDate = tObj.endDateTime;
        this.getQueryData();
      }
    });
    this.subScriptionList.add(subscription);

    subscription = this.chartService.selectedView.subscribe((vObj: any) => {
      if (vObj && tmpThis.indicatorConfig.dashboardName == vObj.dashboardName &&
        tmpThis.selectedView.value != vObj.selectedView.value) {
        tmpThis.selectedView = this.dataDurationList.find(dl => dl.value == vObj.selectedView.value);
        tmpThis.isQueryDataCalled = true;
        tmpThis.getQueryData();
      }
    })
    this.subScriptionList.add(subscription);

    subscription = this.chartService.selectedOrder.subscribe((selOrder: any) => {
      this.selectedOrder = this.commonHelper.isNullBlankUndefined(selOrder) ? undefined : selOrder;
      if (this.poParamaterList.includes(this.indicatorConfig.name)) {
        this.getQueryData();
      }
      this.setHeaderItems();
    }
    );
    this.subScriptionList.add(subscription);

    subscription = this.chartService.selectedSupplier_ForRiskTrend.subscribe(
      (selectedSuppliers: number) => {
        this.selectedSuppliersForCompareLength = selectedSuppliers;
      }
    );
    this.subScriptionList.add(subscription);

    subscription = this.filterService.SCfilterObj.subscribe((tObj: any) => {
      this.SCfilterObj = tObj.SCfilterObj;
      if (this.indicatorConfig.name == IndicatorNameList.Risk_Trend[2].name && this.showTableBackBtn)
        this.getDrillDownRiskChartData(this.riskTrendSID, this.riskTrendIndex);
      else
        this.getQueryData();
    });
    this.subScriptionList.add(subscription);

    subscription = this.enableTableBackBtn();
    this.subScriptionList.add(subscription);

    if (!this.isQueryDataCalled)
      this.getQueryData();

  }

  ngAfterViewInit() {
    if (this.header)
      this.setHeaderItems();
  }
  ngOnDestroy() {
    this.subScriptionList.unsubscribe();
  }

  createParameterObject(_name: string, _type: string, _value: any, _objectValue = undefined) {
    return {
      Name: _name,
      Type: _type,
      Value: _value,
      ObjectValue: _objectValue
    }
  }

  getQueryData() {
    if (this.indicatorConfig.id == 150 || this.indicatorConfig.id == 160) { return; }

    this.commonHelper.showLoader();

    let parameters = [];

    parameters.push(this.createParameterObject(nameParamType.TenantID, this.paramDataType.int, 1));

    if (this.indicatorConfig.dashboardName == DashboardNamesList.SupplyChainSupplierDetail) {
      let widgetParamaterList = ['SupplierDRI', 'SupplierReliability', 'SupplierReponsiveness', 'SupplierAgility', 'SpenOnOrderByBuyer',
        'QuantityOnOrderByBuyer'];

      let buyertParamaterList = ['SpenOnOrderByBuyer', 'QuantityOnOrderByBuyer', 'QuantityCostAtRisk', 'OrdersInComingDay',
        'ItemsAtRisk', 'ItemsDeliveredOnTime'];



      parameters.push(...[
        this.createParameterObject(nameParamType.TimeSpan, this.paramDataType.int, this.selectedTSValue),
        this.createParameterObject(nameParamType.SupplierID, this.paramDataType.string, this.selectedSupplierId)
      ]);

      if (buyertParamaterList.includes(this.indicatorConfig.name))
        parameters.push(
          this.createParameterObject(nameParamType.BuyerID, this.paramDataType.int, this.selectedBuyerId)
        );

      if (widgetParamaterList.includes(this.indicatorConfig.name))
        parameters.push(
          this.createParameterObject(nameParamType.WidgetName, this.paramDataType.string, this.indicatorConfig.name)
        );

      if (this.poParamaterList.includes(this.indicatorConfig.name))
        parameters.push(
          this.createParameterObject(nameParamType.PO, this.paramDataType.string, this.selectedOrder)
        );


    }
    else if (this.indicatorConfig.dashboardName == DashboardNamesList.RiskProfile || this.indicatorConfig.dashboardName == DashboardNamesList.RiskTrend ||
      this.indicatorConfig.dashboardName == DashboardNamesList.RiskForecast) {
      parameters.push(...[
        this.createParameterObject(nameParamType.TimeSpan, this.paramDataType.int, this.SCfilterObj.timeSpan),
        this.createParameterObject(nameParamType.BuyerID, this.paramDataType.string, this.SCfilterObj.BuyerId),
        this.createParameterObject(nameParamType.SupplierID, this.paramDataType.string, this.SCfilterObj.SupplierId),
        this.createParameterObject(nameParamType.Commodity, this.paramDataType.string, this.SCfilterObj.Commodity),
        this.createParameterObject(nameParamType.POLineNum, this.paramDataType.string, this.SCfilterObj.POLineNum),
        this.createParameterObject(nameParamType.PN, this.paramDataType.string, this.SCfilterObj.PartNumber)
      ]);

      if (this.indicatorConfig.name == this.indicatorNameList.Risk_Trend[0].name || this.indicatorConfig.name == this.indicatorNameList.Risk_Trend[1].name ||
        this.indicatorConfig.dashboardName == DashboardNamesList.RiskForecast) {
        parameters.push(
          this.createParameterObject(nameParamType.calculateAs, this.paramDataType.string, this.header.selectedView.value)
        );
      }
    }
    else if (this.indicatorConfig.dashboardName != DashboardNamesList.DemandSupplyForecast &&
      this.indicatorConfig.dashboardName != DashboardNamesList.DemandSupplyGap && this.indicatorConfig.dashboardName != DashboardNamesList.SupplyRiskAssessment) {
      parameters.push(
        this.createParameterObject(nameParamType.BuyerID, this.paramDataType.int, this.selectedBuyerId)
      );

      if (this.indicatorConfig.dashboardName == DashboardNamesList.SupplyChainPart)
        parameters.push(
          this.createParameterObject(nameParamType.Part, this.paramDataType.string, this.selectedPartName)
        );

      if (this.indicatorConfig.displayOrder < 4)
        parameters.push(...[
          this.createParameterObject(nameParamType.TimeSpan, this.paramDataType.int, this.selectedTSValue),
          this.createParameterObject(nameParamType.WidgetName, this.paramDataType.string, this.indicatorConfig.name)
        ]);
      else
        parameters.push(...[
          this.createParameterObject(nameParamType.DurationUnit, this.paramDataType.int, 'weekly'),
          this.createParameterObject(nameParamType.MagnitudeOfUnit, this.paramDataType.int, '6')
        ]);
    }
    else {
      parameters.push(...[
        this.createParameterObject(nameParamType.SupplierID, this.paramDataType.string, this.selectedSupplierId),
        this.createParameterObject(nameParamType.DurationUnit, this.paramDataType.int, this.selectedDuration),
        this.createParameterObject(nameParamType.MagnitudeOfUnit, this.paramDataType.int, this.selectedTSValue),
        this.createParameterObject(nameParamType.Part, this.paramDataType.string, this.selectedPartName),

        this.createParameterObject(nameParamType.fetchHistory, this.paramDataType.int,
          this.indicatorConfig.name == this.indicatorNameList.Demand_Supply_Forecast[3].name ? 0 : 1),

        this.createParameterObject(nameParamType.startDatePara, this.paramDataType.string,
          moment(this.selectedStartDate).format('MM-DD-YYYY')),

        this.createParameterObject(nameParamType.endDatePara, this.paramDataType.string,
          moment(this.selectedEndDate).format('MM-DD-YYYY'))
      ]);
    }

    if (this.indicatorConfig.dashboardName == DashboardNamesList.DemandSupplyForecast)
      parameters.push(
        this.createParameterObject(nameParamType.calculateAs, this.paramDataType.string, this.selectedView.value));

    this.chartService.getWidgetsData(this.indicatorConfig.id, parameters).then((wdgtsData: any) => {
      if (wdgtsData) {
        this.commonHelper.hideLoader();
        //wdgtsData = JSON.parse(JSON.parse(wdgtsData)[0].DataValue)
        this.indicatorData = JSON.parse(wdgtsData);
        this.cdRef.detectChanges();
        if (this.indicatorConfig.name == this.indicatorNameList.Supply_Chain_Supplier_Detail[0].name)
          this.dri = this.indicatorData[0].DAM;
        else if (this.indicatorConfig.name == this.indicatorNameList.Supply_Chain_Supplier_Detail[4].name) {
          this.transportRisk = this.indicatorData[0].Trns;
          this.weatherRisk = this.indicatorData[0].Clm;
          this.lifeRisk = this.indicatorData[0].Lif;
          this.moneyRisk = this.indicatorData[0].Prc;
          this.locationRisk = this.indicatorData[0].Loc;
          this.documentRisk = this.indicatorData[0].Gov;
          this.totalRisk = this.indicatorData[0].DAM;
        }



        this.chartService.indicatorData.next({
          indicatorId: this.indicatorConfig.id,
          indicatorData: this.indicatorData,
          dataView: this.header.selectedView.value
        });
        if (this.isQueryDataCalled) this.isQueryDataCalled = false;
      }
    },
      (error) => {
        this.commonHelper.hideLoader();
        this.commonHelper.getGeneralTranslateErrorMessage(error);
        if (this.isQueryDataCalled) this.isQueryDataCalled = false;
      }
    );
    // this.chartService.getQueryData(this.indicatorConfig.query, this.indicatorConfig.isQuerySp, parameters).then((queryData: any) => {
    //   if (queryData) {
    //     this.commonHelper.hideLoader();
    //     this.indicatorData = JSON.parse(queryData);
    //     this.cdRef.detectChanges();
    //     this.chartService.indicatorData.next({
    //       indicatorId: this.indicatorConfig.id,
    //       indicatorData: this.indicatorData,
    //       dataView: this.selectedView.value
    //     });
    //     if (this.isQueryDataCalled) this.isQueryDataCalled = false;
    //   }
    // },
    //   (error) => {
    //     this.commonHelper.hideLoader();
    //     this.commonHelper.getGeneralTranslateErrorMessage(error);
    //     if (this.isQueryDataCalled) this.isQueryDataCalled = false;
    //   }
    // );
  }

  changeFilter(filterName: string, filterValue: string) {
    let indicatorId = this.indicatorConfig.id;
    this.header.filters.find(f => f.filtername == filterName).selectedValue = filterValue;
    this.chartService.setFilterConfig({ filterName, filterValue, indicatorId });
  }

  onViewChange() {
    //this.selectedView = this.searchFilterForm.controls["selectedTimeSpan"].value;
    this.chartService.selectedView.next({ dashboardName: this.indicatorConfig.dashboardName, selectedView: this.selectedView });
    if (this.indicatorConfig.name == this.indicatorNameList.Risk_Trend[2].name && this.showTableBackBtn)
      this.getDrillDownRiskChartData(this.riskTrendSID, this.riskTrendIndex);
    else
      this.getQueryData();
  }

  onRiskFilterChange(filterName: string) {
    let indicatorId = this.indicatorConfig.id;
    let filterValue = this.selectedRiskFilter.value ? this.selectedRiskFilter.value : this.selectedRiskFilter.toString();
    this.header.filters.find(f => f.filtername == filterName).selectedValue = filterValue;
    this.chartService.setFilterConfig({ filterName, filterValue, indicatorId });
    //  console.log(this.selectedRiskFilter);
  }

  onRiskFactorChange(filterName: string) {
    this.header.title = this.riskFactorOptions.find((fac) => fac.value == this.selectedRiskFactor.value).caption;

    let indicatorId = this.indicatorConfig.id;
    let filterValue = this.selectedRiskFactor.value ? this.selectedRiskFactor.value : this.selectedRiskFactor.toString();
    this.header.filters.find(f => f.filtername == filterName).selectedValue = filterValue;
    this.chartService.setFilterConfig({ filterName, filterValue, indicatorId });
    //console.log(this.selectedRiskFilter);
    //this.header.title = this.selectedRiskFactor.label;
    this.setHeaderItems();
  }

  getSelectedOrderData() {
    this.chartService.selectedOrder.subscribe(
      (selectedOrder) => {
        this.selectedOrder = selectedOrder;
      }
    );
  }

  removeOrderSelection() {
    this.chartService.selectedOrder.next('');
    this.setHeaderItems();
  }

  removeSupplierSelection() {
    this.chartService.selectedSupplier_ForRiskTrend.next(0);
  }

  setHeaderItems() {

    let headerText = this.header.title;
    if (this.indicatorConfig.name == this.indicatorNameList.Risk_Trend[1].name) {
      headerText = "Time-Phased " + headerText + " Score";
    }
    let fixedText = headerText;
    let toggleText = '';

    if (this.indicatorConfig.dashboardName == DashboardNamesList.SupplyChainSupplierDetail) {
      if (this.indicatorConfig.name == 'OrdersInComingDay') {
        fixedText += ' ' + this.selectedTSValue + ' days';
      }
      else if (this.poParamaterList.includes(this.indicatorConfig.name) && this.selectedOrder) {
        toggleText += " <span class='activedata'>for PO# " + this.selectedOrder + "</span>";
      }

    }
    // fixedText += "</span>";
    this.headerElement = fixedText + toggleText;
  }

  getCardClass() {
    let headerClass = "";
    if (this.indicatorConfig.widgetSize.isInfoBox ? true : false)
      headerClass += "sDetailinfoBox";

    return headerClass;
  }

  enableTableBackBtn() {
    return this.chartService.showBackBtn.subscribe(
      (result: any) => {
        if (result != undefined) {
          this.showTableBackBtn = result.showTableBackBtn;
          if (this.indicatorConfig.dashboardName == DashboardNamesList.RiskTrend && this.indicatorConfig.name == this.indicatorNameList.Risk_Trend[2].name) {
            if (this.showTableBackBtn) {
              this.chart.visible = true;
              this.table.visible = false;
              this.header.title = result.Supplier;
              this.riskTrendSID = result.SupplierID;
              this.riskTrendIndex = result.riskIndex;
              this.selectedSuppliersForCompare = result.SelectedSuppliers;
              this.setHeaderItems();
              this.getDrillDownRiskChartData(this.riskTrendSID, this.riskTrendIndex);
            }
            else {
              this.header.title = '';
              this.setHeaderItems();
              this.chart.visible = false;
              this.table.visible = true;
              this.getQueryData();
            }
          }
        }
      }
    );
  }

  removeBackBtn() {
    if (this.indicatorConfig.dashboardName == DashboardNamesList.RiskTrend && this.indicatorConfig.name == this.indicatorNameList.Risk_Trend[2].name) {
      this.chartService.showBackBtn.next({
        showTableBackBtn: false,
        SelectedSuppliers: this.selectedSuppliersForCompare
      });
    }
    else {
      this.chartService.showBackBtn.next({
        showTableBackBtn: false
      });
    }
  }

  showTableCheckBox() {
    if (this.selectedSuppliersForCompareLength == 0) {
      this.showCheckBoxColumn = !this.showCheckBoxColumn;
      this.chartService.showCheckBoxCol.next(this.showCheckBoxColumn);
    }
  }

  getDrillDownRiskChartData(supplierId, riskIndex) {
    this.commonHelper.showLoader();


    let params = {
      timeSpan: this.SCfilterObj.timeSpan,
      BuyerId: this.SCfilterObj.BuyerId,
      SupplierId: supplierId,
      Commodity: this.SCfilterObj.Commodity,
      POLineNum: this.SCfilterObj.POLineNum,
      PN: this.SCfilterObj.PartNumber,
      calculateAs: this.header.selectedView.value
    };

    this.chartService.GetDrillDownRiskChartData(params).then((wdgtsData: any) => {
      if (wdgtsData) {
        this.commonHelper.hideLoader();
        this.indicatorData = wdgtsData;//JSON.parse(wdgtsData);
        this.cdRef.detectChanges();

        this.chartService.riskTrendData.next({
          indicatorId: this.indicatorConfig.id,
          indicatorData: this.indicatorData,
          dataView: this.header.selectedView.value,
          riskIndex: riskIndex
        });
      }
    },
      (error) => {
        this.commonHelper.hideLoader();
        this.commonHelper.getGeneralTranslateErrorMessage(error);
      }
    );
  }

  onSortClick() {
    this.isAscending = !this.isAscending;
    this.chartService.isAscending.next({
      indicatorId: this.indicatorConfig.id,
      isAscending: this.isAscending
    });
  }

  exportClick() {
    this.chartService.exportTableData.next({
      indicatorId: this.indicatorConfig.id,
      fileName: this.header.title
    });
  }
}
