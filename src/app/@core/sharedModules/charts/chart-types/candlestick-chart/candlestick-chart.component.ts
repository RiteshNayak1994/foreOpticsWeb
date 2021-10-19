import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts/highstock';
import { ChartService } from '../../chart.service';
import { colors } from '../../chartConstants';
import { AbstractChart } from '../abstract-chart';
@Component({
  selector: 'app-candlestick-chart',
  templateUrl: './candlestick-chart.component.html',
  styleUrls: ['./candlestick-chart.component.scss']
})
export class CandlestickChartComponent extends AbstractChart implements OnInit {

  data: any;

  constructor(private chartService: ChartService) {
    super();
  }

  
  
  ngOnInit() {
    let tmpThis = this;
    let options: any = {
      chart: {
        renderTo: 'container',
        type: 'candlestick'
      },
      colors: colors,
      xAxis: {
        type: 'category',
        labels: {
          // formatter: function () {
          //   return Highcharts.dateFormat('%e %b %y', this.value);
          // }
        },
        startOnTick: true,
        endOnTick: true,
        tickAmount: 5
      },
      yAxis: {
        title: {
          // text: [IndicatorsAs.IndeCommonData, IndicatorsAs.RelCommonData].includes(tmpThis.indicatorsAs) ? null : 'Number of Employees'
          text: this.yAxisCol == "joinedData" ? "DAM" : this.yAxisCol
        },
        labels: {
          formatter: function () {
            let value = this.value.toString();
            if (tmpThis.yAxisCol == "joinedData")
              value = Highcharts.numberFormat(this.value, 2);
            //}
            return value;
          }
        }
      },
      credits: {
        enabled: false
      },
      tooltip: {
        crosshairs: false,
        formatter: function () {
          return '<span style="color:'+ this.series.color +'">●</span> <b> ' + this.series.name + '</b><br/>' +
                  'Open: ' + this.point.options.open + '<br/>' + 
                  'Median: ' + this.point.options.high + '<br/>' +
                  'Close: ' + this.point.options.close + '<br/>';
        }
      },
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
    // this.apiData = candlestickData;
    // this.xAxisCol = 'x-axis-col';
    // this.yAxisCol = 'y-axis-col';
    // this.chart = Highcharts.chart(this.options);
    // this.data = this.prepareDataFromIndicatorData(this.apiData);
    // this.addSeries(this.chart);
  }

  prepareDataFromIndicatorData(data) {
    // let seriesNames = data;
    // let seriesData = [];
    // seriesNames.forEach((s, i) => {
    //   let sData = {
    //     "name": "series" + i,
    //     "data": data.map(sData => ([sData[this.xAxisCol], ...sData[this.yAxisCol]]))
    //   }
    //   seriesData.push(sData);
    // });
    let seriesData = [];
    let categories;
    let seriesNames = data.map(s => s[this.legendCol]).filter((x, i, a) => a.indexOf(x) === i);
    seriesNames.forEach((s, i) => {
      if (i == 0)
        categories = data.filter(ds => ds[this.legendCol] == s).map(sData => sData[this.xAxisCol]);

      let sData = {
        "name": s,
        "data": data.filter(ds => ds[this.legendCol] == s).map(sData => ([...JSON.parse(sData[this.yAxisCol])]))
      }
      seriesData.push(sData);
    });

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
