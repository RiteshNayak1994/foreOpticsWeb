import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule, Routes } from '@angular/router';
import { NgxMaskModule } from 'ngx-mask';

import { ProfileComponent } from './profile-form/profile.component';
import { ImageAreaSelectModule } from '../../../@core/sharedModules/image-area-select/image-area-select.module';
import { ConfirmationDialogModule } from '../../../@core/sharedModules/confirmation-dialog/confirmation-dialog.module';
import { AuthGuard } from '../../auth/auth.guard';
import { enumPermissions } from '../../../@core/common-helper';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
    {
        path: '**',
        component: ProfileComponent,   
        canActivate: [AuthGuard],
        data: { permission: enumPermissions.EditProfile }    
    }
];

@NgModule({
    declarations: [
        ProfileComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        BsDropdownModule,                    
        NgbModule,
        RouterModule.forChild(routes),
        NgxMaskModule.forRoot({}),

        ImageAreaSelectModule,   //Image select with crop
        ConfirmationDialogModule, //For confirmation Dialog
        TranslateModule
    ],
    providers: [
    ],
    entryComponents: [
    ]
})
export class ProfileModule {}
