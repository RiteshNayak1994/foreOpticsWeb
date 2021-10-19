import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { CommonHelper, enumPermissions } from '../../../../@core/common-helper';
import { PermissionSet } from '../permissionset.model';
import { PermissionSetService } from '../permissionset.service';

@Component({
  selector: 'permissionsets-form-dialog',
  templateUrl: './permissionset-form.component.html',
  styleUrls: ['./permissionset-form.component.scss']
})

export class PermissionSetFormComponent implements OnInit {

  //Form Group
  permissionSetForm: FormGroup;

  //PermissionSet/ permission data source
  permissionSet: PermissionSet;
  permissions: any;

  //Form related flag
  permissionSetId: number = 0; // for Edit
  formMode: string; //Form mode
  submitted = false;
  selectedPermissions: any;

  //permission variable    
  isViewPermissionSet: boolean = false;
  isAddPermissionSet: boolean = false;
  isEditPermissionSet: boolean = false;
  isDeletePermissionSet: boolean = false;

  //For Validation    
  permissionSet_validation_messages = {
    'name': [
      { type: 'required', message: 'URAM.PERMISSION_SET.DETAIL.MESSAGE_PERMISSIONSET' },
      { type: 'minlength', message: 'URAM.PERMISSION_SET.DETAIL.MESSAGE_PERMISSIONSET_MIN' },
      { type: 'maxlength', message: 'URAM.PERMISSION_SET.DETAIL.MESSAGE_PERMISSIONSET_MAX' },
    ]
  }

  constructor(private _router: Router,
    private _activeRoute: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private _permissionsetService: PermissionSetService,
    private _commonHelper: CommonHelper) {
    //If Record Edit then set record edit id
    this._activeRoute.params.subscribe(param => {
      if (param['id'] != undefined) {
        if (param['id'] != null) {
          this.permissionSetId = param['id'];
        }
      }
    });

    //Set Logged user have permission
    this.isViewPermissionSet = this._commonHelper.havePermission(enumPermissions.ViewPermissionSet);
    this.isAddPermissionSet = this._commonHelper.havePermission(enumPermissions.AddPermissionSet);
    this.isEditPermissionSet = this._commonHelper.havePermission(enumPermissions.EditPermissionSet);
    this.isDeletePermissionSet = this._commonHelper.havePermission(enumPermissions.DeletePermissionSet);
  }

  ngOnInit() {    
    if (this.permissionSetId > 0) {
      this.formMode = 'EDIT';
      this.getPermissionSetDetail();

    } else {
      this.formMode = 'ADD';
      this.permissionSetForm = this.createPermissionSetForm();
      this.getPermissions();
    }
  }

  getPermissionSetDetail() {
    this._commonHelper.showLoader();
    this._permissionsetService.getPermissionSetById(this.permissionSetId).then(response => {
      this._commonHelper.hideLoader();
      this.permissionSet = response as PermissionSet;
      this.permissionSetForm = this.createPermissionSetForm();
      this.getPermissions();
    }, (error) => {
      this._commonHelper.hideLoader();
      this.getTranslateErrorMessage(error);      
    });
  }

  getPermissions() {
    this._commonHelper.showLoader();
    this._permissionsetService.getAllActivePermissions().then(response => {
      let permissionsData = response as any;
      this.permissions = [];

      let permissionsGroupWise = new Set(permissionsData.map(item => item.groupName))

      permissionsGroupWise.forEach(g =>
        this.permissions.push({
          name: g,
          values: permissionsData.filter(i => i.groupName === g)
        }
        ));
        this._commonHelper.hideLoader();
      this.addCheckboxes();
    }, (error) => {
      this._commonHelper.hideLoader();
      this.getTranslateErrorMessage(error);      
    });
  }

  checkChange(event) {
    this._commonHelper.showLoader();
    this.permissions.forEach(groupElement => {
      groupElement.values.forEach(item => {
        let controlItem = event.id.split('-');        
        if (item.id == controlItem[1]) {
          item.isChecked = event.checked;
        }
      });
    });
    this._commonHelper.hideLoader();
  }

  createPermissionId(permissions){
    if(permissions.id.length == 0){
      return "chk-0";
    }
    return "chk-" + permissions.id; //+ "-" + permissions.name.replace(/ +/g, '-').toLowerCase();
  }

  saveForm(formData) {
    this.submitted = true;
    this.selectedPermissions = '';
    this.permissions.forEach(groupElement => {
      groupElement.values.forEach((item, i) => {   
        if (item.isChecked) {          
          this.selectedPermissions += item.id.toString() + ',';
        }
      });
    });
    
    if ((this.selectedPermissions.charAt(this.selectedPermissions.length - 1)) == ",") {
      this.selectedPermissions = this.selectedPermissions.substring(0, this.selectedPermissions.length - 1);
    }
    
    formData.permissionId = this.selectedPermissions.toString();
    if (this.permissionSetForm.invalid) {
      this.validateAllFormFields(this.permissionSetForm);
      return;
    }
    if (this.selectedPermissions.length == 0) {
      return;
    }

    
    if (this.formMode == 'ADD') {
      this._commonHelper.showLoader();
      this._permissionsetService.addPermissionSet(formData).then(response => {
        this._commonHelper.hideLoader();
        this._commonHelper.showToastrSuccess(
          this._commonHelper.getInstanceTranlationData('URAM.PERMISSION_SET.DETAIL.MESSAGE_PERMISSIONSET_ADD')
          );
        this.closeForm();
      },
        (error) => {
          this._commonHelper.hideLoader();
          this.getTranslateErrorMessage(error);
        });
    } else if (this.formMode == 'EDIT') {
      this._commonHelper.showLoader();
      this._permissionsetService.updatePermissionSet(formData).then(response => {
        this._commonHelper.hideLoader();
        this._commonHelper.showToastrSuccess(
          this._commonHelper.getInstanceTranlationData('URAM.PERMISSION_SET.DETAIL.MESSAGE_PERMISSIONSET_UPDATE'));
        this.closeForm();
      },
        (error) => {
          this._commonHelper.hideLoader();
          this.getTranslateErrorMessage(error);
        });
    }
  }

  addCheckboxes() {
    this._commonHelper.showLoader();
    let selectedPermissionsArray = [];

    if (this.permissionSet.permissionId != undefined) {
      let selected = this.permissionSet.permissionId;
      selectedPermissionsArray = selected.split(',');
    }
    this.permissions.map((o, i) => {
      o.values.forEach(pValues => {
        let isChecked = false;
        if (selectedPermissionsArray.length > 0) {
          selectedPermissionsArray.forEach(element => {
            if (pValues.id == element) {
              isChecked = true;
            }
          });
        }
        pValues.isChecked = isChecked;
      });
    });
    this._commonHelper.hideLoader();
  }

  createPermissionSetForm(): FormGroup {
    if (this.formMode == 'ADD') {
      this.permissionSet = new PermissionSet({});
      return this._formBuilder.group({
        id: [this.permissionSet.id],
        name: [this.permissionSet.name, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50),])],
        permissionId: [this.permissionSet.permissionId],
        permissionName: [this.permissionSet.permissionName],
      });
    }
    else if (this.formMode == 'EDIT') {
      return this._formBuilder.group({
        id: [this.permissionSet.id],
        name: [this.permissionSet.name, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])],
        permissionId: [this.permissionSet.permissionId.toString()],
        permissionName: [this.permissionSet.permissionName],
      });
    }
  }

  closeForm() {
    this._router.navigate(['settings/uram/permissionsets']);
  }

  // convenience getter for easy access to form fields
  get f() { return this.permissionSetForm.controls; }
  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  getTranslateErrorMessage(error) {
      if (error.error != null && error.error.messageCode) {
        this._commonHelper.showToastrError(
          this._commonHelper.getInstanceTranlationData('CRM.PERMISSION_SET.' + error.error.messageCode.replace('.', '_').toUpperCase())
        );
      }
  }
}
