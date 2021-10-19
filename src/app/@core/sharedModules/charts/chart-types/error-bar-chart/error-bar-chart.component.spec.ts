import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorBarChartComponent } from './error-bar-chart.component';

describe('ErrorBarChartComponent', () => {
  let component: ErrorBarChartComponent;
  let fixture: ComponentFixture<ErrorBarChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErrorBarChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
