import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractChart } from '../abstract-chart';

import * as Highcharts from 'highcharts';
import { colors, IndicatorsAs, themes } from '../../chartConstants';
import { Subscription } from 'rxjs';
import { ShortNumberPipe } from '../../../../pipes/short-number/short-number.pipe';
import { ChartService } from '../../chart.service';
import * as moment from 'moment';
import highchartmore from 'highcharts/highcharts-more';
import { ThemeService } from '../../../../sharedServices/theme.service';
highchartmore(Highcharts);

@Component({
  selector: 'app-spline-chart',
  templateUrl: './spline-chart.component.html',
  styleUrls: ['./spline-chart.component.scss']
})
export class SplineChartComponent extends AbstractChart implements OnInit, OnDestroy {
  data;
  dataMin;
  dataMax;
  subScriptionList: Subscription = new Subscription();
  shortNumberPipe = new ShortNumberPipe();
  selectedDataView = "Monthly";
  selectedSuppliers = [];
  colDisplayName =
    {
      "Res": "Responsiveness",
      "Agl": "Agility",
      "Rel": "Reliability",
      "ES": "Exposure Score",
      "FS": "Feature Score",
      "QS": "Quality Score",
      "loc": "Location Risk",
      "gov": "Government Risk",
      "clm": "Climate Risk",
      "logi": "Logistic Risk",
      "trnd": "Trend Risk",
      "geo": "Geo Risk",
      "prc": "Pricing Risk",
      "bus": "Business Risk",
      "trns": "Transport Risk",
      "lif": "Lifing Risk"
    }

  riskArray = ["loc", "gov", "clm", "logi", "trnd", "geo", "prc", "bus", "trns", "lif"];
  stDvList = [];
  avgList = [];
  yValueArray = [];
  isAscending = true;

  constructor(
    private chartService: ChartService,
    private themeService: ThemeService
    ) {
    super();
  }

  ngOnInit(): void {
    let subscription;
    subscription = this.chartService.indicatorData.subscribe((iData: any) => {
      if (iData.indicatorId == this.indId) {
        this.selectedDataView = iData.dataView || this.selectedDataView;
        this.apiData = iData.indicatorData;
        this.data = this.prepareDataFromIndicatorData(this.apiData);
        if (this.chart) {
          if (this.chart.series && this.chart.series.length > 0)
            this.removeSeries();

          if (this.data.seriesData.length > 0)
            this.addSeries(this.chart);

        }
      }

    });
    this.subScriptionList.add(subscription);

    subscription = this.chartService.riskTrendData.subscribe((iData: any) => {
      if (iData.indicatorId == this.indId) {
        this.yAxisCol = this.riskArray[iData.riskIndex];
        this.selectedDataView = iData.dataView || this.selectedDataView;
        this.apiData = iData.indicatorData;
        this.data = this.prepareDataFromIndicatorData(this.apiData);
        if (this.chart) {
          if (this.chart.series && this.chart.series.length > 0)
            this.removeSeries();

          if (this.data.seriesData.length > 0)
            this.addSeries(this.chart);

        }
      }

    });
    this.subScriptionList.add(subscription);

    subscription = this.chartService.filterConfig.subscribe((iData: any) => {
      if (iData.indicatorId == this.indId) {
        if (iData.filterName == "RiskFactor") {
          this.yAxisCol = iData.filterValue;

          this.data = this.prepareDataFromIndicatorData(this.apiData);
          if (this.chart) {
            if (this.chart.series && this.chart.series.length > 0)
              this.removeSeries();

            this.addSeries(this.chart);
          }
        }
      }
    });
    this.subScriptionList.add(subscription);

    subscription = this.chartService.selectedSupplierIDs.subscribe((iData: any) => {
      this.selectedSuppliers = iData.selectedSuppliersID;
      this.data = this.prepareDataFromIndicatorData(this.apiData);
      if (this.chart) {
        if (this.chart.series && this.chart.series.length > 0)
          this.removeSeries();

        this.addSeries(this.chart);
      }
    });
    this.subScriptionList.add(subscription);

    subscription = this.chartService.isAscending.subscribe((iData: any) => {
      if (iData.indicatorId == this.indId) {
        this.isAscending = iData.isAscending;

        this.data = this.prepareDataFromIndicatorData(this.apiData);
        if (this.chart) {
          if (this.chart.series && this.chart.series.length > 0)
            this.removeSeries();

          this.addSeries(this.chart);
        }
      }
    });
    this.subScriptionList.add(subscription);
  }

  ngAfterViewInit() {
    let tmpThis = this;

    Highcharts.setOptions({
      lang: {
        numericSymbols: ["k", "M", "B", "T", "P", "E"]
      }
    });

    this.chart = Highcharts.chart({
      chart: {
        renderTo: 'container_' + this.indId,
        type: 'spline',
        height: 300,
        events: {
          render() {
            if (tmpThis.data && (this.series == undefined || this.series.length <= 0))
              tmpThis.addSeries(this);
          }
        }
      },
      colors: colors,
      title: {
        text: ''// 'Solar Employment Growth by Sector, 2010-2016'
      },
      xAxis: {
        // temporary for static data
        //  categories: (this.indId == 1011 || this.indId == 1012) ? this.xAxisCol : [],
        type: "datetime",
        labels: {
          formatter() {

            let formattedValue = "";
            if (tmpThis.selectedDataView == "Quarterly") {
              let qStartDate = new Date(this.value).toLocaleDateString();
              let qEndDate;
              if (tmpThis.indicatorName == "SupplierList")
                qEndDate = tmpThis.apiData.filter(a => new Date(a["startDate"]).toLocaleDateString() == qStartDate)[0]["endDate"];
              else
                qEndDate = tmpThis.apiData.filter(a => new Date(a["StartDate"]).toLocaleDateString() == qStartDate)[0]["EndDate"];
              //let qEndDateTS= new Date(qEndDate).getMilliseconds();

              formattedValue = moment(this.value).format('MMM YY') + '-' + moment(qEndDate).format('MMM YY');
              // new Date('2021-06-01T00:00:00').toLocaleDateString()
            }

            else if (tmpThis.selectedDataView == "Monthly")
              formattedValue = moment(this.value).format('MMM YY');
            else if (tmpThis.selectedDataView == "Weekly")
              formattedValue = moment(this.value).format('DD MMM') + '-' + moment(this.value).add(6, 'days').format('DD MMM');
            else if (tmpThis.selectedDataView == "Daily")
              formattedValue = moment(this.value).format('DD MMM');

            return formattedValue;
          }
        },
        accessibility: {
          enabled: tmpThis.indicatorsAs == IndicatorsAs.IndeCommonData,
          rangeDescription: 'Range: 2010 to 2017'
        }
      },
      yAxis: {
        //  max: 1,
        title: {
          text: this.yAxisCol
        },
        labels: {
          format: '{value:.2f}'
        }
      },
      tooltip: {
        shared: true,
        formatter: function () {
          let formattedDateValue = "";
          if (tmpThis.selectedDataView == "Quarterly") {
            let qStartDate = new Date(this.x).toLocaleDateString();
            let qEndDate;
            if (tmpThis.indicatorName == "SupplierList")
              qEndDate = tmpThis.apiData.filter(a => new Date(a["startDate"]).toLocaleDateString() == qStartDate)[0]["endDate"];
            else
              qEndDate = tmpThis.apiData.filter(a => new Date(a["StartDate"]).toLocaleDateString() == qStartDate)[0]["EndDate"];

            formattedDateValue = moment(this.x).format('MMM YY') + '-' + moment(qEndDate).format('MMM YY');
          }
          else if (tmpThis.selectedDataView == "Monthly")
            formattedDateValue = moment(this.x).format('MMM YY');
          else if (tmpThis.selectedDataView == "Weekly")
            formattedDateValue = moment(this.x).format('DD MMM') + ' - ' + moment(this.x).add(6, 'days').format('DD MMM');
          else if (tmpThis.selectedDataView == "Daily")
            formattedDateValue = moment(this.x).format('DD MMM');

          let tText = "";
          tmpThis.chart.series.forEach(ser => {
            let pointData = ser.userOptions.data.find(d => d[0] == this.x);
            if (pointData && pointData[1] != null)
              tText += ser.name + ': ' + Highcharts.numberFormat(pointData[1], 2) + (pointData[2] ? (' - ' + Highcharts.numberFormat(pointData[2], 2)) : '') + '<br/>';
          });

          // this.points.forEach(p => {
          //   tText += p.series.name + ': ' + p.y + '<br/>';
          // });

          return formattedDateValue + '<br/>' + tText;
          //   'Demand : ' + tmpThis.shortNumberPipe.transform(DemandPoint.y) + '<br/>' +
          //   'Supply : ' + tmpThis.shortNumberPipe.transform(SupplyPoint.y);
        }
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        series: {
          events: {
            legendItemClick: function () {
              if (tmpThis.dashboardName == "Risk_Forecast" && this.options.type == 'spline')
                this.chart.series.filter(s => s.name.includes(this.name) && s.options.type != 'spline').forEach((es) => {
                  if (this.visible)
                    es.hide();
                  else
                    es.show();
                });
              return true;
            }
          }
        }
      },
      series: this.apiData
    });
    this.themeService.highChartTheme.subscribe(
      (theme: any) => {
        if (theme == 'default') {
          tmpThis.chart.update(themes.defaultTheme);
        }
        else {
          tmpThis.chart.update(themes.darkTheme);
        }
      }
    );
  }

  ngOnDestroy() {
    this.subScriptionList.unsubscribe();
    this.chart = undefined;
  }

  updateData(data = this.apiData) {
    this.data = data;

    if (this.chart && (this.chart.series == undefined || this.chart.series.length <= 0)) {
      this.addSeries(this.chart);
    }
  }

  removeSeries() {
    let sLen = this.chart.series.length;
    for (var i = 0; i < sLen; i++) {
      let s = this.chart.series[0];
      s.remove(false);
    }
  }

  addSeries(chart) {
    if (this.data.title)
      chart.setTitle({ text: this.data.title }, false);

    if (this.data.yAxisTitle)
      chart.yAxis[0].setTitle({ text: this.data.yAxisTitle }, false);

    if (this.data.yAxisUB && this.data.yAxisLB)
      chart.yAxis[0].update({
        plotLines: [{
          value: this.data.yAxisLB,
          color: 'red',
          dashStyle: 'shortdash',
          width: 2,
          label: {
            text: this.data.yAxisLB.toFixed(2)
          }
        }, {
          value: this.data.yAxisUB,
          color: 'red',
          dashStyle: 'shortdash',
          width: 2,
          label: {
            text: this.data.yAxisUB.toFixed(2)
          }
        }]
      }, false);


    let tickIntrvl;
    if (this.selectedDataView == "Daily")
      tickIntrvl = 24 * 3600 * 1000;
    else if (this.selectedDataView == "Weekly")
      tickIntrvl = 7 * (24 * 3600 * 1000);

    chart.xAxis[0].update({
      labels: { rotation: this.selectedDataView == "Weekly" ? 315 : 0 },
      tickInterval: tickIntrvl
    }, false);


    this.data.seriesData.forEach(sd => {
      chart.addSeries(sd, false);
    });


    chart.redraw();

  }

  prepareDataFromIndicatorData(data) {
    let tmpThis = this;
    let aData = this.apiData;

    if (this.indicatorName == "SupplierDAM" || this.indicatorName == "SupplierRAREFQ" ||
      this.indicatorName == "Risk_Forecast_W1" || this.indicatorName == "Risk_Forecast_W2") {

      if (this.selectedSuppliers.length > 0) {
        aData = this.apiData.filter(a => this.selectedSuppliers.includes(a["SupplierID"]));
      }
      let maxDateTS = Math.max(...aData.filter((x, i, a) => a.findIndex(a => a[this.xAxisCol] == x[this.xAxisCol]) == i).map(ad => new Date(ad.StartDate).getTime()));
      let supplierWithMaxDate = aData.filter(s => new Date(s.StartDate).getTime() == maxDateTS).map(si => si["SupplierID"]);
      aData = aData.filter(s => supplierWithMaxDate.includes(s["SupplierID"]));
      if (this.indicatorName == "Risk_Forecast_W2") {
        // let highest5DAM = this.apiData.map(s => s['LatestDAM']).filter((x, i, a) => a.indexOf(x) === i && x != 0)
        //   .sort((a, b) => { return b - a }).slice(0, 5);
        // aData = this.apiData.filter(a => highest5DAM.includes(a["LatestDAM"]));
        let uniqueLatestDamSupplier = aData.filter((x, i, a) => a.findIndex(a => a.LatestDAM == x.LatestDAM && a.SupplierID == x.SupplierID) == i);
        aData = uniqueLatestDamSupplier.sort((a, b) => { return b.LatestDAM - a.LatestDAM }).slice(0, 5);
      }
      else {
        let uniqueLatestDamSupplier = aData.filter((x, i, a) => a.findIndex(a => a.LatestDAM == x.LatestDAM && a.SupplierID == x.SupplierID) == i);

        if (this.indicatorName == "SupplierDAM" && !this.isAscending)
          aData = uniqueLatestDamSupplier.sort((a, b) => { return b.LatestDAM - a.LatestDAM }).slice(0, 5);
        else
          aData = uniqueLatestDamSupplier.sort((a, b) => { return a.LatestDAM - b.LatestDAM }).slice(0, 5);
      }
    }

    let seriesNames = aData.map(s => s[this.legendCol]).filter((x, i, a) => a.indexOf(x) === i);
    let seriesData = [];
    this.yValueArray = [];
    let counter = 0;
    let yAxisTitle = this.colDisplayName[this.yAxisCol];
    seriesNames.forEach((s, i) => {
      let ser = this.prepareSeriesObjForIndicatoData(s, this.yAxisCol, i, s, i);
      seriesData.push(...ser);
    });

    let yAxisUB;
    let yAxisLB;

    if (this.yValueArray.length > 0) { // this.stDvList.length > 0 && this.avgList.length > 0
      let stdDv = this.standarvDev(this.yValueArray);//this.stDvList.length > 1 ? this.standarvDev(this.stDvList) : this.stDvList[0];
      let avg = this.avgArray(this.yValueArray);//this.avgList.length > 1 ? this.avgArray(this.avgList) : this.avgList[0];
      yAxisUB = (avg + (3 * stdDv)).toFixed(2);
      yAxisLB = (avg - (3 * stdDv)).toFixed(2);
      yAxisUB = yAxisUB > 0.99 ? 0.99 : yAxisUB;
      yAxisLB = yAxisLB < 0 ? 0 : yAxisLB;

      let upperBoundData = this.apiData.filter((x, i, a) => a.findIndex(a => a[this.xAxisCol] == x[this.xAxisCol]) == i).map(d => ([new Date(d[this.xAxisCol]).getTime(), +yAxisUB]));
      let lowerBoundData = this.apiData.filter((x, i, a) => a.findIndex(a => a[this.xAxisCol] == x[this.xAxisCol]) == i).map(d => ([new Date(d[this.xAxisCol]).getTime(), +yAxisLB]));

      let upperBandSeries = {
        name: 'Upper Band',
        type: 'line',
        data: upperBoundData,
        color: 'red',
        dashStyle: 'shortdash',
        width: 2,
        marker: {
          enabled: false
        }
      }

      let lowerBandSeries = {
        name: 'Lower Band',
        type: 'line',
        data: lowerBoundData,
        color: 'red',
        dashStyle: 'shortdash',
        width: 2,
        marker: {
          enabled: false
        }
      }

      seriesData = [upperBandSeries, ...seriesData, lowerBandSeries];
    }

    return {
      seriesData: seriesData,
      yAxisTitle: yAxisTitle
      // yAxisUB: yAxisUB,
      // yAxisLB: yAxisLB
    }
  }

  prepareSeriesObjForIndicatoData(s, yAxisCol, sIndex, sName, colorCntr) {
    let currentDate = new Date();

    let weekDay = currentDate.getDay() || 7;
    let year = currentDate.getFullYear();
    let month = currentDate.getMonth();
    let date = currentDate.getDate();
    let hours = currentDate.getHours();
    let minutes = currentDate.getMinutes();
    let quarter = Math.floor((currentDate.getMonth() + 3) / 3);


    let sDataArray = this.apiData.filter(ds => ds[this.legendCol] == s).map(sData => ([new Date(sData[this.xAxisCol]).getTime(), sData[yAxisCol]]));


    if (this.dashboardName == "Risk_Trend") {
      let yValueArray = sDataArray.map(s => s[1]);
      this.yValueArray.push(...yValueArray);
      // let avgValue = this.avgArray(yValueArray);
      // let stdValue = this.standarvDev(yValueArray);
      // this.avgList.push(avgValue);
      // this.stDvList.push(stdValue);
    }

    let firstZoneValue;
    let areaSeries;
    if (this.dashboardName == "Risk_Forecast") {
      let areaRangeData = this.apiData.filter(ds => ds[this.legendCol] == s).map(sData => ([new Date(sData[this.xAxisCol]).getTime(), sData['LowerBand'], sData['UpperBand']]));
      areaSeries = {
        name: sName + " Deviation",
        type: 'areasplinerange',
        data: areaRangeData,
        color: colors[colorCntr],
        showInLegend: false,
        fillColor: "transparent",
        dashStyle: 'shortdash'
      }

      if (this.selectedDataView == "Quarterly") {
        firstZoneValue = new Date(year, (quarter - 1) * 3, 1).getTime();
      }
      else if (this.selectedDataView == "Monthly") {
        let maxDateMonth = new Date(Math.max(...this.apiData.map(ad => new Date(ad[this.xAxisCol])))).getMonth();

        firstZoneValue = new Date(year, month, 1, 0, 0, 1).getTime();
      }
      else if (this.selectedDataView == "Weekly") {
        let dateToBeSet = date - (weekDay - 1);
        firstZoneValue = new Date(new Date(currentDate.setDate(dateToBeSet)).setHours(0)).setMinutes(1);
      }
      else if (this.selectedDataView == "Daily") {
        firstZoneValue = new Date(year, month, date, hours, minutes + 1).getTime();
      }
    }

    let sData = {
      name: sName,
      type: 'spline',
      data: sDataArray

    }

    if (firstZoneValue) {
      Object.assign(sData,
        {
          zoneAxis: 'x',
          zones: [{
            value: firstZoneValue,
            color: colors[colorCntr]
          },
          {
            color: '#FFA600'
          }]
        })

    }
    let serArray = [];
    serArray.push(sData);
    if (areaSeries)
      serArray.push(areaSeries);

    return serArray;
  }

  standarvDev(arr) {

    let mean = this.avgArray(arr);

    // Assigning (value - mean) ^ 2 to every array item
    arr = arr.map((k) => {
      return (k - mean) ** 2
    });

    // Calculating the sum of updated array
    let sum = arr.reduce((acc, curr) => acc + curr, 0);

    // Calculating the variance
    let variance = sum / arr.length;

    // Returning the Standered deviation
    return Math.sqrt(sum / arr.length);
  }

  avgArray(arr) {
    // Creating the mean with Array.reduce
    let mean = arr.reduce((acc, curr) => {
      return acc + curr
    }, 0) / arr.length;

    return mean;
  }
}
