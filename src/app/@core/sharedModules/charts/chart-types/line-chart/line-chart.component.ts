import { Component, OnDestroy, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts/highstock';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { ShortNumberPipe } from '../../../../../@theme/pipes/short-number/short-number.pipe';
import { ChartService } from '../../chart.service';
import { colors, IndicatorsAs } from '../../chartConstants';
import { AbstractChart } from '../abstract-chart';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent extends AbstractChart implements OnInit, OnDestroy {
  data;
  dataMin;
  dataMax;
  subScriptionList: Subscription = new Subscription();
  shortNumberPipe = new ShortNumberPipe();
  selectedDataView = "Monthly";

  constructor(private chartService: ChartService) {
    super();
  }

  ngOnInit(): void {
    let subscription;
    if (this.dataType == "dynamic") {
      subscription = this.chartService.indicatorData.subscribe((iData: any) => {
        if (iData.indicatorId == this.indId) {
          this.selectedDataView = iData.dataView || this.selectedDataView;
          this.apiData = iData.indicatorData;
          this.data = this.prepareDataFromIndicatorData(this.apiData);
          if (this.chart) {
            if (this.chart.series && this.chart.series.length > 0)
              this.removeSeries();

            if (this.data.seriesData.length > 0)
              this.addSeries(this.chart);

          }
          // if (this.chart && (this.chart.series == undefined || this.chart.series.length <= 0)) {
          //   this.addSeries(this.chart);
          // }
        }

      });
      this.subScriptionList.add(subscription);

      // this.chartService.filterConfig.subscribe((iData: any) => {
      //   if (iData.indicatorId == this.indId) {
      //     if (iData.filterName == "quantitycost") {
      //       this.yAxisCol = iData.filterValue;
      //       this.removeSeries();
      //       this.data = this.prepareDataFromIndicatorData(this.apiData);
      //       if (this.chart && (this.chart.series == undefined || this.chart.series.length <= 0)) {
      //         this.addSeries(this.chart);
      //       }
      //     }
      //   }
      // });
    }
    else {
      let chartDataName = this.indicatorsAs == IndicatorsAs.Independent ? 'lineChartData' :
        this.indicatorsAs == IndicatorsAs.MasterDetail ? 'masterMasterDetailData' : 'commonData';

      let parameters = [
        {
          Name: '@ChartDataName',
          Type: 'string',
          Value: chartDataName,
          ObjectValue: undefined
        }
      ];

      subscription = this.chartService.getWidgetsData(this.indId, parameters).then((wdgtsData: any) => {
        if (wdgtsData) {
          wdgtsData = JSON.parse(JSON.parse(wdgtsData)[0].DataValue)
          this.apiData = wdgtsData;
          this.updateData(wdgtsData);
        }
      });
      this.subScriptionList.add(subscription);

      subscription = this.chartService.selectedData.subscribe((obj: any) => {
        this.selectedData = obj.selectedData;
        if (this.indicatorsAs == IndicatorsAs.RelCommonData) {
          this.removeSeries();
          this.updateData();
        }

      });
      this.subScriptionList.add(subscription);
    }

  }

  ngAfterViewInit() {
    let tmpThis = this;

    Highcharts.setOptions({
      lang: {
        numericSymbols: ["k", "M", "B", "T", "P", "E"]
      }
    });

    this.chart = Highcharts.chart('container_' + this.indId, {
      chart: {
        events: {
          render() {
            if (tmpThis.data && (this.series == undefined || this.series.length <= 0))
              tmpThis.addSeries(this);
          }
        }
      },
      colors: colors,
      title: {
        text: ''// 'Solar Employment Growth by Sector, 2010-2016'
      },
      rangeSelector: {
        enabled: false,
        allButtonsEnabled: true,
        inputPosition: {
          align: 'left',
          x: 0,
          y: 0
        },
        buttonPosition: {
          align: 'right',
          x: 0,
          y: 0
        },
      },
      yAxis: {
        title: {
          // text: [IndicatorsAs.IndeCommonData, IndicatorsAs.RelCommonData].includes(tmpThis.indicatorsAs) ? null : 'Number of Employees'
          text: this.yAxisCol
        },
        // labels: {
        //   formatter: function () {
        //     let value = this.value.toString();
        //     if (tmpThis.yAxisCol == "DAM")
        //       value = Highcharts.numberFormat(this.value as number, 2);
        //     //}
        //     return value;
        //   }
        // }
      },

      xAxis: {
        //type: [IndicatorsAs.IndeCommonData, IndicatorsAs.RelCommonData].includes(tmpThis.indicatorsAs) ? "datetime" : "linear",
        type: "datetime",
        labels: {
          formatter() {
            //return [IndicatorsAs.IndeCommonData, IndicatorsAs.RelCommonData].includes(tmpThis.indicatorsAs) ? Highcharts.dateFormat('%b - %Y', this.value) : this.value.toString();
            //return Highcharts.dateFormat('%b - %Y', this.value as number);

            let formattedValue = "";
            if (tmpThis.selectedDataView == "Monthly")
              formattedValue = moment(this.value).format('MMM YY');
            else if (tmpThis.selectedDataView == "Weekly")
              formattedValue = moment(this.value).format('DD MMM') + '-' + moment(this.value).add(6, 'days').format('DD MMM');
            else if (tmpThis.selectedDataView == "Daily")
              formattedValue = moment(this.value).format('DD MMM');

            return formattedValue;
          }
        },
        accessibility: {
          enabled: tmpThis.indicatorsAs == IndicatorsAs.IndeCommonData,
          rangeDescription: 'Range: 2010 to 2017'
        }

        //startOnTick: true,
        //endOnTick: true,
        //tickAmount: 5,
      },
      tooltip: {
        // formatter: function () {
        //   return moment(this.x).format('MMM - YY') + '<br/>' + tmpThis.shortNumberPipe.transform(this.y);
        // }
        shared: true,
        formatter: function () {
          //   return this.points.reduce(function (s, point) {
          //     return s + '<br/>' + point.series.name + ': ' +
          //       tmpThis.shortNumberPipe.transform(point.y);
          // }, '<b>' + moment(this.x).format('MMM - YY') + '</b>');
          let formattedDateValue = "";
          if (tmpThis.selectedDataView == "Monthly")
            formattedDateValue = moment(this.x).format('MMM YY');
          else if (tmpThis.selectedDataView == "Weekly")
            formattedDateValue = moment(this.x).format('DD MMM') + ' - ' + moment(this.x).add(6, 'days').format('DD MMM');
          else if (tmpThis.selectedDataView == "Daily")
            formattedDateValue = moment(this.x).format('DD MMM');

          let DemandPoint = this.points.find(ps => ps.series.name == "Demand");
          let SupplyPoint = this.points.find(ps => ps.series.name == "Supply");

          return formattedDateValue + '<br/>' +
            'Demand : ' + tmpThis.shortNumberPipe.transform(DemandPoint.y) + '<br/>' +
            'Supply : ' + tmpThis.shortNumberPipe.transform(SupplyPoint.y);
        }
      },
      legend: {
        layout: 'vertical',
        align: 'left',
        verticalAlign: 'top',
        x: 100,
        y: 10,
        floating: true,
        borderWidth: 1,
        backgroundColor:
          Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF'
      },

      plotOptions: {
        series: {
          label: {
            connectorAllowed: false
          },
          // events: {
          //   legendItemClick: function () {
          //     tmpThis.chart.series.filter(s => s.name ==  this.name)[1].setVisible(!this.visible);
          //   }
          // }
          //    pointStart: [IndicatorsAs.IndeCommonData, IndicatorsAs.RelCommonData].includes(tmpThis.indicatorsAs) ? 0 : 2010
        }
      },
      credits: {
        enabled: false
      },

      responsive: {
        rules: [{
          condition: {
            maxWidth: 500
          },
          chartOptions: {
            legend: {
              layout: 'horizontal',
              align: 'center',
              verticalAlign: 'bottom'
            }
          }
        }]
      },

      // xAxis: {
      //     type: 'datetime'
      // },
      series: []
      //  [{
      //     type: 'line',
      //     data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
      //     pointStart: Date.UTC(2015, 0),
      //     pointIntervalUnit: 'month',
      //     zoneAxis: 'x',
      //     zones: [{
      //         value: Date.UTC(2015, 5),
      //         color: 'red'
      //     } ]
      // }]
    });

    // this.chart = Highcharts.chart({
    //   chart: {
    //     renderTo: 'container_' + this.indId,
    //     type: 'line',
    //     events: {
    //       render() {
    //         if (tmpThis.data && (this.series == undefined || this.series.length <= 0))
    //           tmpThis.addSeries(this);
    //       }
    //     }
    //   },
    //   colors: colors,
    //   title: {
    //     text: ''// 'Solar Employment Growth by Sector, 2010-2016'
    //   },

    //   // subtitle: {
    //   //   text: 'Source: thesolarfoundation.com'
    //   // },

    //   yAxis: {
    //     title: {
    //       // text: [IndicatorsAs.IndeCommonData, IndicatorsAs.RelCommonData].includes(tmpThis.indicatorsAs) ? null : 'Number of Employees'
    //       text: this.yAxisCol
    //     },
    //     labels: {
    //       formatter: function () {
    //         let value = this.value.toString();
    //         if (tmpThis.yAxisCol == "DAM")
    //           value = Highcharts.numberFormat(this.value, 2);
    //         //}
    //         return value;
    //       }
    //     }
    //   },

    //   xAxis: {
    //     //type: [IndicatorsAs.IndeCommonData, IndicatorsAs.RelCommonData].includes(tmpThis.indicatorsAs) ? "datetime" : "linear",
    //     type: "datetime",
    //     labels: {
    //       formatter() {
    //       //return [IndicatorsAs.IndeCommonData, IndicatorsAs.RelCommonData].includes(tmpThis.indicatorsAs) ? Highcharts.dateFormat('%b - %Y', this.value) : this.value.toString();
    //         return Highcharts.dateFormat('%b - %Y', this.value);
    //       }
    //     },
    //     accessibility: {
    //       enabled: tmpThis.indicatorsAs == IndicatorsAs.IndeCommonData,
    //       rangeDescription: 'Range: 2010 to 2017'
    //     },
    //     startOnTick: true,
    //     endOnTick: true,
    //     tickAmount: 5,
    //     //   tickPositioner: function () {
    //     //     let e;
    //     //     e = this;
    //     //     let positions = [],
    //     //         tick = Math.floor(tmpThis.dataMin),
    //     //         increment = Math.ceil((tmpThis.dataMax - tmpThis.dataMin) / 5);

    //     //     if (tmpThis.dataMax !== null && tmpThis.dataMin !== null) {
    //     //         for (tick; tick - increment <= tmpThis.dataMax; tick += increment) {
    //     //             positions.push(tick);
    //     //         }
    //     //     }
    //     //     return positions;
    //     // }
    //   },

    //   legend: {
    //     layout: 'horizontal',
    //     align: 'center',
    //     verticalAlign: 'bottom'
    //   },

    //   plotOptions: {
    //     series: {
    //       label: {
    //         connectorAllowed: false
    //       },
    //       pointStart: [IndicatorsAs.IndeCommonData, IndicatorsAs.RelCommonData].includes(tmpThis.indicatorsAs) ? 0 : 2010
    //     }
    //   },
    //   credits: {
    //     enabled: false
    //   },
    //   // series: [{
    //   //   name: 'Installation',
    //   //   type: 'line',
    //   //   data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]
    //   // }, {
    //   //   name: 'Manufacturing',
    //   //   type: 'line',
    //   //   data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434]
    //   // }, {
    //   //   name: 'Sales & Distribution',
    //   //   type: 'line',
    //   //   data: [11744, 17722, 16005, 19771, 20185, 24377, 32147, 39387]
    //   // }, {
    //   //   name: 'Project Development',
    //   //   type: 'line',
    //   //   data: [null, null, 7988, 12169, 15112, 22452, 34400, 34227]
    //   // }, {
    //   //   name: 'Other',
    //   //   type: 'line',
    //   //   data: [12908, 5948, 8105, 11248, 8989, 11816, 18274, 18111]
    //   // }],

    //   responsive: {
    //     rules: [{
    //       condition: {
    //         maxWidth: 500
    //       },
    //       chartOptions: {
    //         legend: {
    //           layout: 'horizontal',
    //           align: 'center',
    //           verticalAlign: 'bottom'
    //         }
    //       }
    //     }]
    //   }

    // });
  }

  ngOnDestroy() {
    this.subScriptionList.unsubscribe();
    this.chart = undefined;
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
    if (this.data.title)
      chart.setTitle({ text: this.data.title }, false);


    let tickIntrvl;
    if (this.selectedDataView == "Daily")
      tickIntrvl = 24 * 3600 * 1000;
    else if (this.selectedDataView == "Weekly")
      tickIntrvl = 7 * (24 * 3600 * 1000);

    chart.xAxis[0].update({
      labels: { rotation: this.selectedDataView == "Monthly" ? 0 : 315 },
      tickInterval: tickIntrvl
    }, false);


    this.data.seriesData.forEach(sd => {
      chart.addSeries(sd, false);
    });

    // this.dataMin = new Date(this.apiData[0].damDate).getTime();
    // this.dataMax = new Date(this.apiData[this.apiData.length -1].damDate).getTime();
    // chart.xAxis[0].setExtremes(this.dataMin, this.dataMax,false);

    chart.redraw();

  }

  prepareDataFromIndicatorData(data) {
    let tmpThis = this;
    let seriesNames = this.apiData.map(s => s[this.legendCol]).filter((x, i, a) => a.indexOf(x) === i);
    let seriesData = [];
    let counter = 0;
    seriesNames.forEach((s, i) => {
      //let values = data.filter(ds => ds[this.legendCol] == s).filter(d => new Date(d[this.xAxisCol]).getMonth() >= new Date().getMonth());
      if (this.subLegendCol && this.subLegendCol.length > 0) {

        this.subLegendCol.forEach((sl, j) => {
          let ser = this.prepareSeriesObjForIndicatoData(s, sl, j, sl == "DemandQty" ? "Demand" : "Supply", counter);
          seriesData.push(ser);
          counter++;
        });

      }
      else {
        let ser = this.prepareSeriesObjForIndicatoData(s, this.yAxisCol, i, s, i);
        seriesData.push(ser);
      }
    });

    return {
      seriesData: seriesData,
    }
  }

  prepareSeriesObjForIndicatoData(s, yAxisCol, sIndex, sName, colorCntr) {
    let currentDate = new Date();

    let weekDay = currentDate.getDay() || 7;
    let year = currentDate.getFullYear();
    let month = currentDate.getMonth();
    let date = currentDate.getDate();
    let hours = currentDate.getHours();
    let minutes = currentDate.getMinutes();
    
    let maxDateMonth = new Date(Math.max(...this.apiData.map(ad=> new Date(ad["DSDate"])))).getMonth();
    
    let firstZoneValue = new Date(year, (month == maxDateMonth ? month - 1 : month), 1, 0, 0, 1).getTime();

    if (this.selectedDataView == "Weekly") {
      let dateToBeSet =  date - (weekDay - 1);
      firstZoneValue = new Date(new Date(currentDate.setDate(dateToBeSet)).setHours(0)).setMinutes(1);
    }
    else if (this.selectedDataView == "Daily") {
      firstZoneValue = new Date(year, month, date, hours, minutes + 1).getTime();
    }

    let sData = {
      name: sName,
      type: 'line',
      data: this.apiData.filter(ds => ds[this.legendCol] == s).map(sData => ([new Date(sData[this.xAxisCol]).getTime(), sData[yAxisCol]])),
      zoneAxis: 'x',
      zones: [{
        value: firstZoneValue,
        color: colors[colorCntr]
      },
      {
        color: '#FFA600'
      }]
    }
    return sData;
  }

  prepareDataFromCommon(data) {
    //"data": data.map(d => (d.Years.find(y => y.Year == '1800')["12MonthsData"]).reduce((a, b) => a + b)
    //data.map(d => (d.Years.find(y => y.Year == '1800')["12MonthsData"]).reduce((a, b) => a + b))
    //data[0].Years.reduce((a,b) => {return { "12MonthsData": a["12MonthsData"].concat(b["12MonthsData"]) };})
    //new Date(1800,00,01).getTime()
    //   data.forEach(c => { 
    //     c.Years.forEach(y => {
    //       y["12MonthsData"] = y["12MonthsData"].map((v,i) => [new Date(y.year,i,01).getTime(),v])          
    //     });
    // });
    let seriesData = [];
    let title = null;
    if (this.selectedData == undefined || this.selectedData.length <= 0) {

      data.forEach(c => {
        let sData = { "name": c.country, "data": [] }
        c.Years.forEach(y => {
          sData["data"] = sData["data"].concat(y["12MonthsData"].map((v, i) => [new Date(y.Year, i, 1).getTime(), v]))
        });
        seriesData.push(sData);
      });
    }
    else {
      data = data.find(d => d.country == (this.selectedData || d.country));
      title = this.selectedData;
      data.Years.forEach(y => {
        let sData = { "name": y.Year, "data": [] };
        sData["data"] = sData["data"].concat(y["12MonthsData"].map((v, i) => [new Date(y.Year, i, 1).getTime(), v]));
        seriesData.push(sData);
      });
    }

    // data.forEach(c => {
    //   c["seriesdata"] = []
    //   c.Years.forEach(y => {
    //     c["seriesdata"] = c["seriesdata"].concat(y["12MonthsData"].map((v, i) => [new Date(y.Year, i, 01).getTime(), v]))
    //   });
    // });
    // let categories = data.map(d => d.country);
    // let years = data.map(d => d.Years.map(y => y.Year))[0];
    // let seriesData = years.map(ys => ({ "name": "Year " + ys, "data": data.map(d => (d.Years.find(y => y.Year == ys)["12MonthsData"]).reduce((a, b) => a + b)) }));

    return {
      seriesData: seriesData,
      title: title
    }
  }
}
