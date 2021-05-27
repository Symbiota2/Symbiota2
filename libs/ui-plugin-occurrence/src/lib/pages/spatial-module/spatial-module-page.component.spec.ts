import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpatialModulePage } from './spatial-module-page.component';

describe('SpatialModuleComponent', () => {
  let component: SpatialModulePage;
  let fixture: ComponentFixture<SpatialModulePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpatialModulePage ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpatialModulePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
