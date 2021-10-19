import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import * as moment from 'moment';

import { SelectItem } from 'primeng/api';
import { CommonHelper } from '../../../common-helper';
import { FilterService } from '../filter.service';

@Component({
  selector: 'app-dashboard-filter',
  templateUrl: './dashboard-filter.component.html',
  styleUrls: ['./dashboard-filter.component.scss']
})
export class DashboardFilterComponent implements OnInit {

  selectedTimeSpan = 90;
  selectedBuyers = [];
  selectedSupplier = [];
  selectedCommodity = [];
  selectedPoLine = [];
  selectedPartNumber = [];

  toBeFilterData;
  timeSpanFilteredData;
  filterAppliedData;
  buyersList;
  commodityList;
  poLineList;
  partNumberList;
  supplierList;
  isAllFilterLoaded = {
    isBuyerLoaded: true,
    isSupplierLoaded: true,
    isCommodityLoaded: true,
    isPOLineLoaded: true,
    isPNLoaded: true
  };
  isBuyerChanged = false;
  isSupplierChanged = false;
  isCommodityChanged = false;
  isPOLineChanged = false;
  isPNChanged = false;

  timeSpans: SelectItem[] = [
    { label: '30 Days', value: 30 },
    { label: '60 Days', value: 60 },
    { label: '90 Days', value: 90 },
    { label: '6 Months', value: moment().diff(moment().subtract(6, 'months'), 'days') },
    { label: '12 Months', value: moment().diff(moment().subtract(12, 'months'), 'days') }
  ];

  filterName = {
    buyer: "buyer",
    supplier: "supplier",
    commodity: "commodity",
    POLine: "POLine",
    PN: "PN"
  }

  selectedFilter = [];

  @Output() filterEvent: EventEmitter<any> = new EventEmitter();

  constructor(
    private commonHelper: CommonHelper,
    private filterService: FilterService
  ) { }

  ngOnInit(): void {
    this.getSupplyChainFilterData();
  }

  getSupplyChainFilterData() {
    this.commonHelper.showLoader();
    this.filterService.getSupplyChainFilterData().then(
      (response) => {
        this.toBeFilterData = response;
        this.onTimeSpanChange();
        this.getPreservedFilterData();
        this.commonHelper.hideLoader();
      },
      (error) => {
        this.commonHelper.hideLoader();
        this.commonHelper.showToastrError(error.error.message)
      }
    );
  }

  sendFilterData() {
    let filterObj = {
      timeSpan: this.selectedTimeSpan,
      BuyerId: this.selectedBuyers ? this.selectedBuyers.map(b => b.id).join(',') : '',
      SupplierId: this.selectedSupplier ? this.selectedSupplier.map(s => s.id).join(',') : '',
      Commodity: this.selectedCommodity ? this.selectedCommodity.map(c => c.name).join(',') : '',
      POLineNum: this.selectedPoLine ? this.selectedPoLine.map(pl => pl.name).join(',') : '',
      PartNumber: this.selectedPartNumber ? this.selectedPartNumber.map(pn => pn.name).join(',') : ''
    }

    this.filterEvent.emit(filterObj);

    this.filterService.SCfilterObj.next({
      SCfilterObj: filterObj
    });
    this.preserveFilterData();
  }

  preserveFilterData() {
    localStorage.setItem('filterValues', JSON.stringify({
      timeSpan: this.selectedTimeSpan ? this.selectedTimeSpan : "",
      BuyerId: this.selectedBuyers ? this.selectedBuyers : "",
      SupplierId: this.selectedSupplier ? this.selectedSupplier : "",
      Commodity: this.selectedCommodity ? this.selectedCommodity : "",
      POLineNum: this.selectedPoLine ? this.selectedPoLine : "",
      PartNumber: this.selectedPartNumber ? this.selectedPartNumber : ""
    }));
  }

  resetFilters() {
    this.selectedTimeSpan = 90;
    this.selectedBuyers = [];
    this.selectedCommodity = [];
    this.selectedPartNumber = [];
    this.selectedPoLine = [];
    this.selectedSupplier = [];
    this.onTimeSpanChange();
    this.sendFilterData();
    localStorage.removeItem('filterValues');
    this.preserveFilterData();
  }

  getPreservedFilterData() {
    if (localStorage.getItem('filterValues')) {
      let preservedFilterObj = JSON.parse(localStorage.getItem('filterValues'));
      this.selectedTimeSpan = preservedFilterObj.timeSpan;
      this.selectedBuyers = preservedFilterObj.BuyerId;
      this.selectedCommodity = preservedFilterObj.Commodity;
      this.selectedPartNumber = preservedFilterObj.PartNumber;
      this.selectedPoLine = preservedFilterObj.POLineNum;
      this.selectedSupplier = preservedFilterObj.SupplierId;
      this.sendFilterData();
    }
    else {
      this.sendFilterData();
    }
  }

  onTimeSpanChange() {
    let startDate = moment().subtract(90, 'days').toDate();
    let endDate = moment().toDate();

    this.timeSpanFilteredData = this.toBeFilterData.filter(fd => moment(new Date(fd.orderDate)).isBetween(startDate, endDate));
    this.selectedFilter = [];
    this.updateFilteredData();
  }

  onCommodity_POLineChange() {
    if (this.isPOLineChanged || this.isCommodityChanged) {
      this.isCommodityChanged = false;
      this.isPOLineChanged = false;
      this.getSupplyChainPN();
    }
  }

  onBuyerChange() {
    if (this.isBuyerChanged) {
      this.isBuyerChanged = false;
      this.getSupplyChainSuppliers();
      this.getSupplyChainPN();
    }
  }

  onSupplierChange() {
    if (this.isSupplierChanged) {
      this.isSupplierChanged = false;
      this.getSupplyChainPN();
    }
  }
  onPNchanges() {
    if (this.isPNChanged) {
      this.isPNChanged = false;
    }
  }

  onFilterChange(filterName) {
    this.updateFilteredData(filterName);
  }

  getSupplyChainBuyers() {
    this.isAllFilterLoaded.isBuyerLoaded = false;
    this.buyersList = this.filterAppliedData.filter((x, i, a) => a.findIndex(a => a.buyerID == x.buyerID && a.buyer == x.buyer) == i).
      map(b => ({ id: b.buyerID, name: b.buyer })).sort((a, b) => a.id - b.id);
    this.isAllFilterLoaded.isBuyerLoaded = true;
  }

  getSupplyChainSuppliers() {
    this.isAllFilterLoaded.isSupplierLoaded = false;
    this.supplierList = this.filterAppliedData.filter((x, i, a) => a.findIndex(a => a.supplierID == x.supplierID && a.supplier == x.supplier) == i).
      map(b => ({ id: b.supplierID, name: b.supplier })).sort((a, b) => a.id - b.id);
    this.isAllFilterLoaded.isSupplierLoaded = true;
  }

  getSupplyChainCommodity() {
    this.isAllFilterLoaded.isCommodityLoaded = false;
    this.commodityList = this.filterAppliedData.filter((x, i, a) => a.findIndex(a => a.commodity == x.commodity) == i).
      map((b, j) => ({ id: +b.commodity, name: b.commodity })).sort((a, b) => a.id - b.id);

    this.isAllFilterLoaded.isCommodityLoaded = true;
  }

  getSupplyChainPOLine() {
    this.isAllFilterLoaded.isPOLineLoaded = false;
    this.poLineList = this.filterAppliedData.filter((x, i, a) => a.findIndex(a => a.poLineNum == x.poLineNum) == i).
      map((b, j) => ({ id: +b.poLineNum, name: b.poLineNum })).sort((a, b) => a.id - b.id);

    this.isAllFilterLoaded.isPOLineLoaded = true;
  }

  getSupplyChainPN() {
    this.isAllFilterLoaded.isPNLoaded = false;
    this.partNumberList = this.filterAppliedData.filter((x, i, a) => a.findIndex(a => a.pn == x.pn) == i).
      map((b, j) => ({ id: j + 1, name: b.pn })).sort((a, b) => a.id - b.id);

    this.isAllFilterLoaded.isPNLoaded = true;
  }

  getStringParamFromArray(selectedInput: [], valueIdentifier) {
    let selectedArr = [];
    if (selectedInput) {
      selectedInput.forEach((element: any) => {
        switch (valueIdentifier) {
          case 'id':
            selectedArr.push(element.id);
            break;
          case 'name':
            selectedArr.push(element.name);
            break;
        }
      });
    }
    return selectedArr.join(',');
  }

  updateFilteredData(filterName = 'All') {
    this.filterAppliedData = this.timeSpanFilteredData;

    if (this.getFilterSelectionCount(filterName) > 0)
      this.addSelectedFilterName(filterName);
    else
      this.removeSelectedFilterName(filterName);

    this.selectedFilter.forEach((fName) => {
      this.filterAsPerSelection(fName);
    });

    if (this.selectedBuyers.length == 0)
      this.getSupplyChainBuyers();

    if (this.selectedSupplier.length == 0)
      this.getSupplyChainSuppliers();

    if (this.selectedCommodity.length == 0)
      this.getSupplyChainCommodity();

    if (this.selectedPoLine.length == 0)
      this.getSupplyChainPOLine();

    if (this.selectedPartNumber.length == 0)
      this.getSupplyChainPN();
  }

  filterAsPerSelection(filterName) {
    let filterData = [];
    let selectedFilterData;
    let findForColumn = '';
    let findInColumn = '';
    switch (filterName) {
      case this.filterName.buyer:
        findForColumn = 'buyerID';
        findInColumn = "id";
        selectedFilterData = this.selectedBuyers;
        break;
      case this.filterName.supplier:
        findForColumn = 'supplierID';
        findInColumn = "id";
        selectedFilterData = this.selectedSupplier;
        break;
      case this.filterName.commodity:
        findForColumn = 'commodity';
        findInColumn = "name";
        selectedFilterData = this.selectedCommodity;
        break;
      case this.filterName.POLine:
        findForColumn = 'poLineNum';
        findInColumn = "name";
        selectedFilterData = this.selectedPoLine;
        break;
      case this.filterName.PN:
        findForColumn = 'pn';
        findInColumn = "name";
        selectedFilterData = this.selectedPartNumber;
        break;
    }

    filterData = this.filterAppliedData.filter(fd => selectedFilterData.map(b => b[findInColumn]).includes(fd[findForColumn]));
    if (filterData.length > 0)
      this.filterAppliedData = filterData;
    else
    {
      selectedFilterData.splice(0,selectedFilterData.length);
      this.removeSelectedFilterName(filterName);
    }
      
  }

  getFilterSelectionCount(filterName) {
    let count = 0;
    switch (filterName) {
      case this.filterName.buyer:
        count = this.selectedBuyers.length;
        break;
      case this.filterName.supplier:
        count = this.selectedSupplier.length;
        break;
      case this.filterName.commodity:
        count = this.selectedCommodity.length;
        break;
      case this.filterName.POLine:
        count = this.selectedPoLine.length;
        break;
      case this.filterName.PN:
        count = this.selectedPartNumber.length;
        break;
    }
    return count;
  }

  addSelectedFilterName(filterName) {
    let eleIndex = this.selectedFilter.findIndex(s => s == filterName);
    if (eleIndex < 0)
      this.selectedFilter.push(filterName);
  }

  removeSelectedFilterName(filterName) {
    let eleIndex = this.selectedFilter.findIndex(s => s == filterName);
    if (eleIndex > -1)
      this.selectedFilter.splice(eleIndex, 1);
  }

}
