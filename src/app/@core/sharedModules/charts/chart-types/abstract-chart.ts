import { deductChartHghtBy } from "../chartConstants";

export abstract class AbstractChart {
   public indId:number;
   public indicatorName:string;
   public dashboardName:string;
   public chart;
   public apiUrl;
   public indicatorsAs;
   public selectedGroupBy;
   public selectedData;
   public selectedView;
   public groupByData;
   public displayData;
   public dDuctChartHghtBy = deductChartHghtBy;
   public dataType;
   public yAxisCol;
   public xAxisCol;
   public legendCol;
   public subLegendCol;
   public parentCol;
   public apiData;
   public xAxisTitle;
   public yAxisTitle;
   public customColor;
   public seriesCol;
}
