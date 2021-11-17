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
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { MultiSelectModule } from 'primeng/multiselect';
import { TranslateModule } from '@ngx-translate/core';
import { HighchartsChartModule } from 'highcharts-angular';
import { Daterangepicker } from 'ng2-daterangepicker';
import { PaginatorModule } from 'primeng/paginator';
import { NgxMaskModule, MaskService  } from 'ngx-mask';


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
import { DashboardService } from '../../@core/sharedServices/dashboard.service';
import { ScRiskSummaryDashboardComponent } from './sc-risk-summary-dashboard/sc-risk-summary-dashboard.component';
import { SuperAdminDashboardComponent } from './super-admin-dashboard/super-admin-dashboard.component';
import { ActivePipeModule } from '../../@core/pipes/active-pipe/active-pipe-module';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'riskSummary',
        component: RiskProfileDashboardComponent
    },
    {
        path: 'superadmin',
        component: SuperAdminDashboardComponent,
    },
    {
        path: 'riskSummary',
        component: ScRiskSummaryDashboardComponent,
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
        ScRiskSummaryDashboardComponent,
        SuperAdminDashboardComponent
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
        InputTextModule,
        MultiSelectModule,
        TranslateModule,
        Daterangepicker,
        RadioButtonModule,
        ReactiveFormsModule,
        PaginatorModule,
        // ChartsModule,
        ChartsModule,
        HighchartsChartModule,
        ActivePipeModule,
        NgxMaskModule.forRoot({}),
        RouterModule.forChild(routes)
    ],
    providers: [
        DashboardService, MaskService
    ],
    exports:[
        RouterModule
    ]

})
export class DashboardModule { }
