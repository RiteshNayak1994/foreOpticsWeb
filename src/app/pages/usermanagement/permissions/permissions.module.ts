import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TableModule } from 'primeng/table';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { PaginatorModule } from 'primeng/paginator';

import { ConfirmationDialogModule } from '../../../@core/sharedModules/confirmation-dialog/confirmation-dialog.module';
import { ActivePipeModule } from '../../../@theme/pipes/active-pipe/active-pipe-module';
import { GroupByPipeModule } from '../../../@theme/pipes/group-by-pipe/group-by-pipe-module';

import { PermissionListComponent } from './permission-list/permission-list.component';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
    {
        path: '**',
        component: PermissionListComponent
    }
];

@NgModule({
    declarations: [
        PermissionListComponent

    ],
    exports: [

    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        BsDropdownModule,

        //primeng 
        TableModule,
        ScrollPanelModule,
        PaginatorModule,

        RouterModule.forChild(routes),

        ActivePipeModule, // Active pipe
        GroupByPipeModule, // Groupby pipe
        ConfirmationDialogModule, //For confirmation Dialog  
        TranslateModule
    ],
    providers: [],
    entryComponents: []
})
export class PermissionsModule {}
