import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComboIndicatorComponent } from './combo-indicator.component';

describe('ComboIndicatorComponent', () => {
  let component: ComboIndicatorComponent;
  let fixture: ComponentFixture<ComboIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComboIndicatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComboIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
