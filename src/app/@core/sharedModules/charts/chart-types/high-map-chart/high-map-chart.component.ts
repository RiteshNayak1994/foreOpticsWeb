import { Component, OnInit } from '@angular/core';
import { ChartService } from '../../chart.service';
import { IndicatorsAs } from '../../chartConstants';
import { environment } from '../../../../../../environments/environment';
import { AbstractChart } from '../abstract-chart';
import * as Highcharts from "highcharts/highmaps";
import * as worldMap from "@highcharts/map-collection/custom/world.geo.json";

@Component({
  selector: 'app-high-map-chart',
  templateUrl: './high-map-chart.component.html',
  styleUrls: ['./high-map-chart.component.css']
})
export class HighMapChartComponent extends AbstractChart implements OnInit {
  apiData;
  data;

  constructor(private chartService: ChartService) {
    super();
  }

  ngOnInit(): void {
    let apiUrl = "https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/world-population.json";
    this.chartService.getUrlData(apiUrl).subscribe(data => {
      if (this.indId == 7) {
        if (data) {
          this.apiData = data;
          this.updateData(data);
        }
      }

    });

    this.chartService.selectedData.subscribe((obj: any) => {
      if (this.indId == 7) {
        this.selectedData = obj.selectedData;
        if (this.indicatorsAs == IndicatorsAs.RelCommonData) {
          this.removeSeries();
          this.updateData();
        }
      }
    });
  }

  ngAfterViewInit() {
    let tmpThis = this;
    if (this.indId == 6) {
      this.chart = Highcharts.mapChart({
        chart: {
          renderTo: 'container_' + this.indId,
          map: worldMap
        },
        credits: {
          enabled: false
        },
        title: {
          text: "Highmaps basic demo"
        },
        subtitle: {
          text:
            'Source map: <a href="http://code.highcharts.com/mapdata/custom/world.js">World, Miller projection, medium resolution</a>'
        },
        mapNavigation: {
          enabled: true,
          buttonOptions: {
            alignTo: "spacingBox"
          }
        },
        legend: {
          enabled: true
        },
        colorAxis: {
          min: 0
        },
        series: [
          {
            type: "map",
            name: "Random data",
            states: {
              hover: {
                color: "#BADA55"
              }
            },
            dataLabels: {
              enabled: true,
              format: "{point.name}"
            },
            allAreas: false,
            data: [
              ["fo", 0],
              ["um", 1],
              ["us", 2],
              ["jp", 3],
              ["sc", 4],
              ["in", 100],
              ["fr", 6],
              ["fm", 7],
              ["cn", 8],
              ["pt", 9],
              ["sw", 10],
              ["sh", 11],
              ["br", 12],
              ["ki", 13],
              ["ph", 14],
              ["mx", 15],
              ["es", 16],
              ["bu", 17],
              ["mv", 18],
              ["sp", 19],
              ["gb", 20],
              ["gr", 21],
              ["as", 22],
              ["dk", 23],
              ["gl", 24],
              ["gu", 25],
              ["mp", 26],
              ["pr", 27],
              ["vi", 28],
              ["ca", 29],
              ["st", 30],
              ["cv", 31],
              ["dm", 32],
              ["nl", 33],
              ["jm", 34],
              ["ws", 35],
              ["om", 36],
              ["vc", 37],
              ["tr", 38],
              ["bd", 39],
              ["lc", 40],
              ["nr", 41],
              ["no", 42],
              ["kn", 43],
              ["bh", 44],
              ["to", 45],
              ["fi", 46],
              ["id", 47],
              ["mu", 48],
              ["se", 49],
              ["tt", 50],
              ["my", 51],
              ["pa", 52],
              ["pw", 53],
              ["tv", 54],
              ["mh", 55],
              ["cl", 56],
              ["th", 57],
              ["gd", 58],
              ["ee", 59],
              ["ag", 60],
              ["tw", 61],
              ["bb", 62],
              ["it", 63],
              ["mt", 64],
              ["vu", 65],
              ["sg", 66],
              ["cy", 67],
              ["lk", 68],
              ["km", 69],
              ["fj", 70],
              ["ru", 71],
              ["va", 72],
              ["sm", 73],
              ["kz", 74],
              ["az", 75],
              ["tj", 76],
              ["ls", 77],
              ["uz", 78],
              ["ma", 79],
              ["co", 80],
              ["tl", 81],
              ["tz", 82],
              ["ar", 83],
              ["sa", 84],
              ["pk", 85],
              ["ye", 86],
              ["ae", 87],
              ["ke", 88],
              ["pe", 89],
              ["do", 90],
              ["ht", 91],
              ["pg", 92],
              ["ao", 93],
              ["kh", 94],
              ["vn", 95],
              ["mz", 96],
              ["cr", 97],
              ["bj", 98],
              ["ng", 99],
              ["ir", 100],
              ["sv", 101],
              ["sl", 102],
              ["gw", 103],
              ["hr", 104],
              ["bz", 105],
              ["za", 106],
              ["cf", 107],
              ["sd", 108],
              ["cd", 109],
              ["kw", 110],
              ["de", 111],
              ["be", 112],
              ["ie", 113],
              ["kp", 114],
              ["kr", 115],
              ["gy", 116],
              ["hn", 117],
              ["mm", 118],
              ["ga", 119],
              ["gq", 120],
              ["ni", 121],
              ["lv", 122],
              ["ug", 123],
              ["mw", 124],
              ["am", 125],
              ["sx", 126],
              ["tm", 127],
              ["zm", 128],
              ["nc", 129],
              ["mr", 130],
              ["dz", 131],
              ["lt", 132],
              ["et", 133],
              ["er", 134],
              ["gh", 135],
              ["si", 136],
              ["gt", 137],
              ["ba", 138],
              ["jo", 139],
              ["sy", 140],
              ["mc", 141],
              ["al", 142],
              ["uy", 143],
              ["cnm", 144],
              ["mn", 145],
              ["rw", 146],
              ["so", 147],
              ["bo", 148],
              ["cm", 149],
              ["cg", 150],
              ["eh", 151],
              ["rs", 152],
              ["me", 153],
              ["tg", 154],
              ["la", 155],
              ["af", 156],
              ["ua", 157],
              ["sk", 158],
              ["jk", 159],
              ["bg", 160],
              ["qa", 161],
              ["li", 162],
              ["at", 163],
              ["sz", 164],
              ["hu", 165],
              ["ro", 166],
              ["ne", 167],
              ["lu", 168],
              ["ad", 169],
              ["ci", 170],
              ["lr", 171],
              ["bn", 172],
              ["iq", 173],
              ["ge", 174],
              ["gm", 175],
              ["ch", 176],
              ["td", 177],
              ["kv", 178],
              ["lb", 179],
              ["dj", 180],
              ["bi", 181],
              ["sr", 182],
              ["il", 183],
              ["ml", 184],
              ["sn", 185],
              ["gn", 186],
              ["zw", 187],
              ["pl", 188],
              ["mk", 189],
              ["py", 190],
              ["by", 191],
              ["cz", 192],
              ["bf", 193],
              ["na", 194],
              ["ly", 195],
              ["tn", 196],
              ["bt", 197],
              ["md", 198],
              ["ss", 199],
              ["bw", 200],
              ["bs", 201],
              ["nz", 202],
              ["cu", 203],
              ["ec", 204],
              ["au", 205],
              ["ve", 206],
              ["sb", 207],
              ["mg", 208],
              ["is", 209],
              ["eg", 210],
              ["kg", 211],
              ["np", 212]
            ]
          }
        ]
      });
    }
    else if (this.indId == 7) {
      this.chart = Highcharts.mapChart({
        chart: {
          renderTo: 'container_' + this.indId,
          //borderWidth: 1,
          map: worldMap,
          events: {
            render() {
              if (tmpThis.data && (this.series == undefined || this.series.length <= 0))
                tmpThis.addSeries(this);
            }
          }
        },
        credits: {
          enabled: false
        },

        title: {
          text: 'World population 2013 by country'
        },

        subtitle: {
          text: 'Demo of Highcharts map with bubbles'
        },

        legend: {
          enabled: true
        },

        mapNavigation: {
          enabled: true,
          buttonOptions: {
            verticalAlign: 'bottom'
          }
        }

      });
    }

  }

  updateData(data = this.apiData) {
    this.data = this.prepareDataFromCommon(data);

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
    this.data.seriesData.forEach(sd => {
      chart.addSeries(sd, false);
    });

    chart.redraw();

  }

  prepareDataFromCommon(data) {
    return {
      seriesData: [
        {
          name: 'World',
          color: '#E0E0E0',
          enableMouseTracking: false,
          showInLegend: false
        },
        {
          type: 'mapbubble',
          name: 'Countries',
          joinBy: ['iso-a3', 'code3'],
          data: data,
          minSize: 4,
          maxSize: '12%',
          tooltip: {
            pointFormat: '{point.properties.hc-a2}: {point.z} thousands'
          }
        },
        {
          name: 'States',
          type: 'mappoint',
          color: "red",
          marker: {
            enabled: true,
            radius: 15
          },
          data: [{
            "name": "Gujarat",
            "lat": 22.7501,
            "lon": 71.3013,
          }, {
            "name": "Maharashtra",
            "lat": 19.4723,
            "lon": 75.46469999999999,
          }, {
            "name": "Delhi",
            "lat": 28.7041,
            "lon": 77.1025,
          },
          {
            "name": "Wisconsin",
            "lat": 44.500000,
            "lon": -89.500000,
          },
          {
            "name": "New York",
            "lat": 43.000000,
            "lon": -75.000000,
          },
          {
            "name": "New Jersey",
            "lat": 39.833851,
            "lon": -74.871826,
          }]
        },
        {
          name: 'Cities',
          type: 'mappoint',
          color: "green",
          marker: {
            enabled: true,
            symbol: "circle",
            radius: 10
          },
          data: [
            {
              "name": "Chennai",
              "lat": 13.0827,
              "lon": 80.2707,
            }, {
              "name": "Bangalore",
              "lat": 12.9716,
              "lon": 77.5946,
            },
            {
              "name": "Washington D.C.",
              "lat": 38.889931,
              "lon": -77.009003,
            },
            {
              "name": "Moscow",
              "lat": 55.7500,
              "lon": 37.6167,
            },
            {
              "name": "London",
              "lat": 51.507222,
              "lon": -0.1275,
            },
            {
              "name": "Beijing",
              "lat": 39.9167,
              "lon": 116.3833,
            }]
        },
        {
          name: 'Dry Past R Factor',
          type: 'mappoint',
          marker: {
            enabled: true,
            symbol: "url(" + environment.frontEndUrl + "/assets/risk_Icons/DR_PAST.png)",
            radius: 10
          },
          data: [
            {
              "lat": 13.0827,
              "lon": 80.2707,
            }]
        },
        {
          name: 'Dry R Factor',
          type: 'mappoint',
          marker: {
            enabled: true,
            symbol: "url(" + environment.frontEndUrl + "/assets/risk_Icons/DR.png)",
            radius: 10
          },
          data: [
            {
              "lat": 12.9716,
              "lon": 77.5946,
            }]
        },
        {
          name: 'EQ R Factor',
          type: 'mappoint',
          marker: {
            enabled: true,
            symbol: "url(" + environment.frontEndUrl + "/assets/risk_Icons/EQ.png)",
            radius: 10
          },
          data: [
            {
              "lat": 38.889931,
              "lon": -77.009003,
            }]
        },
        {
          name: 'FL PAST R Factor',
          type: 'mappoint',
          marker: {
            enabled: true,
            symbol: "url(" + environment.frontEndUrl + "/assets/risk_Icons/FL_PAST.png)",
            radius: 10
          },
          data: [
            {
              "lat": 55.7500,
              "lon": 37.6167,
            }]
        },
        {
          name: 'TC PAST R Factor',
          type: 'mappoint',
          marker: {
            enabled: true,
            symbol: "url(" + environment.frontEndUrl + "/assets/risk_Icons/TC_PAST.png)",
            radius: 10
          },
          data: [
            {
              "lat": 51.507222,
              "lon": -0.1275
            }]
        },
        {
          name: 'TC R Factor',
          type: 'mappoint',
          marker: {
            enabled: true,
            symbol: "url(" + environment.frontEndUrl + "/assets/risk_Icons/TC.png)",
            radius: 10
          },
          data: [
            {
              "lat": 39.9167,
              "lon": 116.3833,
            }]
        },
        {
          name: 'VO PAST R Factor',
          type: 'mappoint',
          marker: {
            enabled: true,
            symbol: "url(" + environment.frontEndUrl + "/assets/risk_Icons/VO_PAST.png)",
            radius: 10
          },
          data: [
            {
              "lat": 43.000000,
              "lon": -75.000000,
            }]
        },
        {
          name: 'VO R Factor',
          type: 'mappoint',
          marker: {
            enabled: true,
            symbol: "url(" + environment.frontEndUrl + "/assets/risk_Icons/VO.png)",
            radius: 10
          },
          data: [
            {
              "lat": 39.833851,
              "lon": -74.871826,
            }]
        }
      ]
    }
  }

}
