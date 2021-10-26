import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TreeTableModule } from 'primeng/treetable';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { RadioButtonModule } from 'primeng/radiobutton';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'primeng/tooltip';
import { NgbTooltipModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ChartService } from './chart.service';
import { ChartTypesModule } from './chart-types/chart-types.module';
import { IndicatorComponent } from './indicator/indicator.component';
import { ChartviewComponent } from './chartview/chartview.component';
import { ChartTableComponent } from './chart-table/chart-table.component';
import { ComboIndicatorComponent } from './combo-indicator/combo-indicator.component';
import { DateFormatPipeModule } from '../../../@core/pipes/date-format-pipe/date-format-pipe.module';

import { ShortNumberModule } from '../../../@core/pipes/short-number/short-number.module';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    IndicatorComponent,
    ChartviewComponent,
    ChartTableComponent,
    ComboIndicatorComponent
  ],
  imports: [
    FormsModule,
    NgbModule,
    CardModule,
    ButtonModule,
    TableModule,
    CommonModule,
    TooltipModule,
    ChartTypesModule,
    BsDropdownModule,
    NgbTooltipModule,
    RadioButtonModule,
    ToggleButtonModule,
    DateFormatPipeModule,
    TreeTableModule,
    ShortNumberModule,
    DropdownModule,
    SelectButtonModule,
    RouterModule
  ],
  exports: [
    IndicatorComponent,
    ChartviewComponent,
    ChartTableComponent,
    ComboIndicatorComponent
  ],
  entryComponents: [
    ChartviewComponent
  ],
  providers: [
    ChartService
  ]
})
export class ChartsModule { }
