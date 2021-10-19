import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule, Routes } from '@angular/router';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TableModule } from 'primeng/table';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { PaginatorModule } from 'primeng/paginator';
import { NgxPopper } from 'angular-popper';

import { ActivePipeModule } from '../../../@theme/pipes/active-pipe/active-pipe-module';
import { ConfirmationDialogModule } from '../../../@core/sharedModules/confirmation-dialog/confirmation-dialog.module';
import { RoleFormComponent } from './role-form/role-form.component';
import { RoleListComponent } from './role-list/role-list.component';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
    {
        path: '',
        component: RoleListComponent
    },
    {
        path: 'add',
        component: RoleFormComponent
    },
    {
        path: ':id',
        component: RoleFormComponent
    }
];

@NgModule({
    declarations: [
        RoleListComponent,
        RoleFormComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        BsDropdownModule,        
        NgbModule,
        NgxPopper,
        TranslateModule,

        //primeng
        TableModule,
        ScrollPanelModule,
        PaginatorModule,

        RouterModule.forChild(routes),

        ActivePipeModule, //Active pipe
        ConfirmationDialogModule, //For confirmation Dialog
    ],
    providers: [],
    entryComponents: []
})
export class RolesModule {}
