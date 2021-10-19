import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxMaskModule } from 'ngx-mask';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TableModule } from 'primeng/table';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { PaginatorModule } from 'primeng/paginator';
// Import your AvatarModule
import { AvatarModule } from 'ngx-avatar';

import { ActivePipeModule } from '../../../@theme/pipes/active-pipe/active-pipe-module';
import { ImageAreaSelectModule } from '../../../@core/sharedModules/image-area-select/image-area-select.module';
import { ConfirmationDialogModule } from '../../../@core/sharedModules/confirmation-dialog/confirmation-dialog.module';

import { UserListComponent } from './user-list/user-list.component';
import { UserFormComponent } from './user-form/user-form.component';
import { AvatarPersonNamePipeModule } from '../../../@theme/pipes/avatar-person-name/avatar-person-name-pipe-module';
import { UserResetPasswordDialogComponent } from './user-reset-password-dialog/user-reset-password-dialog.component';
import { TranslateModule } from '@ngx-translate/core';
import { MultiSelectModule } from 'primeng/multiselect';

const avatarColors = ["#FFB6C1", "#2c3e50", "#95a5a6", "#f39c12", "#1abc9c"];

const routes: Routes = [
    {
        path: '',
        component: UserListComponent
    },
    {
        path: 'add',
        component: UserFormComponent
    },
    {
        path: ':id',
        component: UserFormComponent
    }
];

@NgModule({
    declarations: [
        UserListComponent,
        UserFormComponent,        
        UserResetPasswordDialogComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        BsDropdownModule,
        NgbModule,
        TranslateModule, 

        //Primeng
        TableModule,
        ScrollPanelModule,
        PaginatorModule,
        AvatarModule.forRoot({
            colors: avatarColors
        }),
        AvatarPersonNamePipeModule,

        RouterModule.forChild(routes),
        NgxMaskModule.forRoot({}),

        ActivePipeModule,       //Active pipe
        ImageAreaSelectModule,   //Image select with crop
        ConfirmationDialogModule, //For confirmation Dialog
        MultiSelectModule
    ],
    providers: [],
    entryComponents: [UserResetPasswordDialogComponent]

})

export class UsersModule { }