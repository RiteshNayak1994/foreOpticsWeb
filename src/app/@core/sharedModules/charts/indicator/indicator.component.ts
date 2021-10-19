import { ChangeDetectorRef, Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ChartService } from '../chart.service';
import * as $ from "jquery";
import { durationList, IndicatorsAs, sizeList, viewList } from '../chartConstants';

@Component({
  selector: 'app-indicator',
  templateUrl: './indicator.component.html',
  styleUrls: ['./indicator.component.css']
})
export class IndicatorComponent implements OnInit {
  @Input() indId: number;
  @Input() iName: number;
  @Input() selectedView = 'line';
  @Input() selectedDuration: string;
  @Input() height: number;
  @Input() width: number;
  @Input() iOrder: number;
  @Input() apiUrl:string;
  @Input() indicatorsAs = IndicatorsAs.Independent;
  @Input() data = 'dynamic';
  @Input() groupByData: string;
  @Input() displayData: string;
  @Input() yAxisCol: string;
  @Input() xAxisCol: string;
  @Input() legendCol: string;
  @Input() subLegendCol: string;
  @Input() parentCol: string;
  @Input() apiData: any;
  @Input() xAxisTitle: string;
  @Input() yAxisTitle: string;
  @Input() customColor: any;
  @Input() seriesCol: any;
  @Input() indicatorName: any;
  @Input() dashboardName:any;

  durationList = durationList;
  sizeList = sizeList

  viewList = viewList;

  constructor(private chartService: ChartService,
    private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
   
  }

  ngOnChanges(changes: SimpleChanges) {
    // if ((changes.height && !changes.height.firstChange) || (changes.indId && !changes.indId.firstChange) || (changes.iOrder && !changes.iOrder.firstChange)) {
    //   // if (this.chart)
    //   //   this.chart.setSize(null, null);
    // }
    //    console.log(changes)
    //  console.log("test " + this.indId);
  }

  dropDownClick(drpDwnID) {
    $('#' + drpDwnID).toggleClass('show');
  }

  getX(width, txt, fontname, fontsize) {
    let x = (width / 2) - (this.getTextWidth(txt, fontname, fontsize) / 2);
    x = x < 0 ? 0 : x;
    return x;
  }

  getY(height, totalHeight) {
    let y = (height / 2) - (totalHeight / 2);
    y = y < 0 ? 0 : y;
    return y;
  }

  getTextWidth(txt, fontname, fontsize) {
    let c = document.createElement('canvas');
    var ctx = c.getContext("2d");
    ctx.font = fontsize + "px " + fontname;
    let width = ctx.measureText(txt).width;
    return width;
  }

  finalText;
  getSizeDdDispTxt(svgId, avlblWidth, height, fontname, fontsize) {

    if ($('#' + svgId + ' > text').length <= 0) {
      let svg = document.getElementById(svgId);
      let txtElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      let wholeTxtArry = [avlblWidth, ' X ', height];
      let maxWidth = 0;
      let curWidth = 0;
      let totalHeight = 0;
      let cText = "";

      wholeTxtArry.forEach(t => {
        let txtWidth = this.getTextWidth(t, 'Verdana', '10');
        let newW = curWidth + txtWidth;
        let newFt = cText + t;

        if (newW <= avlblWidth) {
          curWidth = newW;
          cText = newFt;
        }
        else {

          let tSpanElmnt = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
          tSpanElmnt.setAttribute('x', ((avlblWidth / 2) - (curWidth / 2)).toString());
          tSpanElmnt.setAttribute('dy', totalHeight.toString());
          tSpanElmnt.textContent = cText;
          txtElement.appendChild(tSpanElmnt);

          cText = t;
          curWidth = txtWidth;
          totalHeight += 12;
        }

        if (maxWidth < curWidth)
          maxWidth = curWidth;

      });

      let tSpanElmnt = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
      tSpanElmnt.setAttribute('x', ((avlblWidth / 2) - (curWidth / 2)).toString());
      tSpanElmnt.setAttribute('dy', totalHeight.toString());
      tSpanElmnt.textContent = cText;
      txtElement.appendChild(tSpanElmnt);

      txtElement.setAttribute('font-size', '10');
      txtElement.setAttribute('fill', 'black');
      txtElement.setAttribute('x', ((avlblWidth / 2) - (maxWidth / 2)).toString());
      txtElement.setAttribute('y', this.getY(height, totalHeight).toString());

      svg.appendChild(txtElement);
    }

  }

  sizeSelect(size) {
    this.chartService.IndicatorSize.next({
      iId: this.indId,
      height: size.height,
      width: size.width
    });
    //console.log(size);
  }

  changeDuration(duration) {
    this.selectedDuration = duration;
  }

  changeView(view) {
    this.selectedView = view;
    // if (this.chart) {
    //   for (var i = 0; i < this.chart.series.length; i++) {
    //     let s = this.chart.series[0];
    //     this.chart.addSeries({
    //       type: this.selectedView.toLowerCase(),
    //       name: s.name,
    //       data: s.options.data
    //     }, false);

    //     s.remove();
    //   }
    //   // this.chart.series.forEach(s => {
    //   //   this.changeType(s);
    //   // });
    //   // this.chart.redraw();
    // }
  }

  changeType(series) {
    //var dataArray = [],
    //  data = this.seriesData.find(sd => sd.name == series.name).data;

    // this.chart.addSeries({
    //   type: this.selectedView.toLowerCase(),
    //   name: series.name,
    //   data: series.options.data
    // }, false);

    // series.remove();
  }

}
