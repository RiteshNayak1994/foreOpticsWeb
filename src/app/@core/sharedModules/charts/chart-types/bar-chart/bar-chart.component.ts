import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts/highstock';
import { Subscription } from 'rxjs/internal/Subscription';
import { ShortNumberPipe } from '../../../../../@core/pipes/short-number/short-number.pipe';
import { ChartService } from '../../chart.service';
import { colors, IndicatorsAs } from '../../chartConstants';
import { AbstractChart } from '../abstract-chart';
import drillDown from 'highcharts/modules/drilldown';
import { Router } from '@angular/router';
import { ThemeService } from '../../../../sharedServices/theme.service';
import { themes } from '../../chartConstants';
drillDown(Highcharts);

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent extends AbstractChart implements OnInit {
  apiData;
  data;
  seriesColProp = 'RAR';
  scrollbar;
  track;
  bar;
  isAscending = true;

  shortNumberPipe = new ShortNumberPipe();
  subScriptionList: Subscription = new Subscription();

  constructor(
    private chartService: ChartService,
    private _router: Router,
    private themeService: ThemeService
  ) {
    super();
  }

  ngOnInit(): void {
    let subscription;
    subscription = this.chartService.indicatorData.subscribe((iData: any) => {
      if (iData.indicatorId == this.indId) {
        this.apiData = iData.indicatorData;

        this.data = this.prepareDataFromIndicatorData(this.apiData);
        if (this.chart) {
          if (this.chart.series && this.chart.series.length > 0)
            this.removeSeries();

          this.addSeries(this.chart);
        }

      }

    });
    this.subScriptionList.add(subscription);

    subscription = this.chartService.filterConfig.subscribe((iData: any) => {
      if (iData.indicatorId == this.indId) {
        if (iData.filterName == "quantitycost") {
          this.yAxisCol = iData.filterValue;
          this.removeSeries();
          this.data = this.prepareDataFromIndicatorData(this.apiData);
          if (this.chart) {
            if (this.yAxisCol == "cost") {
              this.chart.yAxis[0].setTitle({ text: 'Order Cost' }, false);
            }

            if (this.yAxisCol == "quantity") {
              this.chart.yAxis[0].setTitle({ text: 'Order Quantity' }, false);
            }

            if (this.chart.series && this.chart.series.length > 0)
              this.removeSeries();

            this.addSeries(this.chart);
          }
        }
        else if (iData.filterName == "RARESFSQS") {
          this.seriesColProp = iData.filterValue;

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
    let tempThis = this;
    this.chart = Highcharts.chart({
      chart: {
        renderTo: 'container_' + this.indId,
        type: 'bar',
        events: {
          drilldown: function (e: any) {
            let dataToSend = {
              SupplierId: e.point.SupplierID,
              SupplierName: e.point.category
            };
            tempThis._router.navigate(['/supplierDetail/' + e.point.SupplierID], { state: dataToSend });
          }
        },
        height: 325,
        marginLeft: 150
      },
      title:{
        text: ''
      },
      drilldown: {
        activeAxisLabelStyle: {
          textDecoration: 'none',
          fontWeight: '300',
          color: null
        },
        activeDataLabelStyle: {
          textDecoration: 'none',
          fontWeight: '300',
          color: null
        },
      },
      colors: colors,
      xAxis: {
        ceiling: 4,
        floor: 0,
        //max: 3,
        type: 'category',
        categories: [],//categories: this.xAxisCol, // xAxisCol
        scrollbar: {
          enabled: true,
          liveRedraw: false,

          // barBackgroundColor: '#d5d5d5',
          // barBorderWidth: 0,
          // barBorderRadius: 0,
          // barBorderColor: '#d5d5d5',

          // buttonArrowColor: '#fff',
          // buttonBackgroundColor: '#fff',
          // buttonBorderWidth: 0,
          // buttonBorderRadius: 0,
          // buttonBorderColor: '#fff',

          // trackBackgroundColor: '#fff',
          // trackBorderWidth: 0,
          // trackBorderColor: '#fff',
          // trackBorderRadius: 0,

          // rifleColor: '#d5d5d5',
          // height: 8,
          // minWidth: 30

        },
        tickLength: 0,
        events: {
          setExtremes: function (e) {
            if (e.trigger == "scrollbar") {
              e.preventDefault();
              tempThis.setxAxisExtreme(Math.floor(e.min), Math.floor(e.min) + 5, true);
            }
          }
        }
      },
      yAxis: {
        min: 0,
        max: 1,
        title: {
          text: this.yAxisTitle,
          style: {
            color: "black",
            fontSize: "14"
          }
        },
        labels: {
          overflow: 'justify',
          format: '{value:.2f}'
        }
      },
      tooltip: {
        enabled: true,
        pointFormatter: function () {
          return this.series.name + ': <b>' + Highcharts.numberFormat(this.y, 2) + '</b>';
        }
      },
      plotOptions: {
        series:{
          dataLabels:{
            enabled: true,
            color: null
          }
        },
        bar: {
          cropThreshold: 5,
          dataLabels: {
            enabled: true,
            formatter: function () {
              return '<b>' + Highcharts.numberFormat(this.y, 2) + '</b>';
            }
          }
        }
      },
      legend: {
        layout: 'horizontal',
        align: 'center',
      },
      credits: {
        enabled: false
      },
      series: []//this.apiData
    });
    this.themeService.highChartTheme.subscribe(
      (theme: any) => {
        if (theme == 'default') {
          tempThis.chart.update(themes.defaultTheme);
        }
        else {
          tempThis.chart.update(themes.darkTheme);
        }
      }
    );
  }

  ngOnDestroy() {
    this.subScriptionList.unsubscribe();
  }

  prepareDataFromIndicatorData(data) {
    let colDisplayName =
    {
      "Res": "Responsiveness",
      "Agl": "Agility",
      "Rel": "Reliability",
      "ES": "Exposure Score",
      "FS": "Feature Score",
      "QS": "Quality Score",
    }
    let seriesData = [];
    if (this.indicatorName == "SupplierByDAM")
      if (this.isAscending)
        data = data.sort((a, b) => { return a[this.yAxisCol] - b[this.yAxisCol] });
      else
        data = data.sort((a, b) => { return b[this.yAxisCol] - a[this.yAxisCol] });

    let categories = data.map(s => s[this.legendCol]).filter((x, i, a) => a.indexOf(x) === i);

    let cdata = data.map(s => ({ y: s[this.yAxisCol], drilldown: true, SupplierID: s.SupplierID }));
    if (this.seriesCol) {

      let sColName = this.seriesCol[this.seriesColProp];
      let tempData = data.filter(rp => rp[sColName[0]] > 0 || rp[sColName[1]] > 0 || rp[sColName[2]] > 0);
      this.seriesCol[this.seriesColProp].forEach(sr => {
        let sData = {
          "name": colDisplayName[sr],
          "data": tempData.map(ds => ds[sr])
          // "colorByPoint": true,
          // "showInLegend": false
        }
        seriesData.push(sData);
      });
    }
    else {
      let sData = {
        "name": "DAM Score",
        "data": cdata,
        "colorByPoint": true,
        "showInLegend": false,
        "drilldown": true
      }
      seriesData.push(sData);
    }

    return {
      categories: categories,
      seriesData: seriesData
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

    if (this.data.categories) {
      chart.xAxis[0].update({
        categories: this.data.categories
      }, false);
      this.setxAxisExtreme(0, this.data.categories.length, false);
    }


    this.data.seriesData.forEach(sd => {
      chart.addSeries(sd, false);
    });
    chart.redraw();
  }

  setxAxisExtreme(min, max, redraw = false) {
    // if (this.data.categories.length >= 4)
    //   max = min + 5;
    // else
    //   max = this.data.categories.length - 1;

    if (this.data.categories.length < 6)
      max = this.data.categories.length - 1;
    else
      max = min + 5;

    this.chart.xAxis[0].setExtremes(min, max, redraw);
  }
}
