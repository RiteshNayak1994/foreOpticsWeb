import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import more from 'highcharts/highcharts-more';
import { ChartService } from '../../chart.service';
import { IndicatorsAs } from '../../chartConstants';

more(Highcharts);

import { AbstractChart } from '../abstract-chart';

@Component({
  selector: 'app-guage-chart',
  templateUrl: './guage-chart.component.html',
  styleUrls: ['./guage-chart.component.css']
})
export class GuageChartComponent extends AbstractChart implements OnInit {
  apiData;
  data;

  constructor(private chartService: ChartService) {
    super();
  }

  ngOnInit(): void {

    this.chartService.selectedData.subscribe((obj: any) => {
      this.selectedData = obj.selectedData;
      if (this.indicatorsAs == IndicatorsAs.RelCommonData) {
        this.removeSeries();
        this.updateData();
      }

    });
  }

  ngAfterViewInit() {
    let tmpThis = this;
    this.chart = Highcharts.chart('container_' + this.indId, {
      chart: {
        type: 'gauge',
        plotBackgroundColor: null,
        plotBackgroundImage: null,
        plotBorderWidth: 0,
        plotShadow: false,
        events: {
          render() {
            if (tmpThis.data && (this.series == undefined || this.series.length <= 0))
              tmpThis.addSeries(this);
          }
        }
      },

      title: {
        text: 'Speedometer'
      },

      pane: {
        startAngle: -150,
        endAngle: 150,
        // background: [
        //   {
        //   backgroundColor: {
        //     linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
        //     stops: [
        //       [0, '#FFF'],
        //       [1, '#333']
        //     ]
        //   },
        //   borderWidth: 0,
        //   outerRadius: '109%'
        // },
        // {
        //   backgroundColor: {
        //     linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
        //     stops: [
        //       [0, '#333'],
        //       [1, '#FFF']
        //     ]
        //   },
        //   borderWidth: 1,
        //   outerRadius: '107%'
        // }, {
        //   // default background
        // }, 
        // {
        //   backgroundColor: '#DDD',
        //   borderWidth: 0,
        //   outerRadius: '105%',
        //   innerRadius: '103%'
        // }]
      },

      // the value axis
      yAxis: {
        min: 0,
        max: 200,

        minorTickInterval: 'auto',
        minorTickWidth: 1,
        minorTickLength: 10,
        minorTickPosition: 'inside',
        minorTickColor: '#666',

        tickPixelInterval: 30,
        tickWidth: 2,
        tickPosition: 'inside',
        tickLength: 10,
        tickColor: '#666',
        labels: {
          step: 2,
          //  rotation: 'auto'
        },
        title: {
          text: [IndicatorsAs.IndeCommonData, IndicatorsAs.RelCommonData].includes(tmpThis.indicatorsAs) ? "%" : 'km/h'
        },
        plotBands: [{
          from: 0,
          to: 120,
          color: '#55BF3B' // green
        }, {
          from: 120,
          to: 160,
          color: '#DDDF0D' // yellow
        }, {
          from: 160,
          to: 200,
          color: '#DF5353' // red
        }]
      },
      credits: {
        enabled: false
      },
      // series: [{
      //   name: 'Speed',
      //   type: 'gauge',
      //   data: [80],
      //   tooltip: {
      //     valueSuffix: ' km/h'
      //   }
      // }]

      // },
      //   // Add some life
      //   function (chart) {
      //     if (!chart.renderer.forExport) {
      //       setInterval(function () {
      //         var point = chart.series[0].points[0],
      //           newVal,
      //           inc = Math.round((Math.random() - 0.5) * 20);

      //         newVal = point.y + inc;
      //         if (newVal < 0 || newVal > 200) {
      //           newVal = point.y - inc;
      //         }

      //         point.update(newVal);

      //       }, 3000);
      //     }
    });
  }

  updateData(data = this.apiData) {
    this.data = [IndicatorsAs.IndeCommonData, IndicatorsAs.RelCommonData].includes(this.indicatorsAs) ? this.prepareDataFromCommon(data) : data;

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
    if ([IndicatorsAs.IndeCommonData, IndicatorsAs.RelCommonData].includes(this.indicatorsAs)) {
      chart.setTitle({ text: this.data.title }, false);
    }
    else {
      chart.setTitle({ text: 'Speedometer' }, false);
    }


    this.data.seriesData.forEach(sd => {
      chart.addSeries(sd, false);
    });

    chart.redraw();

  }

  prepareDataFromCommon(data) {
    data = data.filter(d => d.country == (this.selectedData || d.country));
    let title = data.map(d => d.country).join(",");
    let years = data.map(d => d.Years.map(y => y.Year))[0];
    let seriesData = years.map(ys => (data.map(d => (d.Years.find(y => y.Year == ys)["12MonthsData"]).reduce((a, b) => a + b))));
    let finalData = seriesData.map(s => s.reduce((a, b) => a + b)).reduce((x, y) => x + y);

    return {
      title: title,
      seriesData: [
        {
          "name": "Speed",
          "data": [
            ((finalData * 300) / 40000 - 150)
          ],
          "tooltip": {
            "valueSuffix": "%"
          }
        }
      ]
    }
  }
}
