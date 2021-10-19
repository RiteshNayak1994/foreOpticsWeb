import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';

import { DashboardFilterComponent } from './dashboard-filter/dashboard-filter.component';
import { FilterService } from './filter.service';

@NgModule({
  declarations: [
    DashboardFilterComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    ButtonModule,
    TooltipModule,
    DropdownModule,
    MultiSelectModule
  ],
  exports: [
    DashboardFilterComponent
  ],
  providers: [
    FilterService
  ]
})
export class FiltersModule { }
