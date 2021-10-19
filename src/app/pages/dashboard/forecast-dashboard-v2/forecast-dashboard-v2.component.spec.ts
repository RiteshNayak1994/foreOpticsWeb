import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForecastDashboardV2Component } from './forecast-dashboard-v2.component';

describe('ForecastDashboardV2Component', () => {
  let component: ForecastDashboardV2Component;
  let fixture: ComponentFixture<ForecastDashboardV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForecastDashboardV2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForecastDashboardV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
