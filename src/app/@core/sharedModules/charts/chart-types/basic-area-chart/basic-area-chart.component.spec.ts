import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicAreaChartComponent } from './basic-area-chart.component';

describe('BasicAreaChartComponent', () => {
  let component: BasicAreaChartComponent;
  let fixture: ComponentFixture<BasicAreaChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasicAreaChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicAreaChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
