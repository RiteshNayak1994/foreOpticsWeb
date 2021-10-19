// Core Angular Imports
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Third Party Imports
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { MultiSelectModule } from 'primeng/multiselect';
import { TranslateModule } from '@ngx-translate/core';
import { HighchartsChartModule } from 'highcharts-angular';
import { Daterangepicker } from 'ng2-daterangepicker';


// App Imports
import { DashboardComponent } from './dashboard.component';
import { ChartsModule } from '../../@core/sharedModules/charts/charts.module';
import { SwotDashboardComponent } from './swot-dashboard/swot-dashboard.component';
import { ForecastDashboardComponent } from './forecast-dashboard/forecast-dashboard.component';
import { SupplierDashboardComponent } from './supplier-dashboard/supplier-dashboard.component';
import { RiskProfileDashboardComponent } from './risk-profile-dashboard/risk-profile-dashboard.component';
import { FiltersModule } from '../../@core/sharedModules/filters/filters.module';
import { RiskTrendDasboardComponent } from './risk-trend-dasboard/risk-trend-dasboard.component';
import { ForecastDashboardV2Component } from './forecast-dashboard-v2/forecast-dashboard-v2.component'

const routes: Routes = [
    {
        path: '',
        redirectTo: 'riskProfile'
    },
    {
        path: 'supplierRisk',
        component: SwotDashboardComponent,
    },
    {
        path: 'riskTrend',
        component: RiskTrendDasboardComponent,
    },
    {
        path: 'riskProfile',
        component: RiskProfileDashboardComponent,
    },
    {
        path: 'forecast',
        component: ForecastDashboardV2Component,
    },
    // {
    //     path: 'forecast',
    //     component: ForecastDashboardComponent,
    // },
    {
        path: 'supplierDetail/:id',
        component: SupplierDashboardComponent,
    }
];
@NgModule({
    declarations: [
        DashboardComponent,
        // WidgetDashboardComponent,
        SwotDashboardComponent,
        ForecastDashboardComponent,
        SupplierDashboardComponent,
        RiskProfileDashboardComponent,
        RiskTrendDasboardComponent,
        ForecastDashboardV2Component,
    ],
    imports: [
        CardModule,
        FormsModule,
        TableModule,
        CommonModule,
        FiltersModule,
        CalendarModule,
        DropdownModule,
        CheckboxModule,
        MultiSelectModule,
        TranslateModule,
        Daterangepicker,
        RadioButtonModule,
        ReactiveFormsModule,

        // ChartsModule,
        ChartsModule,
        HighchartsChartModule,

        RouterModule.forChild(routes)
    ]

})
export class DashboardModule { }
