import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { AuthenticationService } from '../auth.service';
import { CommonHelper } from '../../../@core/common-helper';
import { AppSettings } from '../../../@core/AppSettings';

@Component({
    selector     : 'forgot-password',
    templateUrl  : './forgot-password.component.html',
    styleUrls    : ['./forgot-password.component.scss']
})

export class ForgotPasswordComponent extends AppSettings implements OnInit
{
    @ViewChild('email') emailRef: ElementRef;
    
    forgotPasswordForm: FormGroup;
    
    isLoading: boolean = false;
    submitted: boolean = false;
    submittedErrorMsg: string = '';
    submittedSucessMsg: string = '';

    sendResetLinkButtonName = 'FORGOT_PASSWORD_DIALOG.BUTTON_RESET_LINK';

    //Login validation
    forgot_validation_messages = {
        'email': [
            { type: 'required', message: 'FORGOT_PASSWORD_DIALOG.MESSAGE_EMAIL' },
            { type: 'email', message: 'FORGOT_PASSWORD_DIALOG.MESSAGE_INVALID_EMAIL' }
        ]
    }

    constructor(private _formBuilder: FormBuilder,
        private _authenticationService: AuthenticationService,
        private _router: Router,
        private _commonHelper: CommonHelper)
    {
        super();
    }

    ngOnInit()
    {
        // set locale language
        this._commonHelper.setLanguage();
        setTimeout(() => {this.emailRef.nativeElement.focus();});
        
        this.forgotPasswordForm = this._formBuilder.group({
            email: ['', Validators.compose([Validators.required,Validators.email])]
        });
    }

    onBackspaceKeydown(ev){
        if(this.forgotPasswordForm.value){
            if(this.forgotPasswordForm.value.length == 0){
                setTimeout(() => {this.emailRef.nativeElement.focus();});
            }
        }
    }

    onCancel(){
        this._router.navigate(['/auth/login']);
    }

     // convenience getter for easy access to form fields
     get f() { return this.forgotPasswordForm.controls; }

    forgotPassword(isValid) {
        this.submitted = true;
        this.submittedErrorMsg = "";
        this.submittedSucessMsg = "";
        if (!isValid) {
            setTimeout(() => {this.emailRef.nativeElement.focus();});
            return;
        }
        this.isLoading = true;
        this._authenticationService.forgotPassword(this.forgotPasswordForm.value).then((response) => {
            this.isLoading = false;
            if (response != null) {
                this.sendResetLinkButtonName = 'FORGOT_PASSWORD_DIALOG.BUTTON_RESEND_RESET_LINK';
                this.submittedSucessMsg = 'FORGOT_PASSWORD_DIALOG.MESSAGE_INSTRUNCTION_RESET_PASSWORD';
                //this._router.navigate(['/']);
            } else {
                // this.submittedErrorMsg = "Email address provided does not exists in system. Please try with another email address.";
                this.submittedErrorMsg = 'FORGOT_PASSWORD_DIALOG.MESSAGE_EMAIL_NOT_EXISTS';
            }
        },
        (error) => {
            this.isLoading = false;
            this.submittedErrorMsg = error.error.message;
        });
        this.submitted = false;
    }
}
