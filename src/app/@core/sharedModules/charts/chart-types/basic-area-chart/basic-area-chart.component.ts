import { Component, OnInit } from '@angular/core';
import { AbstractChart } from '../abstract-chart';

import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-basic-area-chart',
  templateUrl: './basic-area-chart.component.html',
  styleUrls: ['./basic-area-chart.component.scss']
})
export class BasicAreaChartComponent extends AbstractChart implements OnInit {

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    Highcharts.chart({
      chart: {
        type: 'area',
        renderTo: 'container_' + this.indId,
        height: 100,
        width: 300,
        margin: [-25, 0, -10, 0]
      },
      xAxis: {
        visible: false,
      },
      yAxis: {
        visible: false,
      },
      legend: {
        enabled: false
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        area: {
          marker: {
            enabled: false,
            symbol: 'circle',
            radius: 2,
            states: {
              hover: {
                enabled: true
              }
            }
          }
        }
      },
      series: [{
        name: 'demand',
        type: 'area',
        color: this.customColor,
        data:
          [null, null, null, null, null, 6, 11, 32, 110, 235,
            369, 640, 1005, 1436, 2063, 3057, 4618, 6444, 9822, 15468,
            50434, 54126, 47387, 49459, 31056, 31982, 62040, 61233, 69224, 67342,
            26662, 26956, 27912, 28999, 28965, 57826, 55579, 55722, 54826, 54605,
            44304, 43464, 33708, 34099, 24357, 24237, 24401, 24344, 23586, 22380,
            21004, 17287, 14747, 13076, 12555, 12144, 11009, 10950, 10871, 10824,
            10577, 10527, 10475, 10421, 10358, 10295, 10104, 9914, 9620, 9326,
            5113, 5113, 4954, 4804, 4761, 4717, 4368, 4018]
      }]
    });
  }

}
