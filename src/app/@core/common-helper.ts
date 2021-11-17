import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { TaskType, NoteType, Warehouse } from './enum';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import heic2any from 'heic2any';
import * as $ from "jquery";
@Injectable()

export class CommonHelper {
    permissions: string;
    showLoadingPanel: number = 0;
    loggedUserDetail: any;

    constructor(public _httpClient: HttpClient,
        public _router: Router,
        private _toastrService: ToastrService,
        private _translateService: TranslateService
    ) { }

    fileTypeswithExt = {
        'heic': 'image',
        'jpg': 'image',
        'jpeg': 'image',
        'tif': 'image',
        'psd': 'image',
        'bmp': 'image',
        'png': 'image',
        'nef': 'image',
        'tiff': 'image',
        'cr2': 'image',
        'dwg': 'image',
        'cdr': 'image',
        'ai': 'image',
        'indd': 'image',
        'pin': 'image',
        'cdp': 'image',
        'skp': 'image',
        'stp': 'image',
        '3dm': 'image',
        'mp3': 'audio',
        'wav': 'audio',
        'wma': 'audio',
        'mod': 'audio',
        'm4a': 'audio',
        'compress': 'compress',
        'zip': 'compress',
        'rar': 'compress',
        '7z': 'compress',
        'lz': 'compress',
        'z01': 'compress',
        'bz2': 'compress',
        'gz': 'compress',
        'pdf': 'pdf',
        'xls': 'xls',
        'xlsx': 'xls',
        'ods': 'xls',
        'mp4': 'video',
        'avi': 'video',
        'wmv': 'video',
        'mpg': 'video',
        'mts': 'video',
        'flv': 'video',
        '3gp': 'video',
        'vob': 'video',
        'm4v': 'video',
        'mpeg': 'video',
        'm2ts': 'video',
        'mov': 'video',
        'doc': 'doc',
        'docx': 'doc',
        'eps': 'doc',
        'txt': 'doc',
        'odt': 'doc',
        'rtf': 'doc',
        'ppt': 'ppt',
        'pptx': 'ppt',
        'pps': 'ppt',
        'ppsx': 'ppt',
        'odp': 'ppt'
    };

    workFlowCode: any;
    globalMinDate: Date = new Date('01/01/1901');
    globalDateFormate: string = 'MM/DD/YYYY';
    globalDateFormateWithTime: string = 'MM/DD/YY hh:mm a';
    globalSQLDateFormateWithTime: string = 'MM/dd/yy hh:mm ttt';
    globalSQLDateFormate: string = 'MM/dd/yyyy';
    globalDatePickerFormate: string = 'mm/dd/yy';
    globalLongDateFormate: string = 'MMM DD, YYYY hh:mm a';
    globalLongDateFormateWithoutTime: string = 'MMM DD, YYYY';
    globalTimeFormate: string = 'hh:mm a';
    globalDateMask: string = '99/99/9999';
    globalDateMaskWithTime: string = '99/99/9999 99:99 (\\P\\M)|(\\A\\M)|(\\p\\m)|(\\a\\m)';
    globalTimeMask: string = '99:99 (\\P\\M)|(\\A\\M)|(\\p\\m)|(\\a\\m)';
    globalDatePlaceholder: string = 'MM/DD/YYYY';
    globalTimePlaceholder: string = 'HH:MM TT';
    globalDatePlaceholderWithTime: string = 'MM/DD/YYYY HH:MM TT';
    globalPhoneFormate: string = '+0 (000) 000-0000';
    globalInputPhoneFormate: string = '(000)-000-0000';
    globalSsnFormate: string = '000-00-0000';
    DefaultPageSize: number = 100;
    globalRowsPerPageOptions: number[] = [5, 10, 20, 50, 100];
    globalAvatarRelativePath = "assets/images/avatars/";

    validateAllFormFields(formGroup: FormGroup) {
        Object.keys(formGroup.controls).forEach((field) => {
            const control = formGroup.get(field);
            if (control instanceof FormControl) {
                control.markAsTouched({ onlySelf: true });
            } else if (control instanceof FormGroup) {
                this.validateAllFormFields(control);
            }
        });
    }

    //check if the user have required permission to access dashboard
    havePermission(enumVal: any): boolean {
        let currentPermissionHash = [];
        if (Array.isArray(enumVal)) {
            currentPermissionHash = enumVal;
        } else {
            currentPermissionHash.push(enumVal);
        }

        //get logged in user information
        let user = this.loggedUserDetail;
        if (user != undefined) {
            this.permissions = user.userPermissionHash;
            if (this.permissions == undefined || this.permissions.length == 0) {
                return false;
            }

            let per: any[] = this.permissions.match(/.{1,4}/g);
            let ans: boolean = false
            for (let p of per) {
                currentPermissionHash.forEach(element => {
                    if (p == element) {
                        return ans = true;
                    }
                });
            }
            return ans;
        }
    }

    setLoggedUserDetail(val: any) {
        if (val) {
            this.loggedUserDetail = val;
        }
        else {
            this.loggedUserDetail = undefined;
        }
    }

    getLoggedUserDetail() {
        return this.loggedUserDetail;
    }

    // Compare two values for validation
    compareValues(firstControl, secondControl): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const first = control.get(firstControl).value;
            const second = control.get(secondControl).value;
            if (first == second) { return { 'Match': true } }
            return null
        }
    }

    //#region Spin Loader

    hideLoader() {
        $('#nb-global-spinner').hide();
    }
    showLoader() {
        $('#nb-global-spinner').show();
    }

    setLoaderHide() {
        $('#nb-global-spinner').hide();
    }

    removeAllSearchingFilterLocalStorage() {
        //clear logged user detail
        this.setLoggedUserDetail(null);

        //reseller
        if (localStorage.getItem('rssp') != null) {
            localStorage.removeItem('rssp');
        }
        //other-contact
        if (localStorage.getItem('oasp') != null) {
            localStorage.removeItem('oasp');
        }
        //account-prospect
        if (localStorage.getItem('cpsp') != null) {
            localStorage.removeItem('cpsp');
        }
        //account        
        if (localStorage.getItem('asp') != null) {
            localStorage.removeItem('asp');
        }
        //contact list local storage remove    
        if (localStorage.getItem('osp-lender') != null) {
            localStorage.removeItem('osp-lender');
        }
        if (localStorage.getItem('conlist') != null) {
            localStorage.removeItem('conlist');
        }
        //commission payment list local storage remove        
        if (localStorage.getItem('commpaylst') != null) {
            localStorage.removeItem('commpaylst');
        }
        //commission list local storage remove
        if (localStorage.getItem('commlst') != null) {
            localStorage.removeItem('commlst');
        }

        //leads local storage remove
        if (localStorage.getItem('lsp') != null) {
            localStorage.removeItem('lsp');
        }
        //prospects local storage remove
        if (localStorage.getItem('psp') != null) {
            localStorage.removeItem('psp');
        }
        //orders local storage remove
        if (localStorage.getItem('osp') != null) {
            localStorage.removeItem('osp');
        }
        //product local storage remove
        if (localStorage.getItem('prsp') != null) {
            localStorage.removeItem('prsp');
        }
        //investors local storage remove
        if (localStorage.getItem('isp') != null) {
            localStorage.removeItem('isp');
        }
        //setter dashboard local storage remove
        if (localStorage.getItem('sdsp') != null) {
            localStorage.removeItem('sdsp');
        }

        //uram user local storage remove
        if (localStorage.getItem('uramusp') != null) {
            localStorage.removeItem('uramusp');
        }
        //role local storage remove
        if (localStorage.getItem('uramrsp') != null) {
            localStorage.removeItem('uramrsp');
        }
        //permission-set local storage remove
        if (localStorage.getItem('urampsp') != null) {
            localStorage.removeItem('urampsp');
        }

        if (localStorage.getItem('filterValues') != null) {
            localStorage.removeItem('filterValues');
        }
    }

    //#endregion

    //#region Toastr Message

    showToastrSuccess(message: string) {
        this._toastrService.success(message);
    }
    overLayContnr;
    showToastrInfo(message: string, elementRef?) {
        //this.overLayContnr = this._toastrService["overlay"]._overlayContainer;
        //let toasterContainerDirective = new ToastContainerDirective($('.importWizard .modal-dialog')[0]);
        if (elementRef) {
            let toasterContainerDirective = new ToastContainerDirective(elementRef);
            this._toastrService.overlayContainer = toasterContainerDirective;
        }
        //this._toastrService["overlay"]._overlayContainer = $('.importWizard .modal-dialog')[0];
        this._toastrService.info(message);
        //this._toastrService["overlay"]._overlayContainer = this.overLayContnr;
    }

    showToastrWarning(message: string) {
        this._toastrService.warning(message);
    }

    showToastrError(message: string) {
        this._toastrService.error(message);
    }

    copyURL(val: string) {
        let selBox = document.createElement('textarea');
        selBox.style.position = 'fixed';
        selBox.style.left = '0';
        selBox.style.top = '0';
        selBox.style.opacity = '0';
        selBox.value = val;
        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        document.execCommand('copy');
        document.body.removeChild(selBox);
    }

    //#endregion

    //#region Translation Locale related function

    setLanguage() {
        let lang: string = localStorage.getItem('LocaleLang');
        if (lang === null || lang === undefined) {
            lang = 'en';
            localStorage.setItem('LocaleLang', lang);
        }

        this._translateService.setDefaultLang(lang);
        this._translateService.use(lang);
    }

    updateLanguage(lang: string) {
        localStorage.setItem('LocaleLang', lang);
        this.setLanguage();
    }

    getTranlationData(key: string) {
        return this._translateService.get(key).toPromise();
    }

    getInstanceTranlationData(key: string, interpolateParams?: Object) {
        if (key == null || key === "") {
            return key;
        }
        return this._translateService.instant(key, interpolateParams);
    }

    createDynamicControlId(idPrefixValue, idName) {

        if (idPrefixValue.length == 0) {
            idPrefixValue = 'txt-'
        }
        if (idName.length == 0) {
            return idPrefixValue + "-0";
        }
        return idPrefixValue + "-" + idName.replace('-', '').replace(/ +/g, '-').toLowerCase();
    }

    //cloning object1
    cloningObject(object: any) {
        return Object.assign({}, object);
    }

    //#endregion

    //#region clone data function

    cloneObject(obj: any) {
        return JSON.parse(JSON.stringify(obj));
    }

    //#endregion

    //get phone number add prefix country code
    getPhoneNoPrefixCountryCode(phoneValue) {
        //check phone undefined
        if (phoneValue == undefined) {
            return null;
        }
        //check phone null
        if (phoneValue == null) {
            return null;
        }
        //check phone length
        if (phoneValue.length == 0) {
            return null;
        }
        if (phoneValue.trim() == "") {
            return null;
        }

        phoneValue = phoneValue.replace("-", "").replace("-", "");
        //check phone isNan
        if (isNaN(phoneValue)) {
            return null
        }
        //check phone 10 digit
        // if (phoneValue.length != 10) {
        //     return null
        // }  
        return '1' + phoneValue;
    }

    //get phone number with hyper link
    getPhoneNoWithHyperLink(phoneValue) {
        let phone = this.getPhoneNoPrefixCountryCode(phoneValue);
        if (phone != null) {
            return 'tel:+' + phone;
        }
        return null;
    }

    //load filter type drop-down options
    loadFilterTypeOptions(): any {
        return [
            {
                label: 'CRM.ACTIVITY.FILTER_DROPDOWN.ALL',
                value: { value: 'ALL', ActivitySubTypeId: 0 }
            },
            {
                label: 'CRM.ACTIVITY.FILTER_DROPDOWN.CALLS',
                value: { value: 'TASK', ActivitySubTypeId: TaskType.Call }
            },
            {
                label: 'CRM.ACTIVITY.FILTER_DROPDOWN.EMAILS',
                value: { value: 'TASK', ActivitySubTypeId: TaskType.Email }
            },
            {
                label: 'CRM.ACTIVITY.FILTER_DROPDOWN.VOICEMAILS',
                value: { value: 'TASK', ActivitySubTypeId: TaskType.Voicemail }
            },
            {
                label: 'CRM.ACTIVITY.FILTER_DROPDOWN.FOLLOWUP',
                value: { value: 'TASK', ActivitySubTypeId: TaskType.FollowUp }
            },
            {
                label: 'CRM.ACTIVITY.FILTER_DROPDOWN.NOTES',
                value: { value: 'NOTE', ActivitySubTypeId: NoteType.Note }
            },
            {
                label: 'CRM.ACTIVITY.FILTER_DROPDOWN.APPOINTMENTS',
                value: { value: 'EVENT', ActivitySubTypeId: 0 }
            },
            {
                label: 'CRM.ACTIVITY.FILTER_DROPDOWN.TAGS',
                value: { value: 'TAG', ActivitySubTypeId: 0 }
            }
        ]
    }

    allowOnlyNumericValues(event) {
        if ((event.which < 48 || event.which > 57)) {
            event.preventDefault();
        }
    }

    getWarehouseName(warehouseID) {
        switch (warehouseID) {
            case Warehouse.German:
                return "Germany";
            case Warehouse.Taiwan:
                return "Taiwan";
            default:
                return "US";
        }
    }

    changeStatusvalue(statusName) {
        switch (statusName) {
            case "Completed":
                return "Complete"
            case "Canceled":
                return "Cancel"
            case "Rescheduled":
                return "Reschedule"
            default:
                return statusName;
        }
    }

    getDefaultTagColor(entityTag, size = 6) {
        let style = '';
        entityTag.forEach(tag => {
            if (tag.isDefault) {
                style = `${size}px solid ${tag.color}`;
            }
        });
        return style;
    }

    fillTagList(response) {
        let tagList = [];
        response.forEach(element => {
            if (!element.isDefault) {
                switch (element.shape.toLowerCase()) {
                    case 'clock':
                        tagList.push({ tagClass: 'far fa-clock', tagColor: element.color, toolTipMsg: element.name });
                        break;
                    case 'square':
                        tagList.push({ tagClass: 'fas fa-square', tagColor: element.color, toolTipMsg: element.name });
                        break;
                    case 'circle':
                        tagList.push({ tagClass: 'fas fa-circle', tagColor: element.color, toolTipMsg: element.name });
                        break;
                    case 'flag':
                        tagList.push({ tagClass: 'fas fa-flag', tagColor: element.color, toolTipMsg: element.name });
                        break;
                    case 'heart':
                        tagList.push({ tagClass: 'fas fa-heart', tagColor: element.color, toolTipMsg: element.name });
                        break;
                    case 'vision':
                        tagList.push({ tagClass: 'fas fa-low-vision', tagColor: element.color, toolTipMsg: element.name });
                        break;
                    case 'deaf':
                        tagList.push({ tagClass: 'fas fa-deaf', tagColor: element.color, toolTipMsg: element.name });
                        break;
                    case 'calendar':
                        tagList.push({ tagClass: 'fas fa-calendar', tagColor: element.color, toolTipMsg: element.name });
                        break;
                    case 'physically challenged':
                        tagList.push({ tagClass: 'fas fa-wheelchair', tagColor: element.color, toolTipMsg: element.name });
                        break;
                    case 'child':
                        tagList.push({ tagClass: 'fas fa-child', tagColor: element.color, toolTipMsg: element.name });
                        break;
                    default:
                        break;
                }
            }
        });
        return tagList;
    }

    blobToFile = (theBlob: Blob, fileName: string): File => {
        let b: any = theBlob;
        //A Blob() is almost a File() - it's just missing the two properties below which we will add
        b.lastModified = new Date();
        b.name = fileName;
        //Cast to a File() type
        return <File>theBlob;
    }

    ConvertImagetoJpeg(event: any): File {
        debugger;
        if (event.currentTarget && event.currentTarget.files && event.currentTarget.files[0]) {
            //let fileext = event.currentTarget.files[0].name.split('.').reverse()[0];
            //if (fileext == 'heic' || fileext == 'heif') {
            let f: File;
            //RECEIVE IMAGE
            f = event.currentTarget.files[0];
            if (!f) {
                return;
            }

            let blob: Blob = f;
            let file: File = f;
            let convProm: Promise<any>;
            //CONVERT HEIC TO JPG
            convProm = heic2any({ blob, toType: "image/jpeg" }).then((jpgBlob: Blob): File => {
                //Change the name of the file according to the new format
                let newName = f.name.replace(/\.[^/.]+$/, ".jpeg");
                //Convert blob back to file
                return this.blobToFile(jpgBlob, newName);
                // this.uploader.queue = [];
                // this.uploader.addToQueue([file]);
                // this.UploadFiles(fileext);
            })
                .catch(err => {
                    console.log("Upload Images : " + err);
                });

            //ADD IMAGE FILE TO CROPPERJS EDITOR
            convProm.then(() => {
                let reader = new FileReader();
                //Add file to FileReader
                if (file) {
                    reader.readAsDataURL(file);
                }
                //Listen for FileReader to get ready
                reader.onload = () => {
                    return reader.result;
                }
            });
            //}  
        }
        return;
    }

    getGeneralTranslateErrorMessage(error) {
        if (error.error != null && error.error.message) {
            console.log(error.error);
            console.log(this.getInstanceTranlationData(error.error.message));
            this.showToastrError(
                this.getInstanceTranlationData(error.error.message)
            );
        }
    }

    isNullBlankUndefined(value) {
        return value == undefined || value == null || value.length == 0;
    }
}

export enum enumPermissions {
    //User
    ListUsers = "OI9e",
    ViewUser = "rTfd",
    AddUser = "lM8T",
    EditUser = "o8N8",
    DeleteUser = "OrIo",
    //Role
    ListRoles = "tdk0",
    ViewRole = "Dz9B",
    AddRole = "VwQx",
    EditRole = "ka5O",
    DeleteRole = "tDVk",
    //PermissionSets
    ListPermissionSets = "XloC",
    ViewPermissionSet = "4Cvd",
    AddPermissionSet = "HFmQ",
    EditPermissionSet = "uXa9",
    DeletePermissionSet = "X4Hu",
    //Permissions
    ListPermissions = "Pl60",

    //Product
    ListProducts = "t0CK",
    ViewProduct = "vcaw",
    AddProduct = "2veb",
    EditProduct = "VAg3",
    ApproveProduct = "C8XJ",
    SubmitProduct = "lQ6N",
    DeleteProduct = "X4Cu",

    //Account
    ListAccounts = "9b0b",
    ViewAccount = "e022",
    AddAccount = "9b6f",
    EditAccount = "a6bb",
    DeleteAccount = "4232",

    //Dealers
    ListDealers = "fo0a",
    ViewDealer = "fo1a",
    AddDealer = "fo2a",
    EditDealer = "fo3a",
    DeleteDealer = "fo4a",
    DealerConfiguration = "fo5a",

    // Customer Management
    ListCustomers = "s0r7",
    ViewCustomer = "s0r8",
    AddCustomer = "s0r9",
    EditCustomer = "s0r6",
    DeleteCustomer = "s1r6",

    // Orders
    ListOrders = "G6hT",
    ViewOrder = "dNgG",
    AddOrder = "Bzcm",
    EditOrder = "Ezcm",
    CancelOrder = "d6ae",
    DeleteOrder = "26e7",
    OrderStage = "018b",
    TasksUpdate = "23s1",
    NotesUpdate = "23S1",

    //Impersonate Login 
    DealerLoginImpersonate = "id01",
    CustomerLoginImpersonate = "ic01",
    ProductsLoginImpersonate = "ip01",
    MarketingLoginImpersonate = "im01",
    SalesLoginImpersonate = "is01",
    WarrantyLoginImpersonate = 'iw01',

    //Tag Management
    ListTags = "t0m1",
    ViewTag = "t0m2",
    AddTag = "t0m3",
    EditTag = "t0m4",

    //Tenants
    ListTenants = "190b",
    ViewTenant = "LKVQ",
    AddTenant = "x7lV",
    EditTenant = "8kMb",

    //Dashboard
    SuperAdminDashboard = "zZzZ",//"qlwg",
    TenantAdminDashboard = "qf4M",

    DeleteTenant = "KOc2",
    TenantConfiguration = 'mcK2',
    WelcomeDashboard = "mk34",

    //Profile
    EditProfile = "CMso",

    // Sales Reps
    ListSalesReps = "u0c1",
    ViewListSalesRep = "u0c2",
    AddSalesRep = "u0c3",
    EditSalesRep = "u0c4",
    DeleteSalesRep = "u0c5",
}