import { Component, OnInit, Input, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { ChartService } from '../chart.service';
import { colors, DashboardNamesList, IndicatorNameList, RiskDisplayNameList } from '../chartConstants';
import * as moment from 'moment';
import { inventoryTableData } from './inventoryDataTable';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { drillDownTable } from './drillDownTableData';
import { FilterService } from '../../filters/filter.service';
import { ShortNumberPipe } from '../../../pipes/short-number/short-number.pipe';
import { DateFormatPipe } from '../../../pipes/date-format-pipe/date-format-pipe';
import { CommonHelper } from '../../../common-helper';
@Component({
  selector: 'app-chart-table',
  templateUrl: './chart-table.component.html',
  styleUrls: ['./chart-table.component.scss']
})
export class ChartTableComponent implements OnInit, OnDestroy {

  cols: any[];
  headCols: any[];
  tableData: any[];
  mathInstance = Math;

  @Input() isChartComboTable: boolean = false;
  @Input() indId: number;
  @Input() tableConfig: any;
  @Input() dashboardName: string = '';
  @Input() indicatorName: string = '';
  @Input() displayOrder: number;
  @Input() SCfilterObj;

  selectedDataView = "Monthly";
  subScriptionList: Subscription = new Subscription();
  selectedId: any;

  shortNumberPipe = new ShortNumberPipe();
  dateFormatPipe = new DateFormatPipe();
  mnTablApiData;
  showTableBackBtn = false;
  showRiskFactorTable = true;
  selectedSuppliers: any;
  selectedSuppliersID = [];
  riskName = RiskDisplayNameList;
  dashboardNamesList = DashboardNamesList;
  indicatorNameList = IndicatorNameList;

  constructor(
    private chartService: ChartService,
    private _router: Router,
    private commonHelper: CommonHelper,
    private filterService: FilterService
  ) { }

  ngOnInit(): void {
    this.getTableData();
    this.cols = this.tableConfig.displayCol;

    let subscription;
    subscription = this.chartService.selectedOrder.subscribe((selOrder: any) => {
      if (this.commonHelper.isNullBlankUndefined(selOrder)) {
        this.selectedId = undefined;
      }
      else {
        let orderRec = this.tableData.find(t => t['PO'] == selOrder);
        this.selectedId = orderRec ? orderRec['id'] : undefined;
      }
    }
    );
    this.subScriptionList.add(subscription);

    subscription = this.chartService.selectedSupplier_ForRiskTrend.subscribe(
      (resetSelSupplier: number) => {
        if (resetSelSupplier == 0) {
          this.selectedSuppliers = resetSelSupplier;
          this.chartService.selectedSupplierIDs.next({
            selectedSuppliersID: []
          });
        }
      }
    );

    subscription = this.filterService.SCfilterObj.subscribe((tObj: any) => {
      this.SCfilterObj = tObj.SCfilterObj;
    });
    this.subScriptionList.add(subscription);

    subscription = this.chartService.showBackBtn.subscribe((result: any) => {
      if (result.showTableBackBtn == false && this.displayOrder == 4 && this.dashboardName == DashboardNamesList.RiskProfile) {
        this.showTableBackBtn = false;
        this.tableData = [];
        this.cols = [];
        this.cols = this.tableConfig.displayCol;
        this.tableData = this.mnTablApiData;
      }
      if (result.showTableBackBtn == false && this.displayOrder == 3 && this.dashboardName == DashboardNamesList.RiskTrend) {
        this.selectedSuppliers = result.SelectedSuppliers
      }
    });
    this.subScriptionList.add(subscription);

    subscription = this.chartService.showCheckBoxCol.subscribe((result: boolean) => {
      let itemToBeUpdated = this.cols.find(col => col['data'] == 'SupplierID');
      if (itemToBeUpdated) {
        result ? (itemToBeUpdated.visibility = "visible") : (itemToBeUpdated.visibility = "hidden")
      }
    });
    this.subScriptionList.add(subscription);

    subscription = this.chartService.exportTableData.subscribe((iData: any) => {
      if (iData.indicatorId == this.indId) {
        this.exportExcel(iData.fileName);
      }
    });
    this.subScriptionList.add(subscription);

  }

  // method for getting list of selected suppliers to compare from table
  selectSupplierCheckboxClick(event, rowData) {
    if (this.selectedSuppliers.length <= 5) {
      this.chartService.selectedSupplierIDs.next({
        selectedSuppliersID: this.selectedSuppliers.map(s => s.SupplierID)
      });
    }
    else {
      this.selectedSuppliers.splice(this.selectedSuppliers.findIndex(ele => ele.SupplierID == rowData.SupplierID), 1);
      event.checked = false;
      this.commonHelper.showToastrWarning('Maximum 5 Suppliers can be compared at a time!')
      return false;
    }
    this.chartService.selectedSupplier_ForRiskTrend.next(this.selectedSuppliers.length);
  }

  // method to open external risk trend chart
  loadRiskTrend(rowData, riskIndex) {
    // this.chartService.showBackBtn.next({
    //   showTableBackBtn: true,
    //   Supplier: rowData.Supplier,
    //   SupplierID: rowData.SupplierID,
    //   riskIndex: riskIndex,
    //   SelectedSuppliers: this.selectedSuppliers
    // });
  }

  rowClick(rowData) {
    if (this.dashboardName == DashboardNamesList.RiskProfile) {
      if (this.displayOrder == 4 && !this.showTableBackBtn) {
        this.tableData = [];
        this.cols = [];
        this.cols = drillDownTable.displayCol;
        this.commonHelper.showLoader();
        this.chartService.GetSupplyChainPOLineAtRisk(this.SCfilterObj.timeSpan, rowData.PO).then((tableData: any) => {
          if (tableData) {
            this.tableData = tableData;
            this.commonHelper.hideLoader();
            this.showTableBackBtn = true;
            this.chartService.showBackBtn.next({ showTableBackBtn: this.showTableBackBtn });
          }
        },
          (error) => {
            this.commonHelper.hideLoader();
            this.commonHelper.getGeneralTranslateErrorMessage(error);
          }
        );
      }
      else if (this.displayOrder == 3)
      {
        let dataToSend = {
          SupplierId: rowData.SupplierID,
          SupplierName: rowData.SupplierName
        };
        this._router.navigate(['dashboard/supplierDetail/' + rowData.SupplierID], { state: dataToSend });
      }

    }

    //this.tableData = drillDownTable.data;
  }

  ngOnDestroy() {
    this.subScriptionList.unsubscribe();
  }

  handleOrderClick(id) {
    let orderNumber = this.tableData.find(t => t['id'] == id)['PO'];

    this.chartService.selectedOrder.next(orderNumber);
  }

  rowGroupMetadata: any;
  updateRowGroupMetaData() {
    this.rowGroupMetadata = {};
    if (this.tableData) {
      for (let i = 0; i < this.tableData.length; i++) {
        let rowData = this.tableData[i];
        let groupName = rowData.groupName;
        if (i == 0) {
          this.rowGroupMetadata[groupName] = { index: 0, size: 1 };
        }
        else {
          let previousRowData = this.tableData[i - 1];
          let previousRowGroup = previousRowData.groupName;
          if (groupName === previousRowGroup)
            this.rowGroupMetadata[groupName].size++;
          else
            this.rowGroupMetadata[groupName] = { index: i, size: 1 };
        }
      }
    }

  }

  getTableData() {
    if (!this.dashboardName.includes("Supply_Chain") && (this.indId == 150 || this.indId == 160)) {
      this.tableData = inventoryTableData;
      return;
    }
    if (this.dashboardName == this.dashboardNamesList.RiskForecast && this.indId == 555) {
      this.tableData = this.tableConfig.data;
      this.updateRowGroupMetaData();
      return;
    }
    // if (this.dashboardName == 'Risk_Trend') {
    //   this.tableData = this.tableConfig.data;
    //   return;
    // }
    // if (this.dashboardName == 'Supply_Chain_Supplier_Detail') {
    //   this.tableData = this.tableConfig.data;
    //   this.chartService.selectedOrder.subscribe(
    //     (selectedOrder) => {
    //       this.selectedOrder = selectedOrder;
    //     }
    //   );
    //   return;
    // }
    let subscription;
    subscription = this.chartService.indicatorData.subscribe((iData: any) => {
      if (iData.indicatorId == this.indId) {
        this.mnTablApiData = iData.indicatorData;
        this.selectedDataView = iData.dataView || this.selectedDataView;
        if (this.dashboardName == DashboardNamesList.DemandSupplyForecast) {
          if (this.displayOrder >= 3)
            this.prepareDynamicDemandSupplyTrendData(iData.indicatorData);
          else
            this.prepareDynamicDemandSupplyData(iData.indicatorData);
        }
        if (this.dashboardName == DashboardNamesList.RiskProfile) {
          // condition for dam variance table
          if (this.displayOrder == 3) {
            this.tableData = iData.indicatorData.filter((td, i) => td["DamVariance"] != 0).
              sort((a, b) => (Math.abs(a["DamVariance"]) <= Math.abs(b["DamVariance"]) ? 1 : -1));
          }
          else {
            this.tableData = iData.indicatorData;
          }

          if (this.displayOrder == 4)
            this.chartService.showBackBtn.next({ showTableBackBtn: false });
        }
        else {

          if (this.dashboardName == DashboardNamesList.RiskTrend)
            iData.indicatorData.forEach(i => i["ExternalRisk"] = JSON.parse(i["ExternalRisk"]));

          this.tableData = iData.indicatorData;
          this.tableData.forEach((td, i) => td["color"] = colors[i]);
        }
      }
    });
    this.subScriptionList.add(subscription);

    subscription = this.chartService.filterConfig.subscribe((iData: any) => {
      if (iData.indicatorId == this.indId) {
        if (iData.filterName == "quantitycost") {
          this.cols.find(c => c.data == iData.filterName.replace(iData.filterValue, '')).visibility = "hidden";
          this.cols.find(c => c.data == iData.filterValue).visibility = "visible";
        }
      }
    });
    this.subScriptionList.add(subscription);
  }

  prepareDynamicDemandSupplyData(indicatorData: any) {
    let tableData = [];
    let cols = [{
      "data": "parts",
      "title": "Parts",
      "headerAlign": "left",
      "dataAlign": "left",
      "dataType": "string",
      "className": "classParts",
      "sort": false,
      "visibility": "visible"
    }];
    let uniqueParts = indicatorData.map(im => im['PN']).filter((v, i, s) => s.indexOf(v) == i);
    let uniqueDates = indicatorData.map(im => im['DSDate']).filter((v, i, s) => s.indexOf(v) == i).sort();

    indicatorData.forEach(id => {
      id['DSDate'] = moment(id['DSDate']).format('MMMYYYY')
    });
    uniqueDates = uniqueDates.map(ud => ({
      "data": moment(new Date(ud)).format('MMMYYYY'),
      "title": moment(new Date(ud)).format('MMM YYYY'),
      "headerAlign": "left",
      "dataAlign": "left",
      "dataType": "int",
      "className": "classDates",
      "sort": false,
      "visibility": "visible"
    }));

    uniqueParts.forEach(part => {
      let partData = indicatorData.filter(im => im['PN'] == part);
      let partObj = { 'parts': part };
      uniqueDates.forEach(dts => {
        let dateObj = partData.find(pd => pd["DSDate"] == dts.data);
        partObj[dts.data] = dateObj ? dateObj["Qty"] : 0;
      });
      tableData.push(partObj);
    });
    cols.push(...uniqueDates);
    this.cols = cols;
    this.tableData = tableData;
  }

  prepareDynamicDemandSupplyTrendData(indicatorData: any) {
    let tableData = [];

    let partcol = {
      "data": "parts",
      "title": "Parts",
      "headerAlign": "left",
      "dataAlign": "left",
      "dataType": "string",
      "className": "classParts",
      "sort": false,
      "visibility": "visible",
      "rowspan": 2,
      "colspan": 1,
    }

    let headcols = [partcol];
    let cols = [JSON.parse(JSON.stringify(partcol))];
    cols[0].showInHeader = false;
    cols[0].rowspan = 1;

    let uniqueParts = indicatorData.map(im => im['PN']).filter((v, i, s) => s.indexOf(v) == i);
    let uniqueDates = indicatorData.map(im => im['DSDate']).filter((v, i, s) => s.indexOf(v) == i).sort();

    indicatorData.forEach(id => {
      id['DSDate'] = this.getDateColumn(id['DSDate']);//moment(id['DSDate']).format('MMMYYYY')
    });

    uniqueDates = uniqueDates.map(ud => ({
      "data": this.getDateColumn(new Date(ud)),
      "title": this.getDateTitle(new Date(ud)),
      "headerAlign": "left",
      "dataAlign": "left",
      "dataType": "int",
      "className": "classDatesTrend",
      "sort": false,
      "visibility": "visible",
      "rowspan": 1,
      "colspan": 3,
    }));

    let uniqueDatesDemandSupply = [];
    uniqueDates.forEach(ud => {
      uniqueDatesDemandSupply.push(...[{
        "data": ud.data + "Demand",
        "title": "Demand",
        "headerAlign": "left",
        "dataAlign": "left",
        "dataType": "int",
        "className": "classDemandTrend",
        "sort": false,
        "visibility": "visible",
        "rowspan": 1,
        "colspan": 1,
      }, {
        "data": ud.data + "Supply",
        "title": "Supply",
        "headerAlign": "left",
        "dataAlign": "left",
        "dataType": "int",
        "className": "classSupplyTrend",
        "sort": false,
        "visibility": "visible",
        "rowspan": 1,
        "colspan": 1,
      },
      {
        "data": ud.data + "Gap",
        "title": "GAP",
        "headerAlign": "left",
        "dataAlign": "left",
        "dataType": "int",
        "className": "classGap",
        "sort": false,
        "visibility": "visible",
        "rowspan": 1,
        "colspan": 1,
        "bgColorColumn": ud.data + "GapColor"
      }])
    });

    uniqueParts.forEach(part => {
      let partData = indicatorData.filter(im => im['PN'] == part);
      let partObj = { 'parts': part };
      uniqueDates.forEach(dts => {
        let dateObj = partData.find(pd => pd["DSDate"] == dts.data);
        partObj[dts.data + 'Demand'] = dateObj && dateObj["DemandQty"] ? dateObj["DemandQty"] : 0;
        partObj[dts.data + 'Supply'] = dateObj && dateObj["SupplyQty"] ? dateObj["SupplyQty"] : 0;
        partObj[dts.data + 'Gap'] = dateObj && dateObj["Gap"] ? dateObj["Gap"] : 0;
        partObj[dts.data + 'GapColor'] = dateObj && dateObj["GapColor"] ? dateObj["GapColor"] + "Text" : "";
      });
      tableData.push(partObj);
    });
    headcols.push(...uniqueDates);
    this.headCols = headcols;

    cols.push(...uniqueDatesDemandSupply);
    this.cols = cols;

    this.tableData = tableData;
  }

  getDateColumn(date) {
    let formattedDateCol = "";
    if (this.selectedDataView == "Monthly")
      formattedDateCol = moment(date).format('MMMYYYY');
    else if (this.selectedDataView == "Weekly")
      formattedDateCol = moment(date).format('DDMMM') + moment(date).add(6, 'days').format('DDMMM');
    else if (this.selectedDataView == "Daily")
      formattedDateCol = moment(date).format('DDMMM');

    return formattedDateCol;
  }

  getDateTitle(date) {
    let formattedDateValue = "";
    if (this.selectedDataView == "Monthly")
      formattedDateValue = moment(date).format('MMM YYYY');
    else if (this.selectedDataView == "Weekly")
      formattedDateValue = moment(date).format('DD MMM') + ' - ' + moment(date).add(6, 'days').format('DD MMM');
    else if (this.selectedDataView == "Daily")
      formattedDateValue = moment(date).format('DD MMM');

    return formattedDateValue;
  }

  onCellClick(colData, rowData) {
    if (colData.data.includes('Gap') && this.dashboardName == DashboardNamesList.DemandSupplyForecast)
      this.onGapClick(rowData['parts'], colData.data);
    else if (colData.data.includes('SupplierName') && this.dashboardName == 'Supply_Chain_Supplier')
      this.onSupplierClick(rowData['SupplierId'], rowData['SupplierName']);

  }

  onGapClick(part, GapColName) {
    if (part == "Total") return false;

    let myShort = GapColName.replace("Gap", "");
    let MonthYear = this.headCols.find(hc => hc["data"] == myShort)["title"];
    let partRow = this.tableData.find(td => td["parts"] == part);
    let dataToSend = {
      part: part,
      demand: partRow[myShort + "Demand"],
      supply: partRow[myShort + "Supply"],
      gap: partRow[myShort + "Gap"],
      monthYear: MonthYear
    };
    if (partRow[myShort + "Gap"] > 0) {
      this._router.navigate(['/gapAnalysis/positive/' + part], { state: dataToSend });
    }
    if (partRow[myShort + "Gap"] < 0) {
      this._router.navigate(['/gapAnalysis/negative/' + part], { state: dataToSend });
    }
  }

  onSupplierClick(SupplierId, SupplierName) {

    let dataToSend = {
      SupplierId: SupplierId,
      SupplierName: SupplierName
    };
    this._router.navigate(['/supplierDetail/' + SupplierId], { state: dataToSend });
  }

  getCellClassName(colName, rowData, bgColorColumn) {
    let className = null;
    if ((colName == 'DAM' || colName.includes('Gap')) && bgColorColumn)
      className = rowData[bgColorColumn] + ' cellContentBold';
    return className;
  }

  getCellTooltip(colName, rowData) {
    let toolTip = '';
    if (colName.includes('Gap') && this.dashboardName == DashboardNamesList.DemandSupplyForecast)
      toolTip = 'click for analysis';
    return toolTip;
  }

  getCellDisplayText(col, rowData) {
    let displayText = '';
    if (['int', 'decimal'].includes(col.dataType))
      displayText = this.shortNumberPipe.transform(rowData[col.data]);
    else if (col.data == 'MonthYear' || col.data == 'Date') {
      if (this.dashboardName == DashboardNamesList.DemandSupplyGap)
        displayText = this.dateFormatPipe.transform(rowData[col.data], 'MMM-YY');
      else
        displayText = this.dateFormatPipe.transform(rowData[col.data]);
    }
    else
      displayText = rowData[col.data];

    return displayText;
  }

  exportExcel(fileName) {
    let visibleCol = this.cols.map(c => c.data);
    let tableData = this.tableData.map(function (item) {
      delete item.SupplierID;
      return item;
    });
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(tableData);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, fileName);
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    import("file-saver").then(FileSaver => {
      let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      let EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
      });
      FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    });
  }
}
