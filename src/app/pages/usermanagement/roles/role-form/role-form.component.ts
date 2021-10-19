import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { CommonHelper, enumPermissions } from '../../../../@core/common-helper';
import { ReferenceType } from '../../../../@core/enum';

import { Role } from '../role.model';
import { RolesService } from '../role.service';
import { CommonService } from '../../../../@core/sharedServices/common.service';

@Component({
  selector: 'form-dialog',
  templateUrl: './role-form.component.html',
  styleUrls: ['./role-form.component.scss']
})

export class RoleFormComponent implements OnInit {
  //For Role Form
  roleForm: FormGroup;

  role: Role;
  roleId: number = 0;
  formMode: string;
  submitted = false;

  permissionSets: any;
  internalRoleRef: ReferenceType;

  selectedPermissionSet: any;

  //permission variable
  isViewRole: boolean = false;
  isAddRole: boolean = false;
  isEditRole: boolean = false;
  isDeleteRole: boolean = false;

  //For Validation
  role_validation_messages = {
    'name': [
      { type: 'required', message: 'URAM.ROLE.DETAIL.MESSAGE_NAME' },
      { type: 'minlength', message: 'URAM.ROLE.DETAIL.MESSAGE_NAME_MIN' },
      { type: 'maxlength', message: 'URAM.ROLE.DETAIL.MESSAGE_NAME_MAX' },
    ],
    'internalRoleId': [
      { type: 'required', message: 'URAM.ROLE.DETAIL.MESSAGE_INTERNALEROLE_SELECT' },
    ]
  }

  constructor(private _router: Router,
    private _formBuilder: FormBuilder,
    private _activeRoute: ActivatedRoute,
    private _rolesService: RolesService,
    private _commonHelper: CommonHelper,
    private _commonService:CommonService) {
    //If Record Edit then set record edit id
    this._activeRoute.params.subscribe(param => {
      if (param['id'] != undefined) {
        if (param['id'] != null) {
          this.roleId = param['id'];
        }
      }
    });

    //Set Logged user have permission
    this.isViewRole = this._commonHelper.havePermission(enumPermissions.ViewRole);
    this.isAddRole = this._commonHelper.havePermission(enumPermissions.AddRole);
    this.isEditRole = this._commonHelper.havePermission(enumPermissions.EditRole);
    this.isDeleteRole = this._commonHelper.havePermission(enumPermissions.DeleteRole);
  }

  ngOnInit() {    
    if (this.roleId > 0) {
      this.formMode = 'EDIT';
      this.getRoleDetail();
    } else {
      this.formMode = 'ADD';
      this.roleForm = this.createRoleForm();
      this.getPermissionSets();
      this.getInternalRoleRef();
    }
  }

  createRoleForm(): FormGroup {
    if (this.formMode == 'ADD') {
      this.role = new Role({});
      return this._formBuilder.group({
        id: [this.role.id],
        name: [this.role.name, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50)])],
        internalRoleId: [this.role.internalRoleId, Validators.compose([Validators.required])],
        permissionSetFormArray: new FormArray([]),
        permissionSetId: [this.role.permissionSetId],
        permissionSetName: [this.role.permissionSetName],
      });
    }
    else if (this.formMode == 'EDIT') {
      return this._formBuilder.group({
        id: [this.role.id],
        name: [this.role.name, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50)])],
        internalRoleId: [this.role.internalRoleId, Validators.compose([Validators.required])],
        permissionSetFormArray: new FormArray([]),
        permissionSetId: [this.role.permissionSetId],
        permissionSetName: [this.role.permissionSetName],
      });
    }
  }

  saveForm(formData) {
    this.submitted = true;

    this.selectedPermissionSet = this.roleForm.value.permissionSetFormArray
      .map((v, i) => v ? this.permissionSets[i].id : null)
      .filter(v => v !== null);

    formData.permissionSetId = this.selectedPermissionSet.toString();
    if (this.roleForm.invalid) {
      this.validateAllFormFields(this.roleForm);
      return;
    }
    if (this.selectedPermissionSet.length == 0) {
      return;
    }

    
    if (this.formMode == 'ADD') {
      this._commonHelper.showLoader();
      this._rolesService.addNewRole(formData).then(response => {
        this._commonHelper.hideLoader();
        this._commonHelper.showToastrSuccess(
          this._commonHelper.getInstanceTranlationData('URAM.ROLE.DETAIL.MESSAGE_ROLE_ADD')
        );
        this.closeForm();
      },
        (error) => {
          this._commonHelper.hideLoader();
          this.getTranslateErrorMessage(error);
        });
    }
    else if (this.formMode == 'EDIT') {
      this._commonHelper.showLoader();
      this._rolesService.updateRole(formData).then(response => {        
        this._commonHelper.hideLoader();
        this._commonHelper.showToastrSuccess(
          this._commonHelper.getInstanceTranlationData('URAM.ROLE.DETAIL.MESSAGE_ROLE_UPDATE')
          );
        this.closeForm();
      },
        (error) => {          
          this._commonHelper.hideLoader();
          this.getTranslateErrorMessage(error);
        });
    }
  }
  
  createPermissionSetId(permissionSetId){
    if(permissionSetId.length == 0){
      return "chk-0";
    }
    return "chk-" + permissionSetId;//permissionSet.replace(/ +/g, '-').toLowerCase();
  }
  getRoleDetail() {
    this._commonHelper.showLoader();
    this._rolesService.getRolesById(this.roleId).then(response => {      
      this.role = response as Role;
      this.roleForm = this.createRoleForm();

      this.getPermissionSets();
      this.getInternalRoleRef();
      this._commonHelper.hideLoader();
    },
      (error) => {
        this._commonHelper.hideLoader();
        this.getTranslateErrorMessage(error);
      });
  }

  addCheckboxes() {
    this._commonHelper.showLoader();
    let selectedPermissionSetArray = [];
    if (this.role.permissionSetId != undefined) {
      let selected = this.role.permissionSetId;
      selectedPermissionSetArray = selected.split(',');
    }
    this.permissionSets.map((o, i) => {
      let isChecked = false;
      if (selectedPermissionSetArray.length > 0) {
        selectedPermissionSetArray.forEach(element => {
          if (o.id == element) {
            isChecked = true;
          }
        });
      }
      const control = new FormControl(isChecked); // if first item set to true, else false              
      (this.roleForm.controls.permissionSetFormArray as FormArray).push(control);
    });
    this._commonHelper.hideLoader();
  }

  getPermissionSets() {

    this._commonHelper.showLoader();
    this._rolesService.getPermissionSet().then(
      response => {
        this._commonHelper.hideLoader();
        this.permissionSets = response;        
        this.addCheckboxes();
      },
      (error) => {
        this._commonHelper.hideLoader();
        this.getTranslateErrorMessage(error);
      });
  }

  getInternalRoleRef() {
    let data = {
      refType: "InternalRole"
    }
    this._commonHelper.showLoader();
    this._commonService.getReferenceTypeByType(data).then(response => {
      this._commonHelper.hideLoader();
      this.internalRoleRef = response as ReferenceType;
    },
      (error) => {
        this._commonHelper.hideLoader();
        this.getTranslateErrorMessage(error);
      });
  }

  closeForm() {
    this._router.navigate(['settings/uram/roles']);
  }

  // convenience getter for easy access to form fields
  get f() { return this.roleForm.controls; }
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

  getTranslateErrorMessage(error) {
      if (error.error != null && error.error.messageCode) {
        this._commonHelper.showToastrError(
        this._commonHelper.getInstanceTranlationData('URAM.ROLE.' + error.error.messageCode.replace('.', '_').toUpperCase())
        );
      }
  }
}
