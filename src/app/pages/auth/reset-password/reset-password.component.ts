import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthenticationService } from '../auth.service';
import { MustMatch } from '../../../@core/match-password.validator';
import { CommonHelper } from '../../../@core/common-helper';
import { UserLoginModel } from '../../usermanagement/users/user.model';


@Component({
    selector: 'reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
    @ViewChild('password') passwordRef: ElementRef;

    resetPasswordForm: FormGroup;
    isValidUser: boolean;

    isLoading: boolean = false;
    submitted: boolean = false;
    submittedErrorMsg: string = '';
    submittedSucessMsg: string = '';

    //for login
    userLoginModel: UserLoginModel;

    resetPassword_validation_messages = {
        'password': [
            { type: 'required', message: 'RESET_PASSWORD_DIALOG.MESSAGE_NEW_PASSWORD_REQUIRED' },
            { type: 'minlength', message: 'RESET_PASSWORD_DIALOG.MESSAGE_NEW_PASSWORD_MIN_LENGTH' },
            { type: 'maxlength', message: 'RESET_PASSWORD_DIALOG.MESSAGE_NEW_PASSWORD_MAX_LENGTH' },
        ],
        'passwordConfirm': [
            { type: 'required', message: 'RESET_PASSWORD_DIALOG.MESSAGE_CONFIRM_PASSWORD_REQUIRED' }
        ]
    }

    constructor(
        private _formBuilder: FormBuilder,
        private _authenticationService: AuthenticationService,
        private _activatedRoute: ActivatedRoute,
        private _commonHelper: CommonHelper,
        private _router: Router,
        public _renderer: Renderer2) {
        this.isValidUser = false;
    }

    ngOnInit() {
        this._commonHelper.setLanguage();
        setTimeout(() => { if(this.passwordRef != undefined) this.passwordRef.nativeElement.focus(); });

        this.buildForm();
        this._activatedRoute.queryParams.subscribe(params => {
            this.checkPasswodRestHashValid(params['h']);
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.resetPasswordForm.controls; }

    buildForm(): void {
        this.resetPasswordForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(20)])],
            passwordConfirm: ['', [Validators.required]],
            passwordResetHash: ['']
        }, {
            validator: MustMatch('password', 'passwordConfirm')
        });
    }

    checkPasswodRestHashValid(passwordResetHash): void {
        this.isLoading = true;
        this._commonHelper.showLoader();        
        this._authenticationService.getUserDetailByPasswordResetHash(passwordResetHash).then((response) => {
            if (response) {
                this.isLoading = false;
                this._commonHelper.hideLoader();
                
                if (response['email'] != null) {
                    this.resetPasswordForm.controls.email.setValue(response['email']);
                }

                if (response['passwordResetHash'] != null) {
                    this.resetPasswordForm.controls.passwordResetHash.setValue(response['passwordResetHash']);
                }
                this.isValidUser = true;
            }
        },
            (error) => {
                this.isLoading = false;
                this._commonHelper.hideLoader();
                this.submittedErrorMsg = error.error.message;
            });
    }

    resetPassword(isValid): void {
        this.submitted = true;
        this.submittedErrorMsg = '';
        this.submittedSucessMsg = '';

        if (!isValid) {
            return;
        }
        this.isLoading = true;

        let params = this.resetPasswordForm.value;

        
        this._authenticationService.resetPassword(params).then((response) => {
            
            this.isLoading = false;
            this._commonHelper.showLoader();
            if (response != null) {                
                
                this.submittedSucessMsg = 'RESET_PASSWORD_DIALOG.MESSAGE_PASSWORD_RESET';
                this.userLoginModel = new UserLoginModel();
                this.userLoginModel.email = params.email;
                this.userLoginModel.password = params.password;
                
                this._authenticationService.login(this.userLoginModel).then((loginResponse) => {                   
                    this._commonHelper.hideLoader();        
                    localStorage.setItem('LoggedUserDetail', JSON.stringify(loginResponse));
        
                    this._commonHelper.updateLanguage('en');
                    this._router.navigate(['/dashboard']);
        
                }, (error) => {
                    this._commonHelper.hideLoader();
                    this.submittedErrorMsg = error.error.message;
                });
                
                //this._router.navigate(['/']);
            }
        },
            (error) => {
                this.isLoading = false;
                this.submittedErrorMsg = error.error.message;
            });
    }

}