import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScRiskSummaryDashboardComponent } from './sc-risk-summary-dashboard.component';

describe('ScRiskSummaryDashboardComponent', () => {
  let component: ScRiskSummaryDashboardComponent;
  let fixture: ComponentFixture<ScRiskSummaryDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScRiskSummaryDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScRiskSummaryDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
