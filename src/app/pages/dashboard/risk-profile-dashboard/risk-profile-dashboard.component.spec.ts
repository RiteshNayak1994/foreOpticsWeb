import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskProfileDashboardComponent } from './risk-profile-dashboard.component';

describe('RiskProfileDashboardComponent', () => {
  let component: RiskProfileDashboardComponent;
  let fixture: ComponentFixture<RiskProfileDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskProfileDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskProfileDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
