import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonHelper } from '../../../../@core/common-helper';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-user-reset-password-dialog',
  templateUrl: './user-reset-password-dialog.component.html',
  styleUrls: ['./user-reset-password-dialog.component.scss']
})
export class UserResetPasswordDialogComponent implements OnInit {

  //user id
  userId: number = 0;

  //loading flag
  isLoading: boolean = false;
  submitted: boolean = false;

  //reset password model
  resetPasswordModel = {
    id: 0,
    name: '',
    email: '',
    password: null,
    confirmPassword: null
  }

  user_validation_messages = {
    'password': [
      { type: 'required', message: 'URAM.USER.USER_RESET_PASSWORD_DIALOG.MESSAGE_PASSWORD' },
      { type: 'minlength', message: 'URAM.USER.USER_RESET_PASSWORD_DIALOG.MESSAGE_PASSWORD_MIN' },
      { type: 'maxlength', message: 'URAM.USER.USER_RESET_PASSWORD_DIALOG.MESSAGE_PASSWORD_MAX' },
    ],
    'confirmPassword': [
      { type: 'required', message: 'URAM.USER.USER_RESET_PASSWORD_DIALOG.MESSAGE_CONFIRM_PASSWORD' },
      { type: 'minlength', message: 'URAM.USER.USER_RESET_PASSWORD_DIALOG.MESSAGE_CONFIRM_PASSWORD_MIN' },
      { type: 'maxlength', message: 'URAM.USER.USER_RESET_PASSWORD_DIALOG.MESSAGE_CONFIRM_PASSWORD_MAX' },
    ]
  }

  constructor(private _ngbActiveModal: NgbActiveModal,
    private _usersService: UsersService,
    private _commonHelper: CommonHelper,
  ) { }

  ngOnInit() {
    if (this.userId == 0) {
      this._commonHelper.showToastrError(
        this._commonHelper.getInstanceTranlationData('URAM.USER.USER_RESET_PASSWORD_DIALOG.MESSAGE_USER_NOT_EXIST')
      );
      this.onCloseForm();
    } else {
      this.getUserDetail();
    }
  }

  getUserDetail() {
    this.isLoading = true;
    this._usersService.getUserById(this.userId).then(response => {
      if (response != null) {
        this.resetPasswordModel.id = response['id'];
        this.resetPasswordModel.name = response['name'];
        this.resetPasswordModel.email = response['email'];

      }
      this.isLoading = false;
    }, (error) => {
      this.getTranslateErrorMessage(error);
    });
  }

  onSubmitResetPassword() {
    this.submitted = true;
    if (this.resetPasswordModel.password == '') {
      return;
    }
    if (this.resetPasswordModel.confirmPassword == '') {
      return;
    }
    if (this.resetPasswordModel.password != this.resetPasswordModel.confirmPassword) {
      return;
    }

    if ((this.resetPasswordModel.password === this.resetPasswordModel.confirmPassword) && this.resetPasswordModel.password.length >= 6) {
      let params = {
        Id: this.resetPasswordModel.id,
        email: this.resetPasswordModel.email,
        password: this.resetPasswordModel.password,
      };

      this._usersService.resetPasswordByAdmin(params).then(response => {
        this._commonHelper.showToastrSuccess(
          this._commonHelper.getInstanceTranlationData('URAM.USER.USER_RESET_PASSWORD_DIALOG.MESSAGE_USER_PASSWORD_RESET')
        );
        this._ngbActiveModal.close(response);
      }, (error) => {
        this.getTranslateErrorMessage(error.error.messageCode);
      });
    }
  }

  //for close form
  public onCloseForm() {
    this._ngbActiveModal.close();
  }

  getTranslateErrorMessage(error) {
      if (error.error != null && error.error.messageCode) {
        this._commonHelper.showToastrError(
          this._commonHelper.getInstanceTranlationData('URAM.USER.' + error.error.messageCode.replace('.', '_').toUpperCase())
        );
      }
  }

}
