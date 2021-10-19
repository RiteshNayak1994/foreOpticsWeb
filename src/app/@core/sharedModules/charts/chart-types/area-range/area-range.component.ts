import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import * as moment from 'moment';
import { ShortNumberPipe } from '../../../../../@theme/pipes/short-number/short-number.pipe';
import { ChartService } from '../../chart.service';
import { colors } from '../../chartConstants';
import { AbstractChart } from '../abstract-chart';

@Component({
  selector: 'app-area-range',
  templateUrl: './area-range.component.html',
  styleUrls: ['./area-range.component.scss']
})
export class AreaRangeComponent extends AbstractChart implements OnInit {

  data: any;
  shortNumberPipe = new ShortNumberPipe();

  constructor(private chartService: ChartService) {
    super();
  }

  ngOnInit(): void {
    let tmpThis = this;
    Highcharts.setOptions({
      lang: {
        numericSymbols: ["k", "M", "B", "T", "P", "E"]
      }
    });
    
    let options: any = {
      chart: {
        renderTo: 'container',
        type: 'arearange',
        zoomType: 'x',
        scrollablePlotArea: {
          minWidth: 600,
          scrollPositionX: 1
        }
      },
      colors: colors,
      yAxis: {
        title: {
          // text: [IndicatorsAs.IndeCommonData, IndicatorsAs.RelCommonData].includes(tmpThis.indicatorsAs) ? null : 'Number of Employees'
          text: this.yAxisCol == "MergeData" ? "Qty" : this.yAxisCol
        },
        // labels: {
        //   formatter: function () {
        //     let value = this.value.toString();
        //     if (tmpThis.yAxisCol == "MergeData")
        //       value = Highcharts.numberFormat(this.value, 2);
        //     //}
        //     return value;
        //   }
        // }
      },
      xAxis: {
        type: 'datetime',
        //startOnTick: true,
        //endOnTick: true,
        //tickAmount: 5,
        labels: {
          formatter() {
            //return Highcharts.dateFormat('%b - %Y', this.value as number);
            return moment(this.value).format('MMM - YY')
          }
        },
      },
      tooltip: {
        crosshairs: true,
        //shared: true,
        // valueSuffix: '°C',
        // xDateFormat: '%A, %b %e'
        formatter: function () {
        //   return this.points.reduce(function (s, point) {
        //     return s + '<br/>' + point.series.name + ': ' +
        //       tmpThis.shortNumberPipe.transform(point.y);
        // }, '<b>' + moment(this.x).format('MMM - YY') + '</b>');
          return moment(this.x).format('MMM - YY') + '<br/>' + 
                'Demand : ' + tmpThis.shortNumberPipe.transform(this.point.options.low) + '<br/>' + 
                'Supply : ' + tmpThis.shortNumberPipe.transform(this.point.options.high);
        }
      },
      credits: {
        enabled: false
      }
    }

    this.chart = Highcharts.chart(options);
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
    // this.apiData = areaRangeData;
    // this.xAxisCol = 'xAxisCol';
    // this.yAxisCol = 'yAxisCol';
    // this.chart = Highcharts.chart(options);
    // this.data = this.prepareDataFromIndicatorData(this.apiData);
    // this.addSeries(this.chart);
  }

  prepareDataFromIndicatorData(data) {
    let seriesData = [];
    let categories;
    let seriesNames = data.map(s => s[this.legendCol]).filter((x, i, a) => a.indexOf(x) === i);
    seriesNames.forEach((s, i) => {
      let sData = {
        "name": s,
        "data": data.filter(ds => ds[this.legendCol] == s).map(sData => ([new Date(sData[this.xAxisCol]).getTime(), ...JSON.parse(sData[this.yAxisCol])]))
      }
      seriesData.push(sData);
    });

    return {
      seriesData: seriesData,
    }
    // let seriesNames = data;
    // let seriesData = [];
    // let tempSeries = [];
    // seriesNames.forEach((sData) => {
    //   tempSeries.push([sData[this.xAxisCol],...sData[this.yAxisCol]]);
    // });
    // let chartData = {
    //   "name": "Temperature",
    //   "data": tempSeries
    // }
    // seriesData.push(chartData);
    // return {
    //   seriesData: seriesData,
    // }
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
