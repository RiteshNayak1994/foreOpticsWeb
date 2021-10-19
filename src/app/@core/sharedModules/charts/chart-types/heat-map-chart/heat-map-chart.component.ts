import { Component, OnInit } from '@angular/core';
import { AbstractChart } from '../abstract-chart';
import * as Highcharts from 'highcharts/highstock';
import { Subscription } from 'rxjs/internal/Subscription';
import { ShortNumberPipe } from '../../../../../@theme/pipes/short-number/short-number.pipe';
import { ChartService } from '../../chart.service';
import heatmap from 'highcharts/modules/heatmap';
import { ThemeService } from '../../../../sharedServices/theme.service';
import { themes } from '../../chartConstants';
heatmap(Highcharts);

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
  xCategoriesFullName =
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


  categories = [
    'ALLEGIANT AIR', 'ANSETT AIRCRAFT SPARES',
    'RELIANCE SPECIALTY PRODUCTS INC', 'HEIM BEARING DIVISION OF RBC',
    'BRON TAPES INC.', 'ADHESIVE PRODUCTS INC.',
    'ALLEGIANT AIR', 'ANSETT AIRCRAFT SPARES',
    'RELIANCE SPECIALTY PRODUCTS INC', 'HEIM BEARING DIVISION OF RBC',
    'BRON TAPES INC.', 'ADHESIVE PRODUCTS INC.'
  ]

  ngAfterViewInit() {
    let tempThis = this;
    this.chart = Highcharts.chart({
      chart: {
        renderTo: 'container_' + this.indId,
        type: 'heatmap',
        height: 325,
        marginLeft: 200
      },
      title: {
        text: ''
      },
      xAxis: {
        //categories: ['REL', 'RES', 'AGL'],
        opposite: true
      },
      yAxis: {
        //   categories: this.categories,
        title: null,
        reversed: true,
        scrollbar: {
          enabled: true,
          liveRedraw: false,

          barBackgroundColor: '#d5d5d5',
          barBorderWidth: 0,
          barBorderRadius: 0,
          barBorderColor: '#d5d5d5',

          buttonArrowColor: '#fff',
          buttonBackgroundColor: '#fff',
          buttonBorderWidth: 0,
          buttonBorderRadius: 0,
          buttonBorderColor: '#fff',

          trackBackgroundColor: '#fff',
          trackBorderWidth: 0,
          trackBorderColor: '#fff',
          trackBorderRadius: 0,

          rifleColor: '#d5d5d5',
          size: 8
        },
        ceiling: 4,
        floor: 0,
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
          let fullName = tempThis.xCategoriesFullName[tempThis.xCategories[this.point.x]];
          return '<b>' + fullName + '</b> <b>' + Highcharts.numberFormat(this.point.value, 2) + '</b>';
        }
      },
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
          [0, 0, 10], [0, 1, 19], [0, 2, 8], [0, 3, 24], [0, 4, 67], [0, 5, 8], [0, 6, 10], [0, 7, 19], [0, 8, 8], [0, 9, 24], [0, 10, 67], [0, 11, 8],
          [1, 0, 92], [1, 1, 58], [1, 2, 78], [1, 3, 117], [1, 4, 48], [1, 5, 117], [1, 6, 92], [1, 7, 58], [1, 8, 78], [1, 9, 117], [1, 10, 48], [1, 11, 117],
          [2, 0, 35], [2, 1, 15], [2, 2, 123], [2, 3, 64], [2, 4, 52], [2, 5, 123], [2, 6, 35], [2, 7, 15], [2, 8, 123], [2, 9, 64], [2, 10, 52], [2, 11, 123],
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

    let yCategories = data.map(s => s[this.legendCol]).filter((x, i, a) => a.indexOf(x) === i);


    let cdata = data.map(s => s[this.yAxisCol]);
    if (this.seriesCol) {

      this.xCategories = this.seriesCol[this.seriesColProp];
      let tempData = data.filter(rp => rp[this.xCategories[0]] > 0 || rp[this.xCategories[1]] > 0 || rp[this.xCategories[2]] > 0);
      yCategories = tempData.map(s => s[this.legendCol]).filter((x, i, a) => a.indexOf(x) === i);

      let sData = [];

      yCategories.forEach((s, i) => {
        this.seriesCol[this.seriesColProp].forEach((sr, j) => {
          let value = tempData.find(tm => tm[this.legendCol] == s)[sr];
          sData.push([j, i, value]);
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
      yCategories: yCategories,
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
    if (this.data.yCategories.length < 6)
      max = this.data.yCategories.length - 1;
    else
      max = min + 5;


    this.chart.yAxis[0].setExtremes(min, max, redraw);
  }

}
