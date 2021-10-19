import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwotDashboardComponent } from './swot-dashboard.component';

describe('SwotDashboardComponent', () => {
  let component: SwotDashboardComponent;
  let fixture: ComponentFixture<SwotDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SwotDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SwotDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
