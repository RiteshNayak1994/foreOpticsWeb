import { Component, OnInit } from '@angular/core';
@Component({
    templateUrl: 'dashboard.component.html'
})

export class DashboardComponent implements OnInit {

    currentDate: Date;
    year: any;

    constructor() {
        this.currentDate = new Date();
        this.year = this.currentDate.getFullYear();
     }

    ngOnInit(): void { }
}
