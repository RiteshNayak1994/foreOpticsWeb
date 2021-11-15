import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';

import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import * as $ from "jquery";

import { ThemeService } from '../../../@core/sharedServices/theme.service';
import { CommonHelper } from '../../../@core/common-helper';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: any;
  enableDarkMode: boolean = false;
  loggedInUserName: any;

  themes = [
    {
      value: 'default',
      name: 'Light'
    },
    {
      value: 'dark',
      name: 'Dark'
    }
  ];

  currentTheme = 'default';

  userMenu = [{ title: 'Profile' }, { title: 'Log out' }];

  constructor(private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private themeService: NbThemeService,
    private primeNgThemeService: ThemeService,
    private breakpointService: NbMediaBreakpointsService,
    private commonHelper: CommonHelper
    ) {
  }

  ngOnInit() {
    this.loggedInUserName = this.commonHelper.getLoggedUserDetail().name;
    this.currentTheme = this.themeService.currentTheme;

    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);

    this.themeService.onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => this.currentTheme = themeName);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(enableDarkMode: any) {
    if (enableDarkMode.checked) {
      this.themeService.changeTheme('dark');
      this.primeNgThemeService.switchTheme('dark');
      this.primeNgThemeService.highChartTheme.next('dark');
    }
    else {
      this.themeService.changeTheme('default');
      this.primeNgThemeService.switchTheme('default');
      this.primeNgThemeService.highChartTheme.next('default');
    }
  }

  toggleSidebar() {
    if ($('nb-sidebar').hasClass('compacted')) {
      $('nb-sidebar').removeClass('compacted');
      $('nb-sidebar').addClass('expanded');
    }
    else {
      $('nb-sidebar').removeClass('expanded');
      $('nb-sidebar').addClass('compacted');
    }
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }
}
