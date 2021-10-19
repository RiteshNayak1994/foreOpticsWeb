import { NgModule } from '@angular/core';
import { NbMenuModule } from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { AuthModule } from './auth/auth.module';
import { PagesRoutingModule } from './pages-routing.module';
import { DashboardService } from '../@core/sharedServices/dashboard.service';

@NgModule({
  imports: [
    PagesRoutingModule,
    AuthModule,
    ThemeModule,
    NbMenuModule,
    DashboardModule,
  ],
  declarations: [
    PagesComponent,
  ],
  providers: [
    DashboardService
  ]
})
export class PagesModule {
}
