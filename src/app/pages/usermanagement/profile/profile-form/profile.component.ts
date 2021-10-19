import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Profile, ProfileChangePassword, ProfileAddress } from '../profile.model';
import { ProfileService } from '../profile.service';
import { MustMatch } from '../../../../@core/match-password.validator';
import { ImageAreaSelectComponent } from '../../../../@core/sharedModules/image-area-select/image-area-select.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CommonHelper } from '../../../../@core/common-helper';
import { Router } from '@angular/router';
import { AppSettings } from '../../../../@core/AppSettings';
import { CommonService } from '../../../../@core/sharedServices/common.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent extends AppSettings implements OnInit {

  //For Model Ref
  modalRef: NgbModalRef | null;

  basicInfoForm: FormGroup;
  addressForm: FormGroup;
  changePasswordForm: FormGroup;
  matchValueError: boolean;

  profile: Profile;
  copyOfProfile: Profile;

  state: any;
  selectedStateCode: string;
  countries: any;

  croppedImage: any = '';
  dialogRef: any;

  submitted: boolean = false;
  passwordSubmitted: boolean = false;

  profileChangePassword: ProfileChangePassword;

  addressId: any;

  //For Validation
  isPhoneInvalid: boolean = false;

  //time zone
  timeZoneList: any;

  //all popup dialog open option settings
  optionsForPopupDialog: any = {
    size: "md",
    centered: false,
    backdrop: 'static',
    keyboard: false
  };

  basicInfo_validation_messages = {
    'firstName': [
      { type: 'required', message: 'MYPROFILE_DIALOG.TAB_BASIC.MESSAGE_FIRSTNAME' }
    ],
    'lastName': [
      { type: 'required', message: 'MYPROFILE_DIALOG.TAB_BASIC.MESSAGE_LASTNAME' }
    ],
    'email': [
      { type: 'required', message: 'MYPROFILE_DIALOG.TAB_BASIC.MESSAGE_EMAIL' },
      { type: 'email', message: 'MYPROFILE_DIALOG.TAB_BASIC.MESSAGE_INVALID_EMAIL' }
    ],
    'timezone': [
      { type: 'required', message: 'MYPROFILE_DIALOG.TAB_BASIC.MESSAGE_TIMEZONE_SELECT' },
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

  constructor(private _modalService: NgbModal,
    private _formBuilder: FormBuilder,
    private _profileService: ProfileService,
    private _router: Router,
    private _commonHelper: CommonHelper,
    private _commonService: CommonService) {
    super();
    this.matchValueError = false;
    this.selectedStateCode = '';
    this.croppedImage = "assets/images/default/users/no-image.jpg";
    this.profileChangePassword = new ProfileChangePassword();

    this.getAllTimeZone();
    this.getCountries();
  }

  ngOnInit() {    
    this.getProfileDetail();
  }

  getCountries(): void {
    this._commonService.getActiveCountryList().then(response => {
      this.countries = response;
    },
      (error) => {
        this.getTranslateErrorMessage(error);
      });
  }

  getStates(event) {
    let countryId = Number(event) ? event : Number(event.selectedOptions[0].dataset.countryid);
    this._commonService.getState(countryId).then(response => {
      this.state = response;
      if (!Number(event)) {
        this.profile.addresses.stateOrProvince = '';
      }
    },
      (error) => {
        this.getTranslateErrorMessage(error);
      });
  }

  allowOnlyNumericValues(event) {
    this._commonHelper.allowOnlyNumericValues(event);
  }

  getProfileDetail() {
    this._commonHelper.showLoader();
    this._profileService.getProfileDetail().then(response => {
      this.profile = new Profile({});
      this.addressId = response['addressId'];
      this.profile = response as Profile;
      this.copyOfProfile = this._commonHelper.cloningObject(this.profile);
      if(this.countries && this.countries.length > 0){
        let country= this.countries.filter(C => C.name == (this.CheckNullOrUndefined(this.profile.addresses.country) ? this.profile.addresses.country : this.DefaultCountry)).map(C => {return C.id })[0];
        if(country > 0){
          this.getStates(country);
        }
      }

      if (this.profile.addresses != null) {
        this.selectedStateCode = this.profile.addresses.stateCode;
      }

      this.createBasicInfoForm();
      this.createAddressForm();
      this.createChangePasswordForm();
      this._commonHelper.hideLoader();

    }, (error) => {
      this._commonHelper.hideLoader();
      this.getTranslateErrorMessage(error);
    });
  }

  saveBasicInfo(basicInfoFormData) {
    this.submitted = true;
    if (this.basicInfoForm.invalid) {
      this.validateAllFormFields(this.basicInfoForm);
      return;
    }

    if (this.croppedImage.includes('no-image') === true || this.croppedImage.includes('avatars')) {
      basicInfoFormData.imageBase64 = '';
    }
    else {
      basicInfoFormData.imageBase64 = this.croppedImage;
    }

    this._commonHelper.showLoader();
    this._profileService.saveBasicInfo(basicInfoFormData).then((response: any) => {
      this._commonHelper.hideLoader();
      if (response != null) {

        //update local storage
        const localStorageData = this._commonHelper.getLoggedUserDetail();
        if (localStorageData != null && localStorageData !== undefined) {

          localStorageData.name = response['name'];
          localStorageData.firstName = response['firstName'];
          localStorageData.lastName = response['lastName'];
          localStorageData.imagePath = response['imagePath'];
          localStorageData.timezone = response['timezone'];
          this._commonHelper.setLoggedUserDetail(localStorageData);
        }
        //this.basicInfoForm.patchValue({phone: response['phone']});

        this.profile.firstName = response.firstName;
        this.profile.lastName = response.lastName;
        this.profile.email = response.email;
        this.profile.imagePath = response.imagePath;
        this.profile.phone = response.phone;
        this.profile.timezone = response.timezone;
        this.profile.isActive = response.isActive;
        this.copyOfProfile = this._commonHelper.cloningObject(this.profile);

        // "Profile updated successfully"
        this._commonHelper.showToastrSuccess(this._commonHelper.getInstanceTranlationData('MYPROFILE_DIALOG.TAB_BASIC.MESSAGE_PROFILE_UPDATE'));
        //this.getProfileDetail();        
      }
    },
      (error) => {
        this._commonHelper.hideLoader();
        this.getTranslateErrorMessage(error);
      });
    this.submitted = false;
  }

  saveAddress(addressFormData) {
    if (this.addressForm.invalid) {
      this.validateAllFormFields(this.addressForm);
      return;
    }

    let params = {
      id: this.addressId,
      address1: addressFormData.address1,
      address2: addressFormData.address2,
      city: addressFormData.city,
      country: addressFormData.country,
      postalCode: addressFormData.postalCode,
      stateCode: addressFormData.stateCode,
      stateOrProvince : addressFormData.stateCode != '' ? this.state.filter(c => c.code == addressFormData.stateCode).map(e => { return e.name })[0]:''
    }

    this._commonHelper.showLoader();
    
    this._profileService.saveAddress(params).then((response: any) => {
      this.profile.addresses.address1 = response.address1;
      this.profile.addresses.address2 = response.address2;
      this.profile.addresses.city = response.city;
      this.profile.addresses.stateCode = response.stateCode;
      this.profile.addresses.postalCode = response.postalCode;
      this.profile.addresses.country = response.country;
      this.profile.addresses.stateOrProvince = response.stateOrProvince ;
      this.copyOfProfile = this._commonHelper.cloningObject(this.profile);
      this._commonHelper.hideLoader();
      this._commonHelper.showToastrSuccess(
        this._commonHelper.getInstanceTranlationData('MYPROFILE_DIALOG.TAB_ADDRES.MESSAGE_ADDRESS_UPDATE')
      );
    },
      (error) => {
        this._commonHelper.hideLoader();
        this.getTranslateErrorMessage(error);
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
      this.changePasswordForm.reset();
      this.changePasswordForm.patchValue({ id: changePasswordFormData.id });
      this.passwordSubmitted = false;
    },
      (error) => {
        this._commonHelper.hideLoader();

        this.getTranslateErrorMessage(error);
      });
    this.passwordSubmitted = false;
  }

  inputPhoneMaskValid() {
    if (this.basicInfoForm) {
      this.isPhoneInvalid = this.basicInfoForm.controls.phone.invalid;
    }
  }
  // convenience getter for easy access to form fields
  get bf() { return this.basicInfoForm.controls; }
  get cpf() { return this.changePasswordForm.controls; }

  createBasicInfoForm() {
    if (this.profile.imagePath !== null) {
      if (this.profile.imagePath !== '') {
        this.croppedImage = this.profile.imagePath;
      } else {
        this.profile.imagePath = this.croppedImage;
      }
    } else {
      this.profile.imagePath = this.croppedImage;
    }

    this.basicInfoForm = null;
    this.basicInfoForm = this._formBuilder.group({
      id: [this.profile.id],
      firstName: [this.profile.firstName, Validators.compose([Validators.required])],
      lastName: [this.profile.lastName, Validators.compose([Validators.required])],
      email: [this.profile.email, [Validators.required, Validators.email]],
      imagePath: [this.croppedImage],
      phone: [this.profile.phone],
      timezone: [this.profile.timezone, Validators.compose([Validators.required])],
      phoneMobile: [this.profile.phoneMobile]
    });
  }

  createAddressForm() {
    this.addressForm = null;
    if (this.profile.addresses == null) {
      this.profile.addresses = new ProfileAddress({});
      this.profile.addresses.id = 0;
    }
    this.addressForm = this._formBuilder.group({
      id: [this.profile.addresses.id],
      address1: [this.profile.addresses.address1],
      address2: [this.profile.addresses.address2],
      city: [this.profile.addresses.city],
      stateCode: [this.profile.addresses.stateCode],
      postalCode: [this.profile.addresses.postalCode],
      country: [this.profile.addresses.country],
      stateOrProvince: [this.profile.addresses.stateOrProvince]
    });
  }

  createChangePasswordForm() {
    this.changePasswordForm = null;
    this.changePasswordForm = this._formBuilder.group({
      id: [this.profile.id],
      oldPassword: [this.profileChangePassword.oldPassword, Validators.compose([Validators.required])],
      newPassword: [this.profileChangePassword.newPassword, Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(20)])],
      confirmPassword: [this.profileChangePassword.confirmPassword, Validators.compose([Validators.required])]
    }, {
      validator: MustMatch('newPassword', 'confirmPassword')
    });
  }

  getAllTimeZone() {
    this._commonHelper.showLoader();
    this._profileService.getAllTimeZone().then(response => {
      this._commonHelper.hideLoader();
      this.timeZoneList = response;
    },
      (error) => {
        this._commonHelper.hideLoader();
        this.getTranslateErrorMessage(error);
      });
  }

  openProfileCropper(): void {
    this.modalRef = this._modalService.open(ImageAreaSelectComponent, this.optionsForPopupDialog);
    // this.modalRef.componentInstance.dialogTitle = "Select Profile Photo";
    this.modalRef.componentInstance.dialogTitle =
      this._commonHelper.getInstanceTranlationData('MYPROFILE_DIALOG.TAB_BASIC.MESSAGE_PROFILE_PHOTO_SELECT');

    this.modalRef.result.then(imageBase64Data => {
      if (imageBase64Data != undefined) {
        if (imageBase64Data != '') {
          this.croppedImage = imageBase64Data;
        }
      }
    });
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

  //For password and Confirm Password Validate
  passwordValidate(changePassFrm: FormGroup) {
    let newPassword = changePassFrm.controls.newPassword.value;
    let confirmPassword = changePassFrm.controls.confirmPassword.value;

    if (confirmPassword.length <= 0) {
      return null;
    }

    if (confirmPassword !== newPassword) {
      return {
        doesMatchPassword: true
      };
    }
    return null;
  }

  onResetBasicInfoForm() {
    this.basicInfoForm.reset();
    this.profile = this._commonHelper.cloningObject(this.copyOfProfile);

    if (this.profile.imagePath !== null) {
      if (this.profile.imagePath !== '') {
        this.croppedImage = this.profile.imagePath;
      } else {
        this.profile.imagePath = this.croppedImage;
      }
    } else {
      this.profile.imagePath = this.croppedImage;
    }

    this.basicInfoForm.patchValue({ id: this.profile.id });
    this.basicInfoForm.patchValue({ firstName: this.profile.firstName });
    this.basicInfoForm.patchValue({ lastName: this.profile.lastName });
    this.basicInfoForm.patchValue({ email: this.profile.email });
    this.basicInfoForm.patchValue({ phone: this.profile.phone });
    this.basicInfoForm.patchValue({ phoneMobile: this.profile.phoneMobile });
    this.basicInfoForm.patchValue({ imagePath: this.croppedImage });
    this.basicInfoForm.patchValue({ timezone: this.profile.timezone });
  }

  onResetAddressForm() {
    this.addressForm.reset();
    this.profile = this._commonHelper.cloningObject(this.copyOfProfile);

    this.addressForm.patchValue({ id: this.profile.addresses.id });
    this.addressForm.patchValue({ address1: this.profile.addresses.address1 });
    this.addressForm.patchValue({ address2: this.profile.addresses.address2 });
    this.addressForm.patchValue({ city: this.profile.addresses.city });
    this.selectedStateCode = this.profile.addresses.stateCode;
    this.addressForm.patchValue({ stateCode: this.profile.addresses.stateCode });
    this.addressForm.patchValue({ postalCode: this.profile.addresses.postalCode });
    this.addressForm.patchValue({ country: this.profile.addresses.country });
  }

  onResetPasswordForm() {
    this.changePasswordForm.reset();
    this.changePasswordForm.patchValue({ id: this.profile.id });
  }

  onBack() {
    this._router.navigate(['/']);
  }

  getTranslateErrorMessage(error) {
    if (error.error != null && error.error.messageCode) {
      this._commonHelper.showToastrError(
        this._commonHelper.getInstanceTranlationData('MYPROFILE_DIALOG.' + error.error.messageCode.replace('.', '_').toUpperCase())
      );
    }
  }
}
