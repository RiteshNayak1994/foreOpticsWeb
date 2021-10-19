import { Component, OnDestroy, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { Subscription } from 'rxjs/internal/Subscription';
import { ShortNumberPipe } from '../../../../../@theme/pipes/short-number/short-number.pipe';
import { ChartService } from '../../chart.service';
import { colors } from '../../chartConstants';
import { AbstractChart } from '../abstract-chart';

@Component({
  selector: 'app-column-chart',
  templateUrl: './column-chart.component.html',
  styleUrls: ['./column-chart.component.css']
})
export class ColumnChartComponent extends AbstractChart implements OnInit, OnDestroy {
  data: any;
  shortNumberPipe = new ShortNumberPipe();
  subScriptionList: Subscription = new Subscription();

  constructor(private chartService: ChartService) {
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
      }
    });
    this.subScriptionList.add(subscription);
  }

  ngAfterViewInit() {
    let tmpThis = this;
    Highcharts.setOptions({
      lang: {
        // thousandsSep: ',',
        numericSymbols: ["k", "M", "B", "T", "P", "E"]
      }
    });
    this.chart = Highcharts.chart({
      chart: {
        renderTo: 'container_' + this.indId,
        type: 'column',
      },
      colors: colors,
      xAxis: {
        type: 'category',
        categories: [],//this.apiData.categories,
        crosshair: true,
        title: {
          text: this.xAxisTitle,//this.apiData.yAxisTitle
          style: {
            color: "black",
            fontSize: "14"
          }
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: this.yAxisTitle,//this.apiData.yAxisTitle
          style: {
            color: "black",
            fontSize: "14"
          }
        },
        labels: {
          formatter: function () {
            return (tmpThis.yAxisCol == 'cost' ? '$' : '') + tmpThis.shortNumberPipe.transform(this.value as number);
          }
        }
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        column: {
          dataLabels: {
            enabled: true,
            formatter: function () {
              return (tmpThis.yAxisCol == 'cost' ? '$' : '') + tmpThis.shortNumberPipe.transform(this.y);
            }
          }
        }
      },
      tooltip: {
        // formatter: function () {
        //   return moment(this.x).format('MMM - YY') + '<br/>' + tmpThis.shortNumberPipe.transform(this.y);
        // }
        shared: true,
        formatter: function () {
          return this.x + ' ' + (tmpThis.yAxisCol == 'cost' ? '$' : '') + tmpThis.shortNumberPipe.transform(this.y);
        }
      },
      series: []
      //  [{
      //   name: this.apiData.name,
      //   type: 'column',
      //   colorByPoint: true,
      //   colors: colors,
      //   data: this.apiData.data
      // }]
    });
  }

  ngOnDestroy() {
    this.subScriptionList.unsubscribe();
  }

  prepareDataFromIndicatorData(data) {
    let seriesData = [];
    let categories = data.map(s => s[this.legendCol]).filter((x, i, a) => a.indexOf(x) === i);
    let cdata = data.map(s => s[this.yAxisCol]);
    let sData = {
      "name": this.legendCol,
      "data": cdata,
      "colorByPoint": true,
      "showInLegend": false
    }
    seriesData.push(sData);
    return {
      categories: categories,
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

    if (this.data.categories)
      chart.xAxis[0].update({
        categories: this.data.categories
      }, false);

    this.data.seriesData.forEach(sd => {
      chart.addSeries(sd, false);
    });
    chart.redraw();
  }
}
