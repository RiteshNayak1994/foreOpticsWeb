import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { RouterModule, Routes } from '@angular/router';
import { TableModule } from 'primeng/table';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { PaginatorModule } from 'primeng/paginator';

import { ActivePipeModule } from '../../../@theme/pipes/active-pipe/active-pipe-module';
import { GroupByPipeModule } from '../../../@theme/pipes/group-by-pipe/group-by-pipe-module';
import { ConfirmationDialogModule } from '../../../@core/sharedModules/confirmation-dialog/confirmation-dialog.module';

import { PermissionSetListComponent } from './permissionset-list/permissionset-list.component';
import { PermissionSetFormComponent } from './permissionset-form/permissionset-form.component';
import { TranslateModule } from '@ngx-translate/core';


const routes: Routes = [
    {
        path: '',
        component: PermissionSetListComponent
    },
    {
        path: 'add',
        component: PermissionSetFormComponent
    },
    {
        path: ':id',
        component: PermissionSetFormComponent
    }
];

@NgModule({
    declarations: [
        PermissionSetListComponent,
        PermissionSetFormComponent
    ],
    exports: [],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        BsDropdownModule,
        NgbModule,  
        TranslateModule,      
        
        //primeng
        TableModule,
        ScrollPanelModule,
        PaginatorModule,

        RouterModule.forChild(routes),

        ActivePipeModule, //Active pipe
        GroupByPipeModule, // Groupby pipe
        ConfirmationDialogModule //For confirmation Dialog
    ],
    providers: [
    ],
    entryComponents: []
})

export class PermissionSetModule {}
