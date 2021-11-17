import { Component, OnInit } from '@angular/core';
import { AbstractChart } from '../abstract-chart';
import * as Highcharts from 'highcharts/highstock';
import { Subscription } from 'rxjs/internal/Subscription';
import { ChartService } from '../../chart.service';
import heatmap from 'highcharts/modules/heatmap';
import { Router } from '@angular/router';
import drillDown from 'highcharts/modules/drilldown';
import { ShortNumberPipe } from '../../../../pipes/short-number/short-number.pipe';
import { themes } from '../../chartConstants';
import { ThemeService } from '../../../../sharedServices/theme.service';

heatmap(Highcharts);
drillDown(Highcharts);
@Component({
  selector: 'app-heat-map-chart',
  templateUrl: './heat-map-chart.component.html',
  styleUrls: ['./heat-map-chart.component.scss']
})
export class HeatMapChartComponent extends AbstractChart implements OnInit {
  apiData;
  data;
  seriesColProp = 'RAR';
  scrollbar;
  track;
  bar;
  isAscending = true;

  shortNumberPipe = new ShortNumberPipe();
  subScriptionList: Subscription = new Subscription();
  xCategories;
  yCategories;
  yCategoriesFullName =
    {
      "Res": "Responsiveness",
      "Agl": "Agility",
      "Rel": "Reliability",
      "ES": "Exposure Score",
      "FS": "Feature Score",
      "QS": "Quality Score",
    }

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

  }


  getPointCategoryName(point, dimension) {
    var series = point.series,
      isY = dimension === 'y',
      axis = series[isY ? 'yAxis' : 'xAxis'];
    return axis.categories[point[isY ? 'y' : 'x']];
  }

  ngAfterViewInit() {
    let tempThis = this;
    this.chart = Highcharts.chart({
      chart: {
        renderTo: 'container_' + this.indId,
        type: 'heatmap',
        height: 325,
        marginLeft: 200,
        inverted: true,
        events: {
          drilldown: function (e: any) {
            let dataToSend = {
              SupplierId: e.point.SupplierID,
              SupplierName: e.point.category
            };
            tempThis._router.navigate(['dashboard/supplierDetail/' + e.point.SupplierID], { state: dataToSend });
          }
        },
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
        }
      },
      title: {
        text: ''
      },
      xAxis: {
        //categories: ['REL', 'RES', 'AGL'],
        //opposite: true
        title: null,
        ceiling: 4,
        floor: 0,
        tickLength: 0,
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
          // height: 8
          //size: 8
        },
        events: {
          setExtremes: function (e) {
            if (e.trigger == "scrollbar") {
              e.preventDefault();
              tempThis.setxAxisExtreme(Math.round(e.min), Math.round(e.max), true);
            }
          }
        }
      },
      yAxis: {
        //   categories: this.categories,
        title: {
          text: ''
        },
        opposite: true,
        // ceiling: 4,
        // floor: 0,
        // tickLength: 0,
        events: {
          setExtremes: function (e) {
            if (e.trigger == "scrollbar") {
              e.preventDefault();
              tempThis.setxAxisExtreme(Math.round(e.min), Math.round(e.max), true);
            }
          }
        }
      },
      accessibility: {
        point: {
          descriptionFormatter: function (point) {
            var ix = point.index + 1,
              xName = this.getPointCategoryName(point, 'x'),
              yName = this.getPointCategoryName(point, 'y'),
              val = point.value;
            return ix + '. ' + xName + ' sales ' + yName + ', ' + val + '.';
          }
        }
      },
      colorAxis: {
        visible: false,
        type: 'linear',
        stops: [
          [0, '#f04242'],
          [0.165, '#f07c42'],
          [0.33, '#efbd43'],
          [0.485, '#eff643'],
          [0.66, '#acf53a'],
          [0.85, '#66f431'],
          [1, '#27f429']
        ]
      },
      tooltip: {
        formatter: function () {
          let fullName = tempThis.yCategoriesFullName[tempThis.yCategories[this.point.y]];
          return '<b>' + fullName + '</b> <b>' + Highcharts.numberFormat(this.point.value, 2) + '</b>';
        }
      },
      // legend: {
      //   layout: 'horizontal',
      //   align: 'center',
      // },
      credits: {
        enabled: false
      },
      plotOptions: {
        heatmap: {
          dataLabels: {
            enabled: true,
            formatter: function () {
              return '<b>' + Highcharts.numberFormat(this.point.value, 2) + '</b>';
            }
          }
        }
      },
      series: [{
        name: 'Sales per employee',
        borderWidth: 1,
        type: 'heatmap',
        data: [
          [0, 0, 10], [0, 1, 92], [2, 0, 35],
          [1, 0, 19], [1, 1, 58], [2, 1, 15],
          [2, 0, 8], [2, 1, 78], [2, 2, 123],
          [3, 0, 24], [3, 1, 117], [2, 3, 64],
          [4, 0, 67], [4, 1, 48], [2, 4, 52],
          [5, 0, 8], [5, 1, 117], [2, 5, 123],
          [6, 0, 10], [6, 1, 92], [2, 6, 35],
          [7, 0, 19], [7, 1, 58], [2, 7, 15],
          [8, 0, 8], [8, 1, 78], [2, 8, 123],
          [9, 0, 24], [9, 1, 117], [2, 9, 64],
          [10, 0, 67], [10, 1, 48], [2, 10, 52],
          [11, 0, 8], [11, 1, 117], [2, 11, 123]
        ],
        dataLabels: {
          enabled: true,
          color: '#000',
          shadow: false
        }
      }]
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

    let yCategories;
    this.xCategories = data.map(s => s[this.legendCol]).filter((x, i, a) => a.indexOf(x) === i);


    let cdata = data.map(s => s[this.yAxisCol]);
    if (this.seriesCol) {

      this.yCategories = this.seriesCol[this.seriesColProp];
      let tempData = data.filter(rp => rp[this.yCategories[0]] > 0 || rp[this.yCategories[1]] > 0 || rp[this.yCategories[2]] > 0);
      this.xCategories = tempData.map(s => s[this.legendCol]).filter((x, i, a) => a.indexOf(x) === i);

      let sData = [];

      this.xCategories.forEach((s, i) => {
        this.seriesCol[this.seriesColProp].forEach((sr, j) => {
          let value = tempData.find(tm => tm[this.legendCol] == s)[sr];
          // let point = { name : y: s[this.yAxisCol], drilldown: true, SupplierID: s.SupplierID };
          let SupplierID = tempData.find(t => t.SupplierName === s)["SupplierID"];
          let point = {
            x: i,
            y: j,
            value: value,
            drilldown: true,
            category: s,
            SupplierID: SupplierID
          }
          //sData.push([j, i, value]);
          sData.push(point);
        });

      });


      let ser = {
        "name": "DAM Drivers",
        "data": sData,
        dataLabels: {
          enabled: true,
          color: '#000',
          shadow: false
        }
      }
      seriesData.push(ser);
    }
    else {
      let sData = {
        "name": "DAM Score",
        "data": cdata,
        "colorByPoint": true,
        "showInLegend": false
      }
      seriesData.push(sData);
    }

    return {
      xCategories: this.xCategories,
      yCategories: this.yCategories,
      seriesData: seriesData,
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

    if (this.data.xCategories) {
      chart.xAxis[0].update({
        categories: this.data.xCategories
      }, false);
      this.setxAxisExtreme(0, this.data.xCategories.length, false);
    }

    if (this.data.yCategories) {
      chart.yAxis[0].update({
        categories: this.data.yCategories
      }, false);
    }


    this.data.seriesData.forEach(sd => {
      chart.addSeries(sd, false);
    });
    chart.redraw();
  }


  setxAxisExtreme(min, max, redraw = false) {
    if (this.data.xCategories.length < 4)
      max = this.data.xCategories.length - 1;
    else if (min == 0)
      max = min + 4;
    else if (min > 0)
      min = max - 4;


    this.chart.xAxis[0].setExtremes(min, max, redraw);
  }

}
