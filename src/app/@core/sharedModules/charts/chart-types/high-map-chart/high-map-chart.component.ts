import { Component, OnInit } from '@angular/core';
import { ChartService } from '../../chart.service';
import { AbstractChart } from '../abstract-chart';
import * as Highcharts from "highcharts/highmaps";
import exporting from "highcharts/modules/exporting";
import more from "highcharts/highcharts-more";
import data from "highcharts/modules/data";
import offlineExporting from "highcharts/modules/offline-exporting";
import * as worldMap from "@highcharts/map-collection/custom/world.geo.json";
import { highRisk, lowRisk, mediumRisk } from './dummyData';
import { themes } from '../../chartConstants';
import { ThemeService } from '../../../../sharedServices/theme.service';

more(Highcharts);
// data(Highcharts)
// exporting(Highcharts);
// offlineExporting(Highcharts);
@Component({
  selector: 'app-high-map-chart',
  templateUrl: './high-map-chart.component.html',
  styleUrls: ['./high-map-chart.component.css']
})
export class HighMapChartComponent extends AbstractChart implements OnInit {

  constructor(
    private chartService: ChartService,
    private themeService: ThemeService
    ) {
    super();
  }

  ngOnInit(): void { }

  ngAfterViewInit() {
    let tempThis = this;
    this.chart = Highcharts.mapChart({
      chart: {
        renderTo: 'container_0021',
        map: worldMap,
        width: 1500,
        height: 650,
        marginBottom: 45,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
      },
      title:{
        text: ''
      },
      credits: {
        enabled: false
      },
      mapNavigation: {
        enabled: true,
        buttonOptions: {
          verticalAlign: 'bottom'
        }
      },
      legend: {
        enabled: true
      },
      tooltip: {
        headerFormat: '',
        pointFormat: '{point.name}'
      },
      plotOptions: {
        map: {

          dataLabels: {
            enabled: false
          }
        }
      },
      series: [
        {
          type: 'map',
          name: 'countries',
          color: '#eef2f6',
          colorAxis: false,
          showInLegend: false
        },
        {
          type: 'mapbubble',
          name: 'Suppliers with Higher Risk',
          joinBy: ['iso-a3', 'code3'],
          data: highRisk,
          color: '#DC3844',
          minSize: 5,
          maxSize: '8%',
          tooltip: {
            pointFormat: '{point.supplierName}: {point.dam:.2f}'
          }
        },
        {
          type: 'mapbubble',
          name: 'Suppliers with Moderate Risk',
          joinBy: ['iso-a3', 'code3'],
          data: mediumRisk,
          color: '#fdb813',
          minSize: 5,
          maxSize: '8%',
          tooltip: {
            pointFormat: '{point.supplierName}: {point.dam:.2f}'
          }
        },
        {
          type: 'mapbubble',
          name: 'Suppliers with Lower Risk',
          joinBy: ['iso-a3', 'code3'],
          data: lowRisk,
          color: '#8ed16f',
          minSize: 5,
          maxSize: '8%',
          tooltip: {
            pointFormat: '{point.supplierName}: {point.dam:.2f}'
          }
        }
      ]
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
}
