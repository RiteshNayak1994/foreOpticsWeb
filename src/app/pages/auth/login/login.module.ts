import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PrivacyPolicyModule } from '../../../@core/sharedModules/privacy-policy/privacy-policy.module'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProfileService } from '../../usermanagement/profile/profile.service';

const routes = [
  {
      path     : '',
      component: LoginComponent
  }
];

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    RouterModule,     
       
    RouterModule.forChild(routes),
    TranslateModule,
    PrivacyPolicyModule // for privacy-policy dialog
  ],
  providers:[
    ProfileService
  ]
})


export class LoginModule { }
