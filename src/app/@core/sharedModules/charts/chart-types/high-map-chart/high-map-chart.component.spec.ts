import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HighMapChartComponent } from './high-map-chart.component';

describe('HighMapChartComponent', () => {
  let component: HighMapChartComponent;
  let fixture: ComponentFixture<HighMapChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HighMapChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HighMapChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
