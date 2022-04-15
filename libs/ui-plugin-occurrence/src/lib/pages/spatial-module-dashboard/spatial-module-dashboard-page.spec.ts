import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpatialModuleDashboardPage } from './spatial-module-dashboard-page';

describe('SpatialModuleComponent', () => {
  let component: SpatialModuleDashboardPage;
  let fixture: ComponentFixture<SpatialModuleDashboardPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpatialModuleDashboardPage ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpatialModuleDashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
