import { Component, OnInit, SimpleChanges } from '@angular/core';
import * as Highcharts from 'highcharts';
import { ShortNumberPipe } from '../../../../../@theme/pipes/short-number/short-number.pipe';
import { ChartService } from '../../chart.service';
import { colors, IndicatorsAs } from '../../chartConstants';
import { AbstractChart } from '../abstract-chart';

@Component({
    selector: 'app-pie-chart',
    templateUrl: './pie-chart.component.html',
    styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent extends AbstractChart implements OnInit {

    data;
    shortNumberPipe = new ShortNumberPipe();

    constructor(private chartService: ChartService) {
        super();
    }

    ngOnInit(): void {
        if (this.indicatorsAs == IndicatorsAs.RelCommonData)
            this.setSelectedData(this.indicatorsAs == IndicatorsAs.RelCommonData ? "Oceania" : "");


        if (this.dataType == "dynamic") {
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

            this.chartService.filterConfig.subscribe((iData: any) => {
                if (iData.indicatorId == this.indId) {
                    if (iData.filterName == "quantitycost") {
                        this.yAxisCol = iData.filterValue;
                        this.removeSeries();
                        this.data = this.prepareDataFromIndicatorData(this.apiData);
                        if (this.chart && (this.chart.series == undefined || this.chart.series.length <= 0)) {
                            this.addSeries(this.chart);
                        }
                    }
                }
            });
        }
    }

    ngAfterViewInit() {
        let tmpThis = this;
        this.chart = Highcharts.chart({
            chart: {
                // Edit chart spacing
                spacingBottom: 0,
                spacingTop: 0,
                spacingLeft: 0,
                spacingRight: 0,
                margin: 0,
                // Explicitly tell the width and height of a chart
                // width: 250,
                // height: 280,
                renderTo: 'container_' + this.indId,
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie',
                events: {
                    render() {
                        if (tmpThis.data && (this.series == undefined || this.series.length <= 0))
                            tmpThis.addSeries(this);
                    }
                }
            },
            title: {
                text: [IndicatorsAs.IndeCommonData, IndicatorsAs.RelCommonData].includes(tmpThis.indicatorsAs) ? null : 'Browser market shares in January, 2018'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            legend: {
                align: 'right',
                verticalAlign: 'top',
                layout: 'vertical',
                x: 0,
                y: 50
            },
            plotOptions: {
                pie: {
                    colors: colors,
                    allowPointSelect: true,
                    innerSize: this.selectedView == 'donut' ? '60%' : 0,
                    //size:'75%',
                    cursor: 'pointer',
                    showInLegend: true,
                    center: ["40%", "50%"],
                    dataLabels: {
                        enabled: true,
                        color: '#000',
                        position:'right',
                        x: 0,
                        y: 0,
                        padding: 0,
                        connectorPadding: 0,
                        distance: '25%',
                        formatter: function () {
                            return (tmpThis.yAxisCol == 'cost' ? '$' : '') + tmpThis.shortNumberPipe.transform(this.y) + '<br/> (' + this.percentage.toFixed(2) + '%)';
                        }
                    }
                }
            },
            series: this.dataType == 'static' ? [this.apiData] : null,
            credits: {
                enabled: false
            }
        });
    }

    removeSeries() {
        let sLen = this.chart.series.length;
        for (var i = 0; i < sLen; i++) {
            let s = this.chart.series[0];
            s.remove(false);
        }
    }

    addSeries(chart) {
        this.data.seriesData.forEach(sd => {
            chart.addSeries(sd, false);
        });

        chart.redraw();

    }

    prepareDataFromIndicatorData(data) {
        let seriesData = [];
        let pdata = data.map(d => ({
            "name": d[this.xAxisCol],
            "y": d[this.yAxisCol],
        }));
        let sData = {
            "name": this.legendCol,
            "data": pdata,
            "colorByPoint": true
        }
        seriesData.push(sData);

        return {
            seriesData: seriesData,
        }
        // let tmpThis = this;
        // let seriesData = data.map(d => ({
        //     "name": d[this.xAxisCol],
        //     "y": d[this.yAxisCol],
        // }));

        // return {
        //     seriesData: [{
        //         "name": data[0][this.parentCol],
        //         "colorByPoint": true,
        //         "data": seriesData
        //     }]
        // }
    }

    prepareDataFromCommon(data) {
        let tmpThis = this;
        let seriesName = data[0].Years[0].Year
        let seriesData = data.map(d => ({
            "name": d.country,
            "selected": this.indicatorsAs == IndicatorsAs.RelCommonData && d.country == this.selectedData,
            "sliced": this.indicatorsAs == IndicatorsAs.RelCommonData && d.country == this.selectedData,
            "y": (d.Years.find(y => y.Year == seriesName)["12MonthsData"]).reduce((a, b) => a + b),
            "events": {
                "select": function () {
                    tmpThis.setSelectedData(this.name);
                },
                "unselect": function () {
                    if (this.state == "select")
                        tmpThis.setSelectedData(undefined);
                }
            }
        }));

        return {
            seriesData: [{
                "name": seriesName,
                "colorByPoint": true,
                "data": seriesData
            }]
        }
    }

    setSelectedData(data) {
        this.selectedData = data;
        this.chartService.selectedData.next({
            selectedData: this.selectedData
        });
    }

}
