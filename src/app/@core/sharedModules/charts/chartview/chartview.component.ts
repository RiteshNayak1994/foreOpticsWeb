import { Component, ComponentFactoryResolver, ComponentRef, Input, OnInit, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { IndicatorsAs } from '../chartConstants';
import { ChartService } from '../chart.service';
import { AbstractChart } from '../chart-types/abstract-chart';
import { BarChartComponent } from '../chart-types/bar-chart/bar-chart.component';
import { ColumnChartComponent } from '../chart-types/column-chart/column-chart.component';
import { GuageChartComponent } from '../chart-types/guage-chart/guage-chart.component';
import { HighMapChartComponent } from '../chart-types/high-map-chart/high-map-chart.component';
import { LineChartComponent } from '../chart-types/line-chart/line-chart.component';
import { PieChartComponent } from '../chart-types/pie-chart/pie-chart.component';
import { SolidGuageChartComponent } from '../chart-types/solid-guage-chart/solid-guage-chart.component';
import { CandlestickChartComponent } from '../chart-types/candlestick-chart/candlestick-chart.component';
import { AreaRangeComponent } from '../chart-types/area-range/area-range.component';
import { ErrorBarChartComponent } from '../chart-types/error-bar-chart/error-bar-chart.component';
import { BasicAreaChartComponent } from '../chart-types/basic-area-chart/basic-area-chart.component';
import { SplineChartComponent } from '../chart-types/spline-chart/spline-chart.component';
import { HeatMapChartComponent } from '../chart-types/heat-map-chart/heat-map-chart.component';

@Component({
  selector: 'app-chartview',
  templateUrl: './chartview.component.html',
  styleUrls: ['./chartview.component.css']
})
export class ChartviewComponent implements OnInit {
  @Input() indId: number;
  @Input() selectedView: string;
  @Input() height: number;
  @Input() width: number;
  @Input() iOrder: number;
  @Input() apiUrl: string;
  @Input() indicatorsAs = IndicatorsAs.Independent;
  @Input() data = 'dynamic';
  @Input() groupByData: string;
  @Input() displayData: string;
  @Input() yAxisCol: string;
  @Input() xAxisCol: string;
  @Input() legendCol: string;
  @Input() subLegendCol: string;
  @Input() parentCol: string;
  @Input() apiData: any = null;
  @Input() xAxisTitle: string;
  @Input() yAxisTitle: string;
  @Input() customColor: any;
  @Input() seriesCol: any;
  @Input() indicatorName: string;
  @Input() dashboardName: any;

  @ViewChild('chartViewStyle', { read: ViewContainerRef, static: true }) chartViewContainer: ViewContainerRef;

  chartObj: AbstractChart;
  selectedData = undefined;

  private componentReference: ComponentRef<{}>;

  private viewStyles = {
    line: LineChartComponent,
    bar: BarChartComponent,
    column: ColumnChartComponent,
    pie: PieChartComponent,
    donut: PieChartComponent,
    gauge: GuageChartComponent,
    solidgauge: SolidGuageChartComponent,
    map: HighMapChartComponent,
    candlestick: CandlestickChartComponent,
    arearange: AreaRangeComponent,
    area: BasicAreaChartComponent,
    errorBar: ErrorBarChartComponent,
    spline: SplineChartComponent,
    heatmap: HeatMapChartComponent
  };

  constructor(private factoryResolver: ComponentFactoryResolver,
    private chartService: ChartService
  ) { }

  ngOnInit(): void {
    this.selectedData = this.indicatorsAs == IndicatorsAs.RelCommonData ? "Oceania" : "";
    this.instantiateViewComponent(this.selectedView);

    this.chartService.selectedData.subscribe((obj: any) => {
      this.selectedData = obj.selectedData;
      //this.updateData();
    });
  }

  ngOnDestroy() {
    this.destroyChildComponent();
  }

  ngOnChanges(changes: SimpleChanges) {
    if ((changes.height && !changes.height.firstChange) || (changes.width && !changes.width.firstChange) ||
      (changes.indId && !changes.indId.firstChange) || (changes.iOrder && !changes.iOrder.firstChange)) {
      if (this.chartObj) {
        // setTimeout(() => {
        this.chartObj.chart.setSize(null, null);
        // }, 500);
      }
    }
    if ((changes.selectedView && !changes.selectedView.firstChange) || (changes.indicatorsAs && !changes.indicatorsAs.firstChange)) {
      this.destroyChildComponent();
      this.instantiateViewComponent(this.selectedView.toLowerCase());
    }

  }

  private destroyChildComponent() {
    if (this.componentReference) {
      this.componentReference.destroy();
      this.componentReference = null;
    }
  }

  instantiateViewComponent(viewStyles) {
    const componentType = this.provideListComponent(viewStyles);
    const factoryInstance = this.factoryResolver.resolveComponentFactory(componentType);
    this.componentReference = this.chartViewContainer.createComponent(factoryInstance);
    this.chartObj = this.componentReference.instance as AbstractChart;
    this.chartObj.indId = this.indId;
    this.chartObj.apiUrl = this.apiUrl;
    this.chartObj.indicatorsAs = this.indicatorsAs;
    this.chartObj.selectedData = this.selectedData;
    this.chartObj.groupByData = this.groupByData;
    this.chartObj.displayData = this.displayData;
    this.chartObj.selectedView = this.selectedView;
    this.chartObj.dataType = this.data;
    this.chartObj.xAxisCol = this.xAxisCol;
    this.chartObj.yAxisCol = this.yAxisCol;
    this.chartObj.legendCol = this.legendCol;
    this.chartObj.parentCol = this.parentCol;
    this.chartObj.subLegendCol = this.subLegendCol;
    this.chartObj.apiData = this.apiData ? this.apiData : null;
    this.chartObj.xAxisTitle = this.xAxisTitle;
    this.chartObj.yAxisTitle = this.yAxisTitle;
    this.chartObj.customColor = this.customColor;
    this.chartObj.seriesCol = this.seriesCol;
    this.chartObj.indicatorName = this.indicatorName;
    this.chartObj.dashboardName = this.dashboardName
  }

  provideListComponent(viewStyles: any) {
    return this.viewStyles[viewStyles] ||
      this.viewStyles.line;
  }
}
