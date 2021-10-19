import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LineChartComponent } from './line-chart/line-chart.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { ColumnChartComponent } from './column-chart/column-chart.component';
import { GuageChartComponent } from './guage-chart/guage-chart.component';
import { SolidGuageChartComponent } from './solid-guage-chart/solid-guage-chart.component';
import { HighMapChartComponent } from './high-map-chart/high-map-chart.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { CandlestickChartComponent } from './candlestick-chart/candlestick-chart.component';
import { AreaRangeComponent } from './area-range/area-range.component';
import { ErrorBarChartComponent } from './error-bar-chart/error-bar-chart.component';
import { BasicAreaChartComponent } from './basic-area-chart/basic-area-chart.component';
import { SplineChartComponent } from './spline-chart/spline-chart.component';
import { HeatMapChartComponent } from './heat-map-chart/heat-map-chart.component';

@NgModule({
  declarations: [
    LineChartComponent,
    PieChartComponent,
    BarChartComponent,
    ColumnChartComponent,
    GuageChartComponent,
    SolidGuageChartComponent,
    HighMapChartComponent,
    CandlestickChartComponent,
    AreaRangeComponent,
    ErrorBarChartComponent,
    BasicAreaChartComponent,
    SplineChartComponent,
    HeatMapChartComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    HighchartsChartModule
  ],
  exports: [
    LineChartComponent,
    PieChartComponent,
    BarChartComponent,
    ColumnChartComponent,
    GuageChartComponent,
    SolidGuageChartComponent,
    HighMapChartComponent,
    CandlestickChartComponent,
    AreaRangeComponent,
    ErrorBarChartComponent,
    BasicAreaChartComponent,
    SplineChartComponent,
    HeatMapChartComponent
  ],
  entryComponents: [
    LineChartComponent,
    PieChartComponent,
    BarChartComponent,
    ColumnChartComponent,
    GuageChartComponent,
    SolidGuageChartComponent,
    HighMapChartComponent,
    CandlestickChartComponent,
    AreaRangeComponent,
    ErrorBarChartComponent,
    BasicAreaChartComponent,
    SplineChartComponent,
    HeatMapChartComponent
  ]
})
export class ChartTypesModule { }
