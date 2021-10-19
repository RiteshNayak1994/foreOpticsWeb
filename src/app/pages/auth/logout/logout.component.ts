import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../auth.service';

@Component({
  selector: 'app-logout',  
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService,
    private _router: Router) { }

  ngOnInit() {    
      this.authenticationService.logout();
      this._router.navigateByUrl('auth/login');
  }
}
