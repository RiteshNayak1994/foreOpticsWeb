import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { AbstractChart } from '../abstract-chart';

@Component({
  selector: 'app-error-bar-chart',
  templateUrl: './error-bar-chart.component.html',
  styleUrls: ['./error-bar-chart.component.scss']
})
export class ErrorBarChartComponent extends AbstractChart implements OnInit {

  data: any;

  constructor() {
    super();
  }

  ngOnInit(): void {
    let options: Highcharts.Options = {
      chart: {
        renderTo: 'errorBarContainer',
        zoomType: 'xy'
      },
      title: {
        text: 'Temperature vs Rainfall'
      },
      xAxis: [{
        categories: ['Mar - 21', 'Apr - 21', 'Jun - 21', 'Jul - 21', 'Aug - 21', 'Sep - 21']
      }],
      yAxis: [{ // Primary yAxis
        title: {
          text: 'Inventory',
          style: {
            color: Highcharts.getOptions().colors[1]
          }
        }
      }],

      tooltip: {
        shared: true
      },

      credits:{
        enabled: false
      },

      series: [{
        name: 'On Hand',
        type: 'column',
        data: [55, 25, 40, 100, 140, 190],
        tooltip: {
          pointFormat: '<span style="font-weight: bold; color: {series.color}">{series.name}</span>: <b>{point.y}</b><br/>'
        }
      }, {
        name: 'Target',
        type: 'spline',
        data: [75, 50, 32, 101, 120, 225],
        tooltip: {
          pointFormat: '<span style="font-weight: bold; color: {series.color}">{series.name}</span>: <b>{point.y}</b> '
        }
      }, {
        name: 'Target error',
        type: 'errorbar',
        data: [[50, 95], [35, 50], [32, 60], [80, 120], [120, 150], [200, 228]],
        tooltip: {
          pointFormat: '(Min: {point.low} - Max:{point.high})<br/>'
        }
      }]
    };

    Highcharts.chart(options);
    // this.apiData = candlestickData;
    // this.xAxisCol = 'x-axis-col';
    // this.yAxisCol = 'y-axis-col';
    // this.chart = Highcharts.chart(this.options);
    // this.data = this.prepareDataFromIndicatorData(this.apiData);
    // this.addSeries(this.chart);
  }

}
