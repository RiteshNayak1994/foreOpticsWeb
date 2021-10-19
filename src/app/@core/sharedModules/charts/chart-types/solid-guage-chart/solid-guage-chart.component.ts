import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { AbstractChart } from '../abstract-chart';
import more from 'highcharts/highcharts-more';
import solidguage from 'highcharts/modules/solid-gauge';
import { ChartService } from '../../chart.service';
import { ShortNumberPipe } from '../../../../../@theme/pipes/short-number/short-number.pipe';
more(Highcharts);
solidguage(Highcharts);

@Component({
  selector: 'app-solid-guage-chart',
  templateUrl: './solid-guage-chart.component.html',
  styleUrls: ['./solid-guage-chart.component.css']
})
export class SolidGuageChartComponent extends AbstractChart implements OnInit {
  data: any;
  shortNumberPipe = new ShortNumberPipe();

  constructor(private chartService: ChartService) {
    super();
  }

  ngOnInit(): void {
    let tmpThis = this;
 
    this.chartService.indicatorData.subscribe((iData: any) => {
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
  }

  ngAfterViewInit() {
    this.chart = Highcharts.chart({
      chart: {
        renderTo: 'container_' + this.indId,
        type: 'solidgauge',
        height: 140
      },
      pane: {
        center: ['50%', '75%'],
        size: '150%',
        startAngle: -90,
        endAngle: 90,
        background: [{
          backgroundColor:
            Highcharts.defaultOptions.legend.backgroundColor || '#EEE',
          innerRadius: '75%',
          outerRadius: '100%',
          shape: 'arc'
        }]
      },
      tooltip: {
        enabled: false
      },
      // the value axis
      yAxis: [
        {
          labels: {
            enabled: false
          },
          stops: [
            [0.01, '#134e7b']
          ],
          lineWidth: 0,
          tickWidth: 0,
          minorTickInterval: null,
          tickAmount: 2,
          min: 0,
          max: 1,
        }],
      plotOptions: {
        solidgauge: {
          innerRadius: '75%',
          dataLabels: {
            enabled: true,
            borderWidth: 0,
            y: -25,
            useHTML: true,
            format: '<div style="text-align:center">' +
                    '<span style="font-size:20px">{y}</span><br/>' +
                    '</div>'
          }
        }
      },
      credits: {
        enabled: false
      },
      series: []
      // [{
      //   type: 'solidgauge',
      //   data: [this.apiData]
      // }]
    });
  }

  

  prepareDataFromIndicatorData(data) {
    let seriesData = [];
    let categories;
    let seriesNames = data.map(s => s[this.legendCol]).filter((x, i, a) => a.indexOf(x) === i);
    seriesNames.forEach((s, i) => {
      let sData = {
        "name": s,
        "data": [data.filter(ds => ds[this.legendCol] == s)[0][this.yAxisCol]]
      }
      seriesData.push(sData);
    });

    return {
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
