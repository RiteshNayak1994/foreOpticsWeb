import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { DaterangepickerConfig, DaterangepickerComponent } from 'ng2-daterangepicker';
import { CommonHelper } from '../../../@core/common-helper';
import { DashboardService } from '../../../@core/sharedServices/dashboard.service';
import { inventoryWidget, inventoryWidget_1 } from './inventoryWidgetData';


@Component({
  selector: 'app-forecast-dashboard',
  templateUrl: './forecast-dashboard.component.html',
  styleUrls: ['./forecast-dashboard.component.scss']
})
export class ForecastDashboardComponent implements OnInit {

  searchFilterForm: FormGroup;
  partsList: any[] = [];

  dashboardName: string = 'forecast';

  maxDate: Date = new Date();

  indicatorList: any[];
  supplierList: any[] = [];
  selectedSupplierId = null;
  isAllPartsSelected = true;
  isAllSuplierssSelected = true;
  selectedparts = null;
  selectedBuyerId = 0;
  selectedTSValue = 3;
  selectedDuration = 'month';
  selectedPartId = 0;
  daterange: any = {
    start: moment().subtract(59, 'days'),
    end: moment().add(29, 'days')
  };

  public options: any = {
    locale: { format: 'MM-DD-YYYY' },
    alwaysShowCalendars: false,
  };
  @ViewChild(DaterangepickerComponent) private picker: DaterangepickerComponent;

  constructor(
    private formBuilder: FormBuilder,
    private _dashboardService: DashboardService,
    private commonHelper: CommonHelper,
    private daterangepickerOptions: DaterangepickerConfig
  ) {
    this.daterangepickerOptions.settings = {
      locale: { format: 'MM-DD-YYYY' },
      alwaysShowCalendars: false,
      ranges: {
        '30 Days': [moment().subtract(59, 'days'), moment().add(29, 'days')],
        '60 Days': [moment().subtract(119, 'days'), moment().add(59, 'days')],
        '90 Days': [moment().subtract(179, 'days'), moment().add(89, 'days')]
      }
    };
  }

  ngOnInit(): void {
    this.searchFilterForm = this.createFilterForm();
    this.getIndicatorList();
    this.getSupplierList();
    this.getPartList();
  }

  ngAfterViewInit() {
    this.picker.datePicker.setStartDate(this.daterange.start);
    this.picker.datePicker.setEndDate(this.daterange.end);
  }

  public selectedDate(value: any, datepicker?: any) {
    // this is the date  selected
    //console.log("From:" + value.start._d + "   To:" + value.end._d);

    // any object can be passed to the selected event and it will be passed back here
    datepicker.start = value.start;
    datepicker.end = value.end;

    // use passed valuable to update state
    this.daterange.start = value.start;
    // this.startDate = value.start;
    this.daterange.end = value.end;
    // this.endDate = value.end;
    this.daterange.label = value.label;

    this._dashboardService.selectedDates.next({
      dashBoardName: this.dashboardName,
      startDateTime: this.daterange.start,
      endDateTime: this.daterange.end
    });
  }

  createFilterForm() {
    return this.formBuilder.group({
      selectedPart: [''],
      selectedTimeSpan: [''],
      selectedViewType: ['forecast'],
      selectedSupplier: [''],
    });
  }

  getSupplierList() {
    this.commonHelper.showLoader();
    this.supplierList = [];
    this.supplierList.push({ id: 0, name: 'All Suppliers' });
    let days = 0;
    if (this.selectedDuration == 'month')
      days = 30 * this.selectedTSValue;
    // Get Member services
    let startDate = moment(this.daterange.start).format('MM-DD-YYYY');
    let endDate = moment(this.daterange.end).format('MM-DD-YYYY');
    this._dashboardService.getSuppliers(0, this.selectedparts, startDate, endDate).then(
      (response: any[]) => {
        this.commonHelper.hideLoader();
        this.supplierList = [...this.supplierList, ...response]
        this.searchFilterForm.controls["selectedSupplier"].setValue([...[{ id: 0, name: 'All Suppliers' }]]);
      },

      (error: any) => {
        this.commonHelper.hideLoader();
        this.commonHelper.getGeneralTranslateErrorMessage(error);
      });
  }

  getPartList() {
    let startDate = moment(this.daterange.start).format('MM-DD-YYYY');
    let endDate = moment(this.daterange.end).format('MM-DD-YYYY');

    this.partsList = [];
    this.partsList.push({ id: 0, partName: 'All Parts' });

    this._dashboardService.getFOPartList(0, this.selectedSupplierId, this.dashboardName, 0, startDate, endDate).then((parts: any[]) => {
      if (parts.length > 0) {
        this.commonHelper.hideLoader();
        this.partsList = [...this.partsList, ...parts]
        this.searchFilterForm.controls["selectedPart"].setValue([...[{ id: 0, partName: 'All Parts' }]]);
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
    this.dashboardName = 'Demand_Supply_Forecast';

    if (this.searchFilterForm.controls["selectedViewType"].value == "gap") {
      this.dashboardName = 'Demand_Supply_Gap';
    }
    else if (this.searchFilterForm.controls["selectedViewType"].value == "SupplyRiskAssessment") {
      this.dashboardName = 'Supply_Risk_Assessment';
    }

    this.indicatorList = [];
    this._dashboardService.getFOWidgetsList(this.dashboardName).then((wdgts) => {
      if (wdgts) {
        
        this.indicatorList = JSON.parse(JSON.stringify(wdgts));
        this.indicatorList.forEach((iL) => {
          iL.widgetBody = JSON.parse(iL.widgetBody);
          iL.widgetHeader = JSON.parse(iL.widgetHeader);
          iL.widgetSize = JSON.parse(iL.widgetSize);
        });
        if (this.dashboardName == 'Demand_Supply_Gap') {
          this.indicatorList.push(inventoryWidget);
          this.indicatorList.push(inventoryWidget_1);
        }
        this.commonHelper.hideLoader();
      }
    },
      (error) => {
        this.commonHelper.hideLoader();
        this.commonHelper.getGeneralTranslateErrorMessage(error);
      }
    );
  }

  onTimeSpanChange() {
    let dateValue = this.searchFilterForm.controls["selectedTimeSpan"].value;
    this.selectedTSValue = this.monthDiff(dateValue, new Date());

    this._dashboardService.selectedTimeSpan.next({
      dashBoardName: this.dashboardName,
      timeSpanValue: this.selectedTSValue
    });
  }

  monthDiff(dateFrom, dateTo) {
    return dateTo.getMonth() - dateFrom.getMonth() +
      (12 * (dateTo.getFullYear() - dateFrom.getFullYear()))
  }

  onPartChange() {

    if (this.isAllPartsSelected)
    {
      this.searchFilterForm.controls["selectedPart"].setValue(this.searchFilterForm.controls["selectedPart"].value.filter(s => s.partName != "All Parts"));
      this.isAllPartsSelected = !this.isAllPartsSelected;
    }
    else {
      let allParts = this.searchFilterForm.controls["selectedPart"].value.filter(s => s.partName == "All Parts");
      if (allParts && allParts.length > 0)
      {
        this.searchFilterForm.controls["selectedPart"].setValue([...allParts]);
        this.isAllPartsSelected = !this.isAllPartsSelected;
      }
    }

    let tmpPartName = this.searchFilterForm.controls["selectedPart"].value.map(function (e) {
      return e.partName;
    }).join(',');
    
    tmpPartName = tmpPartName.includes("All Parts") ? undefined : tmpPartName;//== "" tmpPartName.replace("All Parts","");
    this.selectedparts = tmpPartName || null;

    this._dashboardService.selectedPartName.next({
      dashBoardName: this.dashboardName,
      partName: this.selectedparts
    });
    this.getSupplierList();
  }

  onSuppliierChange() {
    if (this.isAllSuplierssSelected)
    {
      this.searchFilterForm.controls["selectedSupplier"].setValue(this.searchFilterForm.controls["selectedSupplier"].value.filter(s => s.id != 0));
      this.isAllSuplierssSelected = !this.isAllSuplierssSelected;
    }
    else {
      let allSuppliers = this.searchFilterForm.controls["selectedSupplier"].value.filter(s => s.id == 0);
      if (allSuppliers && allSuppliers.length > 0)
      {
        this.searchFilterForm.controls["selectedSupplier"].setValue([...allSuppliers]);
        this.isAllSuplierssSelected = !this.isAllSuplierssSelected;
      }
    }

    this.selectedSupplierId = this.searchFilterForm.controls["selectedSupplier"].value.map(function (e) {
      return e.id;
    }).join(',');

    // this.selectedSupplierId = this.selectedSupplierId.includes("0") ? "" : tmpPartName;//== "" tmpPartName.replace("All Parts","");
    // this.selectedparts = tmpPartName || null;

    this.selectedSupplierId = this.selectedSupplierId.includes('0') ? undefined : this.selectedSupplierId;
    this.selectedSupplierId = this.selectedSupplierId || null;

    this._dashboardService.selectedSupplierId.next({
      dashBoardName: this.dashboardName,
      suppierId: this.selectedSupplierId
    });
    this.getPartList();
  }

}
