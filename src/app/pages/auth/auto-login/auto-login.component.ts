import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonHelper } from '../../../@core/common-helper';
import { AuthenticationService } from '../auth.service';

@Component({
  selector: 'app-auto-login',
  templateUrl: './auto-login.component.html',
  styleUrls: ['./auto-login.component.scss']
})
export class AutoLoginComponent implements OnInit {

  kParam: string = null;
  constructor(private _activatedRoute: ActivatedRoute,
    private _commonHelper: CommonHelper,
    private _router: Router,
    private _authenticationService: AuthenticationService) {

    this._activatedRoute.queryParams.subscribe(params => {
      this.kParam = params['k'];
    });
  }
  ngOnInit() {
    if (this.kParam == null || this.kParam.length == 0) {
      this._router.navigate(['/auth/login']);
    }

    const params = {
      accessToken: this.kParam,
      userHash: ''
    };

    this._commonHelper.showLoader();
    this._authenticationService.validateUserAccessToken(params).then((response: any) => {
      this._commonHelper.setLoaderHide();
      if (response != null) {
        //set logged user detail
        this._commonHelper.setLoggedUserDetail(response);
        //set logged user session token in local storage
        localStorage.setItem('LoggedUserSessionToken', response.accessToken);

        this._commonHelper.updateLanguage('en');
        this._commonHelper.removeAllSearchingFilterLocalStorage();

        this._router.navigate(['/dashboard']);
      } else {
        this._commonHelper.removeAllSearchingFilterLocalStorage();
        this._commonHelper.setLoggedUserDetail(null);
        this._router.navigate(['/auth/login']);
      }
    }, (error) => {
      this._commonHelper.setLoaderHide();
      this._commonHelper.setLoggedUserDetail(null);
      //logged user session token remove local storage remove
      if (localStorage.getItem('LoggedUserSessionToken') != null) {
        localStorage.removeItem('LoggedUserSessionToken');
      }
      this._router.navigate(['/auth/login']);
    });
  }
}
