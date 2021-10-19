import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskTrendDasboardComponent } from './risk-trend-dasboard.component';

describe('RiskTrendDasboardComponent', () => {
  let component: RiskTrendDasboardComponent;
  let fixture: ComponentFixture<RiskTrendDasboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskTrendDasboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskTrendDasboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
