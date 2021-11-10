import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthenticationService } from '../auth.service'
import { UserLoginModel, SingleSignOnModel } from '../../usermanagement/users/user.model';
import { CommonHelper } from '../../../@core/common-helper';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PrivacyPolicyComponent } from '../../../@core/sharedModules/privacy-policy/privacy-policy.component';
import { ProfileService } from '../../usermanagement/profile/profile.service';
import { ProfileChangePassword } from '../../usermanagement/profile/profile.model';
import { MustMatch, MustNotMatch } from '../../../@core/match-password.validator';
import { AppSettings } from '../../../@core/AppSettings';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None,
})

export class LoginComponent extends AppSettings implements OnInit {

    //For Model Ref
    modalRef: NgbModalRef | null;

    @ViewChild('email') emailRef: ElementRef;

    loginForm: FormGroup;
    changePasswordForm: FormGroup;
    userLoginModel = new UserLoginModel();
    singleSignOnModel = new SingleSignOnModel();

    submitted: boolean = false;
    submittedErrorMsg: string = '';

    //all popup dialog open option settings
    optionsForPopupDialog: any = {
        size: "xl",
        centered: false,
        backdrop: 'static',
        keyboard: false
    };

    //Login validation
    login_validation_messages = {
        'email': [
            { type: 'required', message: 'LOGIN.MESSAGE_EMAIL' },
            { type: 'pattern', message: 'LOGIN.MESSAGE_INVALID_EMAIL' }
        ],
        'password': [
            { type: 'required', message: 'LOGIN.MESSAGE_PASSWORD' }
        ]
    }

    changePassword_validation_messages = {
        'oldPassword': [
            { type: 'required', message: 'MYPROFILE_DIALOG.TAB_CHANGE_PASSWORD.MESSAGE_OLDPASSWORD' }
        ],
        'newPassword': [
            { type: 'required', message: 'MYPROFILE_DIALOG.TAB_CHANGE_PASSWORD.MESSAGE_NEWPASSWORD' },
            { type: 'minlength', message: 'MYPROFILE_DIALOG.TAB_CHANGE_PASSWORD.MESSAGE_NEWPASSWORD_MIN' },
            { type: 'maxlength', message: 'MYPROFILE_DIALOG.TAB_CHANGE_PASSWORD.MESSAGE_NEWPASSWORD_MAX' },
        ],
        'confirmPassword': [
            { type: 'required', message: 'MYPROFILE_DIALOG.TAB_CHANGE_PASSWORD.MESSAGE_CONFIRMPASSWORD' }
        ]
    }

    returnUrl: string;

    // change password on first login succcessful attemp
    isFirstTimeLogin: boolean = false;
    profileChangePassword: ProfileChangePassword;
    passwordSubmitted: boolean = false;
    userId: any = 0;

    constructor(
        private _formBuilder: FormBuilder,
        private _activeRoute: ActivatedRoute,
        private _router: Router,
        private _authenticationService: AuthenticationService,
        private _profileService: ProfileService,
        private _modalService: NgbModal,
        private _commonHelper: CommonHelper
    ) {
        super();
        this.profileChangePassword = new ProfileChangePassword();
        this.profileChangePassword.oldPassword = '';
        this.profileChangePassword.newPassword = '';
        this.profileChangePassword.confirmPassword = '';
    }

    ngOnInit(): void {
        // get return url from route parameters or default to '/'
        this.returnUrl = this._activeRoute.snapshot.queryParams['returnUrl'] || '/';
        // set locale language
        this._commonHelper.setLanguage();

        setTimeout(() => { this.emailRef.nativeElement.focus(); });
        this.crateLoginForm();
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    crateLoginForm() {
        this.loginForm = this._formBuilder.group({
            email: ['admin@foreoptics.com', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$')])],
            password: ['login12*', Validators.required]
        });
    }

    login(isValid) {
        this.submitted = true;
        this.submittedErrorMsg = '';

        if (!isValid) {
            return;
        }

        this._commonHelper.showLoader();

        this._authenticationService.login(this.loginForm.value).then((response: any) => {
            this._commonHelper.updateLanguage('en');
            this._commonHelper.setLoaderHide();
            if (this.returnUrl == "/")
                this._commonHelper.removeAllSearchingFilterLocalStorage();

            //set logged user detail
            this._commonHelper.setLoggedUserDetail(response);
            //set logged user session token in local storage
            localStorage.setItem('LoggedUserSessionToken', response.accessToken);

            // check if the user is logged in for the first time, then ask to change password
            if (response.isFirstTimeLogin) {
                //set user id for password change
                this.userId = response.userId;
                //set password as old password
                this.profileChangePassword.oldPassword = this.loginForm.controls.password.value;
                //create form
                this.createChangePasswordForm();
                //display form
                this.isFirstTimeLogin = true;
                this._commonHelper.hideLoader();
            }
            else {
                // login successful so redirect to return url
                this._router.navigateByUrl(this.returnUrl);
            }

        }, (error) => {
            this._commonHelper.hideLoader();
            this.submittedErrorMsg = this.getTranslateErrorMessage(error.error.messageCode);
        });
        this.submitted = false;
    }

    openPrivacyPolicy() {
        this.modalRef = this._modalService.open(PrivacyPolicyComponent, this.optionsForPopupDialog);
    }

    getTranslateErrorMessage(messageCode: string): string {
        return this._commonHelper.getInstanceTranlationData('LOGIN.' + messageCode.replace('.', '_').toUpperCase());
    }

    createChangePasswordForm() {
        this.changePasswordForm = null;
        this.changePasswordForm = this._formBuilder.group({
            id: [this.userId],
            oldPassword: [this.profileChangePassword.oldPassword, Validators.compose([Validators.required])],
            newPassword: [this.profileChangePassword.newPassword, Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(20)])],
            confirmPassword: [this.profileChangePassword.confirmPassword, Validators.compose([Validators.required])]
        }, {
            validator: [MustNotMatch('oldPassword', 'newPassword'), MustMatch('newPassword', 'confirmPassword')]
        });
    }

    saveChangePasswordForm(changePasswordFormData) {
        this.passwordSubmitted = true;

        if (this.changePasswordForm.invalid) {
            this.validateAllFormFields(this.changePasswordForm);
            return;
        }

        this._commonHelper.showLoader();
        this._profileService.saveChangePasswordForm(changePasswordFormData).then((response: any) => {
            this._commonHelper.hideLoader();
            this._commonHelper.showToastrSuccess(
                this._commonHelper.getInstanceTranlationData('MYPROFILE_DIALOG.TAB_CHANGE_PASSWORD.MESSAGE_PASSAWORD_CHAGE')
            );
            // login successful so redirect to return url
            this._router.navigateByUrl(this.returnUrl);
        },
            (error) => {
                this._commonHelper.hideLoader();
                this.getTranslateErrorMessage(error);
            });
        this.passwordSubmitted = true;
    }

    //For Form Validate
    validateAllFormFields(formGroup: FormGroup) {
        Object.keys(formGroup.controls).forEach(field => {
            const control = formGroup.get(field);
            if (control instanceof FormControl) {
                control.markAsTouched({ onlySelf: true });
            }
            else if (control instanceof FormGroup) {
                this.validateAllFormFields(control);
            }
        });
    }

    onResetPasswordForm() {
        this.changePasswordForm.reset();
        this.changePasswordForm.patchValue({ id: this.userId });
        this.changePasswordForm.patchValue({ oldPassword: this.loginForm.controls.password.value });
    }
}