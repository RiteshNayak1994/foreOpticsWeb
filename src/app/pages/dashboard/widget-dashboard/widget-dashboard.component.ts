import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DashboardService } from '../../../@core/sharedServices/dashboard.service';


@Component({
  selector: 'app-widget-dashboard',
  templateUrl: './widget-dashboard.component.html',
  styleUrls: ['./widget-dashboard.component.scss']
})
export class WidgetDashboardComponent implements OnInit {

  widgetList;
  isCommonUrl = false;
  isRelated = false;
  isMasterIndicators = false;

  indicatorsAs = "Independent";

  constructor(private route: ActivatedRoute, private _dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
        // (+) before `params.get()` turns the string into a number
        this.isCommonUrl = +params.get('id') == 2;
        this.isRelated = +params.get('id') == 3;
        this.isMasterIndicators = +params.get('id') == 4;
        this.isMasterIndicators = true;
        if (this.isCommonUrl)
            this.indicatorsAs = "IndeCommonData";
        else if (this.isRelated)
            this.indicatorsAs = "RelCommonData";
        else if (this.isMasterIndicators)
            this.indicatorsAs = "MasterDetail";
        else
            this.indicatorsAs = "Independent";
    });

    this._dashboardService.getWidgetsList(this.isMasterIndicators ? 2 : 1).then((wdgts) => {
        if (wdgts) {
          this.widgetList = JSON.parse(JSON.stringify(wdgts));
        }
      });
}

}
