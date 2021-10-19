import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MustMatch } from '../../../../@core/match-password.validator';
import { ImageAreaSelectComponent } from '../../../../@core/sharedModules/image-area-select/image-area-select.component';
import { CommonHelper, enumPermissions } from '../../../../@core/common-helper';
import { UsersService } from '../users.service';
import { User, UserChangePassword } from '../user.model';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {

  //For Model Ref
  modalRef: NgbModalRef | null;

  //For User Form
  userForm: FormGroup;
  changePasswordForm: FormGroup;

  //User/Role Model
  user: User;
  copyOfUser: User;
  roles: any;
  userChangePassword: UserChangePassword;

  //Cropped Image base64String
  croppedImage: any = '';

  userId: number = 0;
  formMode: string;
  submitted: boolean = false;
  isChangePassword: boolean = false;

  //permission variable
  isViewUser: boolean = false;
  isAddUser: boolean = false;
  isEditUser: boolean = false;
  isDeleteUser: boolean = false;

  //time zone
  timeZoneList: any;

  //all popup dialog open option settings
  optionsForPopupDialog: any = {
    size: "md",
    centered: false,
    backdrop: 'static',
    keyboard: false
  };
  //For Validation
  isPhoneInvalid: boolean = false;
  user_validation_messages = {
    'firstName': [
      { type: 'required', message: 'URAM.USER.DETAIL.MESSAGE_FIRSTNAME' }
    ],
    'password': [
      { type: 'required', message: 'URAM.USER.DETAIL.MESSAGE_PASSWORD' },
      { type: 'minlength', message: 'URAM.USER.DETAIL.MESSAGE_PASSWORD_MIN' },
      { type: 'maxlength', message: 'URAM.USER.DETAIL.MESSAGE_PASSWORD_MAX' }
    ],
    'confirmPassword': [
      { type: 'required', message: 'URAM.USER.DETAIL.MESSAGE_CONFIRM_PASSWORD' }
    ],
    'email': [
      { type: 'required', message: 'URAM.USER.DETAIL.MESSAGE_EMAIL' },
      { type: 'email', message: 'URAM.USER.DETAIL.MESSAGE_INVALID_EMAIL' }
    ],
    'roleId': [
      { type: 'required', message: 'URAM.USER.DETAIL.MESSAGE_ROLE_SELECT' },
    ],
    'timezone': [
      { type: 'required', message: 'URAM.USER.DETAIL.MESSAGE_TIMEZONE_SELECT' },
    ]
  }

  constructor(private _router: Router,
    private _formBuilder: FormBuilder,
    private _modalService: NgbModal,
    private _activeRoute: ActivatedRoute,
    private _commonHelper: CommonHelper,
    private _usersService: UsersService) {
    //If Record Edit then set record edit id
    this._activeRoute.params.subscribe(param => {
      if (param['id'] != undefined) {
        if (param['id'] != null) {
          this.userId = param['id'];
        }
      }
    });

    //Set Logged user have permission
    this.isViewUser = this._commonHelper.havePermission(enumPermissions.ViewUser);
    this.isAddUser = this._commonHelper.havePermission(enumPermissions.AddUser);
    this.isEditUser = this._commonHelper.havePermission(enumPermissions.EditUser);
    this.isDeleteUser = this._commonHelper.havePermission(enumPermissions.DeleteUser);
  }

  ngOnInit() {
    this.croppedImage = "assets/images/default/users/no-image.jpg";

    this.getRoles();
    this.getAllTimeZone();

    if (this.userId > 0) {
      this.formMode = 'EDIT';
      this.getUserDetail();
    } else {
      this.formMode = 'ADD';
      this.user = new User({});
      this.user.isActive = true;
      this.userForm = this.createUserForm();

      this.userChangePassword = new UserChangePassword({});
      this.changePasswordForm = this.createChangePasswordForm();

      this.userForm = new FormGroup({ basicInfoForm: this.userForm, changePassForm: this.changePasswordForm });
    }
  }

  getUserDetail() {
    //this.isLoading = true;
    this._commonHelper.showLoader();
    this._usersService.getUserById(this.userId).then(response => {

      this.user = response as User;
      if (this.user.imagePath != null) {
        this.croppedImage = this.user.imagePath;
      }

      if (this.userForm == null) {
        this.userForm = this.createUserForm();
        this.userForm = new FormGroup({ basicInfoForm: this.userForm });
        this.userChangePassword = new UserChangePassword({});
        this.userChangePassword.userId = this.user.id;
        this.changePasswordForm = this.createChangePasswordForm();
      }

      this.copyOfUser = this._commonHelper.cloningObject(this.user);

      //this.isLoading = false;
      this._commonHelper.hideLoader();
    }, (error) => {
      this._commonHelper.hideLoader();
      //this.isLoading = false;
      this.getTranslateErrorMessage(error);
    });
  }

  saveForm(formData) {
    this.submitted = true;

    if (this.userForm.invalid) {
      this.validateAllFormFields(this.userForm);
      return;
    }

    if (this.croppedImage.includes('no-image') === true || this.croppedImage.includes('avatars')) {
      formData.basicInfoForm.imageBase64 = '';
    }
    else {
      formData.basicInfoForm.imageBase64 = this.croppedImage;
    }

    if (this.formMode == 'ADD') {

      let params = {
        id: formData.basicInfoForm.id,
        firstName: formData.basicInfoForm.firstName,
        lastName: formData.basicInfoForm.lastName,
        email: formData.basicInfoForm.email,
        phone: formData.basicInfoForm.phone,
        roleId: formData.basicInfoForm.roleId,
        timezone: formData.basicInfoForm.timezone,
        isActive: formData.basicInfoForm.isActive,
        imagePath: formData.basicInfoForm.imagePath,
        imageBase64: formData.basicInfoForm.imageBase64,
        password: formData.changePassForm.password
      }
      this._commonHelper.showLoader();
      this._usersService.addUsers(params).then(response => {
        this._commonHelper.showToastrSuccess(
          this._commonHelper.getInstanceTranlationData('URAM.USER.DETAIL.MESSAGE_USER_ADD')
        );
        this._commonHelper.hideLoader();
        this.closeForm();
      },
        (error) => {
          this._commonHelper.hideLoader();
          this.getTranslateErrorMessage(error);
        });
    } else if (this.formMode == 'EDIT') {
      let params = {
        id: formData.basicInfoForm.id,
        firstName: formData.basicInfoForm.firstName,
        lastName: formData.basicInfoForm.lastName,
        email: formData.basicInfoForm.email,
        phone: formData.basicInfoForm.phone,
        roleId: formData.basicInfoForm.roleId,
        timezone: formData.basicInfoForm.timezone,
        isActive: formData.basicInfoForm.isActive,
        imagePath: formData.basicInfoForm.imagePath,
        imageBase64: formData.basicInfoForm.imageBase64
      }

      this._commonHelper.showLoader();
      this._usersService.updateUser(params).then(response => {
        this._commonHelper.hideLoader();
        this._commonHelper.showToastrSuccess(
          this._commonHelper.getInstanceTranlationData('URAM.USER.DETAIL.MESSAGE_USER_UPDATE')
        );
        //this.closeForm();
        this.getUserDetail();
      },
        (error) => {
          this._commonHelper.hideLoader();
          this.getTranslateErrorMessage(error);
        });
    }
  }

  onSetUserPassword(formData) {
    this.isChangePassword = true;
    if (this.changePasswordForm.invalid) {
      this.validateAllFormFields(this.changePasswordForm);
      return;
    }

    let params = {
      id: formData.userId,
      newPassword: formData.password,
      confirmPassword: formData.confirmPassword,
    }

    this._commonHelper.showLoader();
    this._usersService.saveChangePasswordForm(params).then(response => {
      this._commonHelper.hideLoader();
      this._commonHelper.showToastrSuccess(
        this._commonHelper.getInstanceTranlationData('MYPROFILE_DIALOG.TAB_CHANGE_PASSWORD.MESSAGE_PASSAWORD_CHAGE')
      );

      this.changePasswordForm.reset();
      this.changePasswordForm.patchValue({ userId: formData.userId });
    },
      (error) => {
        this._commonHelper.hideLoader();
        this.getTranslateErrorMessage(error);
      });
    this.isChangePassword = false;
  }

  onSendReactivation() {
    let params = {
      userId: this.user.id
    }
    this._commonHelper.showLoader();
    this._usersService.sendUserActivationEmail(params).then(response => {
      this._commonHelper.hideLoader();
      this._commonHelper.showToastrSuccess(
        this._commonHelper.getInstanceTranlationData('URAM.USER.DETAIL.MESSAGE_FOR_USER_REACTIVATION_SUCCESSFULLY') + this.user.email
      );
    },
      (error) => {
        this._commonHelper.hideLoader();
        this.getTranslateErrorMessage(error);
      });
  }

  //Open Image selection dialog with cropped, If image is selected then return base64String, If image is not selected it return undefined
  openProfileCropper(): void {

    this.modalRef = this._modalService.open(ImageAreaSelectComponent, this.optionsForPopupDialog);
    this.modalRef.result.then(imageBase64Data => {
      if (imageBase64Data != undefined) {
        if (imageBase64Data != '') {
          this.croppedImage = imageBase64Data;
        }
      }
    });
  }

  createUserForm(): FormGroup {
    if (this.formMode == 'ADD') {
      return this._formBuilder.group({
        id: [this.user.id],
        firstName: [this.user.firstName, Validators.compose([Validators.required])],
        lastName: [this.user.lastName],
        email: [this.user.email, [Validators.required, Validators.email]],
        phone: [this.user.phone],
        roleId: [this.user.roleId, Validators.compose([Validators.required])],
        timezone: [this.user.timezone, Validators.compose([Validators.required])],
        isActive: [this.user.isActive],
        imagePath: [this.croppedImage],
        imageBase64: [this.croppedImage]
      });
    }
    else if (this.formMode == 'EDIT') {
      return this._formBuilder.group({
        id: [this.user.id],
        firstName: [this.user.firstName, Validators.compose([Validators.required])],
        lastName: [this.user.lastName],
        email: [this.user.email, [Validators.required, Validators.email]],
        phone: [this.user.phone],
        roleId: [this.user.roleId, Validators.compose([Validators.required])],
        timezone: [this.user.timezone, Validators.compose([Validators.required])],
        isActive: [this.user.isActive],
        imagePath: [this.croppedImage],
        imageBase64: [this.croppedImage]
      });
    }
  }

  createChangePasswordForm() {
    return this._formBuilder.group({
      userId: [this.userChangePassword.userId],
      password: [this.userChangePassword.password, Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(20)])],
      confirmPassword: [this.userChangePassword.confirmPassword, Validators.compose([Validators.required])]
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });
  }

  getRoles() {
    this._commonHelper.showLoader();
    this._usersService.getRoles().then(response => {
      this._commonHelper.hideLoader();
      this.roles = response;
    },
      (error) => {
        this._commonHelper.hideLoader();
        this.getTranslateErrorMessage(error);
      });
  }

  getAllTimeZone() {
    this._commonHelper.showLoader();
    this._usersService.getAllTimeZone().then(response => {
      this._commonHelper.hideLoader();
      this.timeZoneList = response;
    },
      (error) => {
        this._commonHelper.hideLoader();
        this.getTranslateErrorMessage(error);
      });
  }

  inputPhoneMaskValid() {
    //this.isPhoneInvalid = this.userForm.controls.phone.invalid;
    this.isPhoneInvalid = this.userForm.get('basicInfoForm')['controls'].phone.invalid;
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

  onResetUserDetail() {
    if (this.formMode === 'ADD') {
      this.userForm.reset();
    } else if (this.formMode === 'EDIT') {
      this.userForm.reset();
      this.user = this._commonHelper.cloningObject(this.copyOfUser);
      
      if (this.user.imagePath != null) {
        this.croppedImage = this.user.imagePath;
      }

      this.userForm.patchValue({
        basicInfoForm: {
        id: this.user.id,
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        email: this.user.email,
        phone: this.user.phone,
        roleId: this.user.roleId,
        timezone: this.user.timezone,
        isActive: this.user.isActive,
        imagePath: this.croppedImage,
        imageBase64: this.croppedImage,
      }
    });    
  }
}

onResetPasswordForm() {
  this.changePasswordForm.reset();
  this.changePasswordForm.patchValue({ userId: this.user.id });
}

onBack(){
  this.closeForm();
}

closeForm() {
  this._router.navigate(['settings/uram/users']);
}

getTranslateErrorMessage(error) {
  if (error.error != null && error.error.messageCode) {
    this._commonHelper.showToastrError(
      this._commonHelper.getInstanceTranlationData('URAM.USER.' + error.error.messageCode.replace('.', '_').toUpperCase())
    );
  }
}
}
